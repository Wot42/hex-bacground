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
    var radius = Math.sqrt(((mouse.x-this.x)*(mouse.x-this.x))+((mouse.y-this.y)*(mouse.y-this.y)));

    // square turn to radius
    if (radius < maxMouseRadius){
      this.targetSize = maxSize - 1;
      // set mid range
    } else if (radius < minMouseRadius) {
      this.targetSize = minSize + ((maxSize-minSize)*(1-(radius-maxMouseRadius)/(minMouseRadius-maxMouseRadius)));
    }else{
      this.targetSize = minSize;
    }
    if (this.size < this.targetSize) this.size += 5;
    if (this.size > this.targetSize) this.size -= 0.2;

    if (this.size < this.targetSize && this.size > this.targetSize-0.5 ) this.size = this.targetSize;
    if (this.size > this.targetSize && this.size < this.targetSize+5 ) this.size = this.targetSize;



    // if (this.size > maxSize - 1) this.size = maxSize - 1;
    //  if (this.size < minSize) this.size = minSize;



    this.draw();
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

function animate() { //REFACTOR
  requestAnimationFrame(animate);
  ctxH.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < hexArray.length; i++){
    hexArray[i].update();
  }

  // console.log(hexArray[0].)
}

// var testHex = new Hex(100,100,50);
// testHex.draw();
setUp();
animate();
