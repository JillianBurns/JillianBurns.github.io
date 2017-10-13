function Vehicle(llon, llat, ttype, iid) {
  //class variables here combined with constructor
  this.lon = llon; // x position
  this.lat = llat; // y position
  this.dia = 10; // diameter
  this.type = ttype; // vehicle type as a string
  this.id = iid; //vehicle id as a string
  this.prevY = "A";
  this.prevX = "A";
  
  this.setColor = function() {
    noStroke();
    noFill();
	print("type:" +  this.type);
    switch(this.type) {
      case "Stop": stroke(200);
                   fill(0);
                   this.dia = 5;
        break;
      case "Subway":
        switch(this.id) {
          case "Green-B":
          case "Green-C":
          case "Green-D":
          case "Green-E": if (greenOn) {fill(0,255,0)};
            break;
          case "Red": if (redOn) {fill(255,0,0)};
            break;
          case "Blue": if (blueOn) {fill(0,0,255)};
            break;
          case "Orange": if (orangeOn) {fill(255,137,0)};
            break;
          case "Mattapan": fill(227,229,67);
		    break; // CJE added
          default: stroke(255);
                   fill(0);
        }
        break;
      case "Bus": fill(64,39,170);
        break;
      case "Commuter Rail": fill(227,229,67);
        break;
      case "Boat": fill(145,55,170);
        break;
      default: stroke(255);
               fill(0);
    }
  };
  
  this.lonToX = function(alon) {
    var temp = Math.floor((Number(alon) + 71.252604) * 3828.73311)
    return temp;
  };
  
  this.latToY = function(alat) {
    return Math.floor((alat - 42.207286) * -2615.3933333) + 600;
    //return Math.floor((alat - 42.207286) * 3828.73311);
  };
  
  this.containsXY = function(x, y, rad) {
    var y1 = (this.latToY(this.lat) + offsetY - (h/2)) * zoom;
    var x1 = (this.lonToX(this.lon) + offsetX - (w/2)) * zoom;
    return Math.abs(x1-x) < rad && Math.abs(y1-y) < rad;
  };
  
  this.drawVehicle = function() {
    /*if (this.prevX = "A") {
      this.prevX = this.lonToX(this.lon);
      this.prevY = this.lonToX(this.lon);;
    }
    var actualX = this.lonToX(this.lon);
    var actualY = this.latToY(this.lat);
    
    var diffX = actualX - this.prevX;
    var diffY = actualY - this.prevY;
    
    print(framesSinceUpdate);
    var newX = this.prevX + (diffX * framesSinceUpdate / 30);
    var newY = this.prevY + (diffY * framesSinceUpdate / 30);
    */
    var y = (this.latToY(this.lat) + offsetY - (h/2)) * zoom;
    var x = (this.lonToX(this.lon) + offsetX - (w/2)) * zoom;
    if (slideOn) {
      offsetX = mouseX;
      offsetY = mouseY;
    }
    
    if (this.containsXY(mouseX, mouseY, 5) && stationOn && this.type == "Stop") {
      noStroke();
      fill(255);
      text(this.id, x,y);
    }
    
    // draw the dot
    this.setColor();
    ellipse(x,y,this.dia,this.dia);
    if (this.id.includes("Green") && greenLabelsOn) {
      fill(255);
      text(this.id.substring(6,7),x-(this.dia*.5)+1,y+(this.dia*.5)-1);
    }
    
    //this.prevX = this.actualX;
    //this.prevY = this.actualY;
  };
}