// declare global variables
var apiKey = "YHL6fnnc2U2ETsL6-hE3LA"; // API key

// toggle booleans
var greenOn;
var redOn;
var blueOn;
var orangeOn;
var greenLabelsOn;
var stationOn;
var ghostsOn;
var slideOn;

// leftmost lon: -71.252604
// right most lon -70.991421
// topmost lat 42.436697
// bottom lat 42.207286

// total lon width: .261183 = 1000/3828.73311
// total lat height: .229411 = 600/2615.3933333

// arrays
var routes = [];
var vehicles = [];
var newVehicles = [];
var ghosts = [];
var stations = [];
var buttons = [];
var thex=0;

// what types of vehicles are included
var modesRange = 2;

// update numbers
var updateInterval = 10;
var framesSinceUpdate = 0;

// canvas size
var w = 1000;
var h = 630;

var zoom;
var framesPerSec;
var offsetX = w/2;
var offsetY = h/2;
var lastClickX;
var lastClickY;

function setup() {
  framesPerSec = 30;
  var theCanvas = createCanvas(w, h);
  theCanvas.parent('theCanvas');
  frameRate(30);
  background(0);
  
  greenOn = true;
  redOn = true;
  blueOn = true;
  orangeOn = true;
  stationOn = true;
  greenLabelsOn = false;
  ghostsOn = true;
  zoom = 1;
  
  
  buttons.push(new Button(0,h-30,w/8-1,30,color(0,255,0)));
  buttons.push(new Button(w/8,h-30,w/8-1,30,color(255,0,0)));
  buttons.push(new Button(w/8*2,h-30,w/8-1,30,color(255,137,0)));
  buttons.push(new Button(w/8*3,h-30,w/8-1,30,color(0,0,255)));
  buttons.push(new Button(w/8*4,h-30,w/8-1,30,color(255)));
  buttons[4].on = false;
  buttons.push(new Button(w/8*5,h-30,w/8-1,30,color(100)));
  buttons.push(new Button(w/8*6,h-30,w/8-1,30,color(200)));
  
  fill(255);
  noStroke();
  
  var getRoutes = "http://realtime.mbta.com/developer/api/v2/routes?"
                 + "api_key=YHL6fnnc2U2ETsL6-hE3LA&format=json";
  loadJSON(getRoutes, loadRoutes);
  
}

function Stations() {
  var getStations;
  for (var ii = 0; ii < routes.length; ii++) {
    getStations = "http://realtime.mbta.com/developer/api/v2/stopsbyroute?"
                 + "api_key=YHL6fnnc2U2ETsL6-hE3LA&route="
                 + routes[ii]
                 + "&format=json";
    
    loadJSON(getStations, loadStations);
  }
}

function loadStations(data) {
  var stops = data.direction[0].stop;
  for (var ii = 0; ii < stops.length; ii++) {
    var v = new Vehicle(stops[ii].stop_lon, stops[ii].stop_lat, "Stop", stops[ii].parent_station_name);
    stations.push(v);
  }
}

function loadRoutes(data) {
  var modes = data.mode;
  for (var ii = 0; ii < modes.length; ii++) { //for each route type
    if (modes[ii].route_type < modesRange) { //if the route type is to be included
      for (var jj = 0; jj < modes[ii].route.length; jj++) { //for each route
        routes.push(modes[ii].route[jj].route_id); //add id to routes array
      }
    }
  }
  update();
  Stations();
}

function draw() {
  background(0); //black background
  
  text("MBTA", w/2-20, 30);
  
  noStroke();
  fill(255);
  
  if ((framesSinceUpdate / framesPerSec) >= updateInterval - 1) {
    drawVehicles();
    framesSinceUpdate = 0;
    update();
  }
  else {
    framesSinceUpdate++;
  }
  if (stationOn) {
    for (var ii = 0; ii < stations.length; ii++) {
      stations[ii].drawVehicle();
    }
  }
  drawVehicles();
  
  for (var ii = 0; ii < buttons.length; ii++) {
    buttons[ii].drawButton();
  }
  
  stroke(255); //white outline
  noFill(); //no fill
  rect(0,0,w-1,h-1); //outline
}

function drawVehicles() {
  if (ghostsOn) {
    noStroke();
    fill(255,100);
    for (var ii = 0; ii < ghosts.length; ii++) {
      ellipse(ghosts[ii].lonToX(ghosts[ii].lon) * zoom + offsetX * zoom - (w/2) * zoom,
              ghosts[ii].latToY(ghosts[ii].lat) * zoom + offsetY * zoom - (h/2) * zoom,
              5,5);
      
    }
  }
  for (var ii = 0; ii < vehicles.length; ii++) {
    vehicles[ii].drawVehicle();
  }
}

function update() {
  newVehicles = []; //new list of vehicles
  var url;
  
  for (var ii = 0; ii < routes.length; ii++) { //for each route
    url = makeURL(routes[ii]); //make a url for the route's vehicles
    loadJSON(url, loadVehicles); //get json for vehicles by route
  }
  vehicles = newVehicles;
}

function loadVehicles(data) {
  var vType = data.mode_name; // vehicle type
  var vId = data.route_id; //route id
  
  
  for (var ii = 0; ii < data.direction.length; ii++) { // for each direction
    for (var jj = 0; jj < data.direction[ii].trip.length; jj++) { //for each trip
      var v = new Vehicle(data.direction[ii].trip[jj].vehicle.vehicle_lon,
                          data.direction[ii].trip[jj].vehicle.vehicle_lat,
                          vType,
                          vId);
      newVehicles.push(v);
      ghosts.push(v);
    }
  }
}

function makeURL(str) {
  /* 
  http://realtime.mbta.com/developer/api/v2/
  stopsbylocation
  ?api_key=YHL6fnnc2U2ETsL6-hE3LA
  &lat=42.346961&lon=-71.076640
  &format=json
  */

  var url = "http://realtime.mbta.com/developer/api/v2/vehiclesbyroute?api_key=";
  url += apiKey;
  url += "&route=";
  url += str;
  url += "&format=json";
  return url;
}

function mousePressed() {
  if (mouseY < h - 30) {
    slideOn = !slideOn;
    offsetX = mouseX;
    offsetY = mouseY;
  }
  for (var ii = 0; ii < buttons.length; ii++) {
    if (buttons[ii].contains(mouseX, mouseY)) {
       switch (ii) {
         case 0: greenOn = !greenOn;
                 break;
         case 1: redOn = !redOn;
                 break;
         case 2: orangeOn = !orangeOn;
                 break;
         case 3: blueOn = !blueOn;
                 break;
         case 4: greenLabelsOn = !greenLabelsOn;
                 break;
         case 5: ghostsOn = !ghostsOn;
                 break;
         case 6: stationOn = !stationOn;
                 break;
       }
       buttons[ii].on = !buttons[ii].on;
       draw();
    }
  }
}

function mouseWheel(event) {
  if (mouseX > 0 && mouseX < w && mouseY > 0 && mouseY < h) {
    zoom += event.delta * .01;
    offset *= zoom;
  }
}

function mouseDragged() {
  if (mouseY < h - 30) {
    offsetX = mouseX;
    offsetY = mouseY;
  }
}

/*
Wishlist:
- easing
- rollover stations

- 3d?
- making a web
- late trains
- distance from station
- speed
- flip cardinal directions

*/