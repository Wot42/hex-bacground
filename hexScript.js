// option setters
const bg = true; // enables the backgrond hexes
const exp = true; // enabels the explode effect
const sp = true; // enabels the spot light effect
const hexColour = 'rgb(0, 30, 100)'; // colour for the hilight hex
const bgColour = 'rgb(0, 12, 37)'; // colour for the background hex
const spotLightColour = 'rgb(210, 255, 255)';
const spotDeepColour = 'rgb(102, 255, 255)';
const explodeSpeed = 10; // speed of the explotion efect
const maxSize = 20; // the sixe of all hexagons
const minSize = 0; // the minimum size of the hilight hexagons
const maxMouseRadius = 60; // radius from the mouse where the hilights hexes are at their max
const minMouseRadius = 200; // the radious from the mouse where the hilights hexes are at ther min
const growSpeed = 5; // the speed at which hilight hexes grow
const shrinkSpeed = 0.3; // the speed at which the hilight hexes shrink

// set up for later
let hexArray = [];
let bgArray = [];
let explodeArray = [];
const rootThree = Math.sqrt(3); // needed for hexagon calculations
let screenDiagonal = Math.sqrt(((window.innerWidth)*(window.innerWidth))+((window.innerHeight)*(window.innerHeight)));
let rowHex = null;
let columnHex = null;


// canvas for the growing and shrinking lighter hexes
const canvasHex = document.getElementById('canvasHex');
const ctxH = canvasHex.getContext('2d');
ctxH.canvas.width = window.innerWidth;
ctxH.canvas.height = window.innerHeight;

// canvas for the spot light and the exploding effect
const canvasSpot = document.getElementById('canvasSpot');
const ctxS = canvasSpot.getContext('2d');
ctxS.canvas.width = window.innerWidth;
ctxS.canvas.height = window.innerHeight;

//canvas for the fixed hexagones in the background. dosen't update with animation.
const canvasBackground = document.getElementById('canvasBackground');
const ctxB = canvasBackground.getContext('2d');
ctxB.canvas.width = window.innerWidth;
ctxB.canvas.height = window.innerHeight;

// mouse position
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

// explode when click
if (exp) {
window.addEventListener( 'click', () => explodeArray.push(new Explode(mouse.x, mouse.y)) )
}

class Hex {
  constructor(x, y, size, colour){
    this.x = x;
    this.y = y;
    this.size = size; // the curent hex size
    this.targetSize = 0; // the sixe the hex is growing or shrinking towards.
    this.colour = colour;
  }

  draw(){ // draws to ctxH
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

  drawBG(){ // draws to ctxB
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

  update(){ // sets tardet size and grows or shrinks to meet it.
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
    this.size = maxMouseRadius; // outer radius
    this.innerSize = 0; // inner radius
    this.done = false; // used to clear off screen explotions
    this.speed = explodeSpeed;
  }

  draw(){ // draws to ctxS
    let gradEx = ctxS.createRadialGradient(this.x, this.y, this.innerSize, this.x, this.y, this.size)
    gradEx.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradEx.addColorStop(0.2, spotLightColour);
    gradEx.addColorStop(0.7, spotDeepColour);
    gradEx.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctxS.fillStyle = gradEx;
    ctxS.fillRect(0, 0, innerWidth, innerHeight);
  }

  update(){  // grows the explotion
    this.size += explodeSpeed;
    this.innerSize += explodeSpeed;
    if (this.innerSize > screenDiagonal) this.done = true;
    this.draw();
  }

}

let drawSpot = () => { // draws to ctxS
  let grad = ctxS.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, maxMouseRadius*2/3)
  grad.addColorStop(0.2, spotLightColour);
  grad.addColorStop(0.7, spotDeepColour);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctxS.fillStyle = grad;
  ctxS.fillRect(0, 0, innerWidth, innerHeight);
}

let setUp = () => { // resets arrays and draws all setup hexs
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

let animate= () => { // calls all update functions

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

  if (sp) drawSpot();

  requestAnimationFrame(animate);
}

window.addEventListener('resize', // will call setUp if window size changes
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


setUp();
animate();
