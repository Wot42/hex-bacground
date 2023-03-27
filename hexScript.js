const canvasHex = document.getElementById('canvasHex');
const ctxH = canvasHex.getContext('2d');
ctxH.canvas.width = window.innerWidth;
ctxH.canvas.height = window.innerHeight;

var hexArray = [];
const maxSize = 40;
const minSize = 0;
const maxMouseRadius = 100;
const minMouseRadius = 300;
const rootThree = Math.sqrt(3);
var rowHex = null;
var columnHex = null;

var mouse = {
  x: null,
  y: null
};

class Hex {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.colour = 'black';
  }

  draw(){
    ctxH.beginPath();
    ctxH.moveTo(this.x - this.size, this.y);
    ctxH.lineTo(this.x - (this.size/2), this.y + (this.size * rootThree/2));
    ctxH.lineTo(this.x + (this.size/2), this.y + (this.size * rootThree/2));
    ctxH.lineTo(this.x + this.size, this.y);
    ctxH.lineTo(this.x + (this.size/2), this.y - (this.size * rootThree/2));
    ctxH.lineTo(this.x - (this.size/2), this.y - (this.size * rootThree/2));
    ctxH.closePath();
    ctxH.fillStyle = this.colour;
    ctxH.fill();
  }
}

var setUp = () => {
  hexArray = [];
  rowHex = Math.floor(window.innerWidth/(maxSize*3))+2;
  columnHex = Math.floor(window.innerHeight/(maxSize*rootThree/2))+2;
  var x = 0;
  var y = 0;

  for (var r = 0; r < rowHex; r++){
    for (var c = 0; c < columnHex; c++){
      x = r*maxSize*3 + ((c%2 == 0) ? 0 : (maxSize*1.5));
      y = c*maxSize*rootThree/2;
      hexArray.push(new Hex(x,y,maxSize-1));
    }
  }
  hexArray.forEach(hex => {hex.draw();});
}

// var testHex = new Hex(100,100,50);
// testHex.draw();
setUp();
