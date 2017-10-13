function Button(xx, yy, ww, hh, ccol) {
  this.x = xx;
  this.y = yy;
  this.width = ww;
  this.height = hh;
  this.col = ccol;
  this.on = true;
  
  this.contains = function(ptX, ptY) {
    return ptX > this.x && ptX < this.x + this.width
     && ptY > this.y && ptY < this.y + this.height;
  }
  
  this.drawButton = function() {
    if (this.on) {
      //stroke(0);
      stroke(this.col);
      fill(this.col);
    }
    else {
      stroke(this.col);
      fill(0);
    }
    rect(this.x, this.y, this.width, this.height);
  }
}