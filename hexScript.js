const canvasHex = document.getElementById('canvasHex');
const ctxH = canvasHex.getContext('2d');
ctxH.canvas.width = window.innerWidth;
ctxH.canvas.height = window.innerHeight;

let hexArray = [];
const maxSize = 100;
const minSize = 0;
const maxMouseRadius = 100;
const minMouseRadius = 300;
const rootThree = Math.sqrt(3);

let mouse = {
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

let testHex = new Hex(100,100,50);
testHex.draw();
