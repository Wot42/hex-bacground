const canvasHex = document.getElementById('canvasHex');
const ctxH = canvasHex.getContext('2d');
ctxH.canvas.width = window.innerWidth;
ctxH.canvas.height = window.innerHeight;

const canvasSpot = document.getElementById('canvasSpot');
const ctxS = canvasSpot.getContext('2d');
ctxS.canvas.width = window.innerWidth;
ctxS.canvas.height = window.innerHeight;

let hexArray = [];
const maxSize = 30;
const minSize = 0;
const maxMouseRadius = 60;
const minMouseRadius = 200;
const growSpeed = 5;
const shrinkSpeed = 0.3;
const rootThree = Math.sqrt(3);
let rowHex = null;
let columnHex = null;

let mouse = {
  x: null,
  y: null
};
window.addEventListener( 'mousemove',
  (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
     console.log(mouse)
  }
)

class Hex {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.targetSize = 0;
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

  update(){
    let radius = Math.sqrt(((mouse.x-this.x)*(mouse.x-this.x))+((mouse.y-this.y)*(mouse.y-this.y)));

    if (radius < maxMouseRadius){
      this.targetSize = maxSize - 1;
    } else if (radius < minMouseRadius) {
      this.targetSize = minSize + ((maxSize-minSize)*(1-(radius-maxMouseRadius)/(minMouseRadius-maxMouseRadius)));
    } else {
      this.targetSize = minSize;
    }

    if (this.size < this.targetSize && this.size + growSpeed < this.targetSize) {
      this.size += growSpeed;
    } else if (this.size > this.targetSize && this.size - shrinkSpeed > this.targetSize) {
      this.size -= shrinkSpeed;
    } else {
      this.size = this.targetSize;
    }

    this.draw();
  }
}

let drawSpot = () => {
  ctxS.beginPath();



}

let setUp = () => {
  hexArray = [];
  rowHex = Math.floor(window.innerWidth/(maxSize*3))+2;
  columnHex = Math.floor(window.innerHeight/(maxSize*rootThree/2))+2;
  let x = 0;
  let y = 0;

  for (let r = 0; r < rowHex; r++){
    for (let c = 0; c < columnHex; c++){
      x = r*maxSize*3 + ((c%2 == 0) ? 0 : (maxSize*1.5));
      y = c*maxSize*rootThree/2;
      hexArray.push(new Hex(x,y,minSize));
    }
  }
  // hexArray[75].colour = "red";
}

let animate= () => {

  ctxH.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < hexArray.length; i++){
    hexArray[i].update();
  }
  requestAnimationFrame(animate);

  // console.log("target", hexArray[75].targetSize, "size", hexArray[75].size );
}

// var testHex = new Hex(100,100,50);
// testHex.draw();
setUp();
animate();
