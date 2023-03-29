const canvasHex = document.getElementById('canvasHex');
const ctxH = canvasHex.getContext('2d');
ctxH.canvas.width = window.innerWidth;
ctxH.canvas.height = window.innerHeight;

const canvasSpot = document.getElementById('canvasSpot');
const ctxS = canvasSpot.getContext('2d');
ctxS.canvas.width = window.innerWidth;
ctxS.canvas.height = window.innerHeight;

const canvasBackground = document.getElementById('canvasBackground');
const ctxB = canvasBackground.getContext('2d');
ctxB.canvas.width = window.innerWidth;
ctxB.canvas.height = window.innerHeight;

let hexArray = [];
let bgArray = [];
let explodeArray = [];
const maxSize = 20;
const minSize = 0;
const maxMouseRadius = 60;
const minMouseRadius = 200;
const growSpeed = 5;
const shrinkSpeed = 0.3;
const rootThree = Math.sqrt(3);
let screenDiagonal = Math.sqrt(((window.innerWidth)*(window.innerWidth))+((window.innerHeight)*(window.innerHeight)));
let rowHex = null;
let columnHex = null;

const bg = true;
const hexColour = 'rgb(0, 30, 100)';
const bgColour = 'rgb(0, 12, 37)';
const explodeSpeed = 10;

let mouse = {
  x: null,
  y: null
};
window.addEventListener( 'mousemove',
  (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    //  console.log(mouse)
  }
)
window.addEventListener( 'click', () => explodeArray.push(new Explode(mouse.x, mouse.y)) )

class Hex {
  constructor(x, y, size, colour){
    this.x = x;
    this.y = y;
    this.size = size;
    this.targetSize = 0;
    this.colour = colour;
  }

  draw(){
    ctxH.beginPath();
    ctxH.moveTo(this.x-this.size, this.y);
    ctxH.lineTo(this.x-(this.size/2), this.y+(this.size*rootThree/2));
    ctxH.lineTo(this.x+(this.size/2), this.y+(this.size*rootThree/2));
    ctxH.lineTo(this.x+this.size, this.y);
    ctxH.lineTo(this.x+(this.size/2), this.y-(this.size*rootThree/2));
    ctxH.lineTo(this.x-(this.size/2), this.y-(this.size*rootThree/2));
    ctxH.closePath();
    ctxH.fillStyle = this.colour;
    ctxH.fill();
  }

  drawBG(){
    ctxB.beginPath();
    ctxB.moveTo(this.x-this.size, this.y);
    ctxB.lineTo(this.x-(this.size/2), this.y+(this.size*rootThree/2));
    ctxB.lineTo(this.x+(this.size/2), this.y+(this.size*rootThree/2));
    ctxB.lineTo(this.x+this.size, this.y);
    ctxB.lineTo(this.x+(this.size/2), this.y-(this.size*rootThree/2));
    ctxB.lineTo(this.x-(this.size/2), this.y-(this.size*rootThree/2));
    ctxB.closePath();
    ctxB.fillStyle = this.colour;
    ctxB.fill();
  }

  update(){
    let radius = Math.sqrt(((mouse.x-this.x)*(mouse.x-this.x))+((mouse.y-this.y)*(mouse.y-this.y)));

    if (radius < maxMouseRadius){
      this.targetSize = maxSize-1;
    } else if (radius < minMouseRadius) {
      this.targetSize = minSize + ((maxSize-minSize)*(1-(radius-maxMouseRadius)/(minMouseRadius-maxMouseRadius)));
    } else {
      this.targetSize = minSize;
    }

    if (this.size < this.targetSize && this.size+growSpeed < this.targetSize) {
      this.size += growSpeed;
    } else if (this.size > this.targetSize && this.size-shrinkSpeed > this.targetSize) {
      this.size -= shrinkSpeed;
    } else {
      this.size = this.targetSize;
    }

    this.draw();
  }
}

class Explode {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.size = maxMouseRadius;
    this.innerSize = 0;
    this.done = false;
    this.speed = explodeSpeed;
  }

  draw(){
    let gradEx = ctxS.createRadialGradient(this.x, this.y, this.innerSize, this.x, this.y, this.size)
    gradEx.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradEx.addColorStop(0.2, 'rgb(210, 255, 255)');
    gradEx.addColorStop(0.7, 'rgb(102, 255, 255)');
    gradEx.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctxS.fillStyle = gradEx;
    ctxS.fillRect(0, 0, innerWidth, innerHeight);
  }

  update(){
    this.size += explodeSpeed;
    this.innerSize += explodeSpeed;
    if (this.innerSize > screenDiagonal) this.done = true;
    this.draw();
  }

}

let drawSpot = () => {
  let grad = ctxS.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, maxMouseRadius*2/3)
  grad.addColorStop(0.2, 'rgb(210, 255, 255)');
  grad.addColorStop(0.7, 'rgb(102, 255, 255)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctxS.fillStyle = grad;
  ctxS.fillRect(0, 0, innerWidth, innerHeight);
}

let setUp = () => {
  hexArray = [];
  bgArray = [];
  explodeArray = [];
  rowHex = Math.floor(window.innerWidth/(maxSize*3))+2;
  columnHex = Math.floor(window.innerHeight/(maxSize*rootThree/2))+2;
  let x = 0;
  let y = 0;

  for (let r = 0; r < rowHex; r++){
    for (let c = 0; c < columnHex; c++){
      x = r*maxSize*3 + ((c%2 == 0) ? 0 : (maxSize*1.5));
      y = c*maxSize*rootThree/2;
      hexArray.push(new Hex(x, y, minSize, hexColour));
      if (bg) bgArray.push(new Hex(x, y, maxSize-1, bgColour));
    }
  }

  if (bg){
    for (let i = 0; i < bgArray.length; i++){
      bgArray[i].drawBG();
    }
  }
}

let animate= () => {

  ctxH.clearRect(0, 0, innerWidth, innerHeight);
  ctxS.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < hexArray.length; i++){
    hexArray[i].update();
  }

  if (explodeArray.length > 0) {
    for (let i =  explodeArray.length-1 ; i >= 0; i--){
      explodeArray[i].update();
      if (explodeArray[i].done) explodeArray.splice( i, 1);
    }
  }

  drawSpot();
  requestAnimationFrame(animate);
}

setUp();
animate();

window.addEventListener('resize',
  function () {
    ctxB.canvas.width = window.innerWidth;
    ctxB.canvas.height = window.innerHeight;
    ctxS.canvas.width = window.innerWidth;
    ctxS.canvas.height = window.innerHeight;
    ctxH.canvas.width = window.innerWidth;
    ctxH.canvas.height = window.innerHeight;

    setUp();
  }
)
