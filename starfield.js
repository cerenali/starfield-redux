// GAME: STARFIELD REDUX

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var numStars = 500;
var radius = 2.5;
var focalLength = canvas.width;

var centerX = canvas.width/2;
var centerY = canvas.height/2;

var boxWidth = 120;
var boxHeight = 70;

var time = 0;
var collisionTimer;
var didCollide;
var zSpeed = 8;
var playerSpeed = 1;
var stars = [], star;
var mouseDown = false;
var i;
var keys = [];
var pixelOffset = 30;
// keys[0] = left, keys[1] = right; 2->up, 3->down, 4->spacebar
// 0->not pressed, 1->pressed

var distance;

/************************************/
// shim layer with setTimeout fallback
// from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

initialize();
startScreen();
// (function animate(){
//   requestAnimFrame(animate);
//   drawStars();
//   moveStars();
//   drawScores();
// })(); // call function immediately after defining it

function animate(){
  requestAnimFrame(animate);
  drawStars();
  moveStars();
  drawScores();
}

/************************************/

function rand255(){
  return Math.floor(Math.random()*255);
}

function initialize(){
  collisionTimer = 0;
  distance = 0;
  didCollide = false;
  mouseDown = false;
  // initialize stars
  for(i = 0; i < numStars; i ++){
    star = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      color: 'rgb('+rand255()+','+rand255()+','+rand255()+')'
    };
    stars.push(star);
  }
}

function moveStars(){
  time += 0.1;
  
  for(i = 0; i < numStars; i ++){
    star = stars[i];
    
    if (keys[4] == 1) { // spacebar pressed
      if (zSpeed < 30) {
        zSpeed += 0.001;
      }
    } else if (zSpeed > 5) {
      zSpeed = 5;
    }
    
    star.z -= zSpeed;
    if (keys[0] == 1) {
      star.x += playerSpeed;
    } else if (keys[1] == 1) {
      star.x -= playerSpeed;
    }
    if (keys[2] == 1) {
      star.y += playerSpeed;
    } else if (keys[3] == 1) {
      star.y -= playerSpeed;
    }
    if(star.z < 10){
      star.z = canvas.width;
      star.x = Math.random()* canvas.width * 1.3;
      star.x = star.x - (star.x-centerX)/1.8;
      star.y = Math.random() * canvas.height * 1.3;
      star.y = star.y - (star.y-centerY)/1.8;
      rand = Math.random() * 100;
      if (rand < 0.3) {
        star.x = centerX;
        star.y = centerY;
      }
      if (keys[0] == 1) {
        star.x -= pixelOffset;
      }
      if (keys[1] == 1) {
        star.x += pixelOffset;
      }
      if (keys[2] == 1) {
        star.y -= pixelOffset;
      }
      if (keys[3] == 1) {
        star.y += pixelOffset;
      }
    }
  }
  distance += 1;
}

function drawStars(){
  var pixelX, pixelY, pixelRadius;
  
  // bkd
  c.fillStyle='rgba(0,0,0,1)';
  c.fillRect(0,0,canvas.width,canvas.height);
  
  // stars
  for(i = 0; i < numStars; i ++){
    star = stars[i];
    
    // 3D projection equations
    var projectionFactor = focalLength/star.z;
    pixelX = (star.x-centerX)*projectionFactor;
    pixelX += centerX;
    pixelY = (star.y-centerY)*projectionFactor;
    pixelY += centerY;
    pixelRadius = radius*projectionFactor;
    
    // collision detection
    if (collide(star, pixelX, pixelY, pixelRadius)) {
      didCollide = true;
    }
    
    var collideFlashTime = 2000;
    if (didCollide && collisionTimer < collideFlashTime) {
      c.fillStyle='rgba(255,0,0,0.01)';
      c.fillRect(0,0,canvas.width,canvas.height);
      collisionTimer++;
      distance = 0;
    } else if (collisionTimer >= collideFlashTime) {
      collisionTimer = 0;
      didCollide = false;
    }
    
    c.beginPath();
    c.arc(pixelX, pixelY, pixelRadius, 0, 2*Math.PI);
    c.fillStyle = star.color;
    c.fill();
  }
}

function collide(star, pixelX, pixelY, pixelRadius) {
  var thresholdRadius = 200;
  var distance = Math.sqrt(Math.pow(pixelX-centerX, 2) + Math.pow(pixelY-centerY, 2));
  
//   c.beginPath();
//   c.arc(centerX, centerY, thresholdRadius, 0, 2*Math.PI);
//   c.fillStyle = 'rgba(255,255,255,0.01)';
//   c.fill();
 
  if (star.z <= 12 && thresholdRadius + pixelRadius > distance) {
    return true;
  }
  return false;
}

function drawScores(){
  c.font = "bold 48px sans-serif";
  c.textAlign = "left";
  c.textBaseline = "bottom";
  
  c.fillStyle = "white";
  c.fillText(+distance, radius*3, canvas.height - radius);
}

function startScreen() {
  c.fillStyle = "black";
  c.fillRect(0,0,canvas.width,canvas.height);
  
  // title
  c.font = "bold 48px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "bottom";
  c.fillStyle = "white";
  c.fillText("starfield redux", centerX, canvas.height*3/8);
  
  // play box
  c.fillStyle = "white";
  c.fillRect(centerX-boxWidth/2, centerY-boxHeight/2, boxWidth, boxHeight);
  
//   var margin = 10;
//   c.strokeStyle = "white";
//   c.lineWidth = 5;
//   c.strokeRect(centerX-boxWidth/2-margin, centerY-boxHeight/2-margin, boxWidth+margin*2, boxHeight+margin*2);
  
  // play text
  c.font = "bold 40px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = "black";
  c.fillText("play", centerX, centerY);
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) { // left
      keys[0] = 1;
    } else if (event.keyCode == 39) { // right
      keys[1] = 1;
    }
    if (event.keyCode == 38) { // up
      keys[2] = 1;
    } else if (event.keyCode == 40) { // down
      keys[3] = 1;
    }
  
  if (event.keyCode == 32) { // spacebar
    keys[4] = 1;
  }
});

document.addEventListener('keyup', function(event) {
    if (event.keyCode == 37) { // left
      keys[0] = 0;
    } else if (event.keyCode == 39) { // right
      keys[1] = 0;
    }
    if (event.keyCode == 38) { // up
      keys[2] = 0;
    } else if (event.keyCode == 40) { // down
      keys[3] = 0;
    }
  
  if (event.keyCode == 32) { // spacebar
    keys[4] = 0;
  }
});

document.addEventListener('mousemove', function(event) {
    if (event.x > centerX-boxWidth/2 && event.x < centerX+boxWidth/2 &&
        event.y > centerY-boxHeight/2 && event.y < centerX+boxHeight/2) {
      // play box
      c.fillStyle = "black";
      c.fillRect(centerX-boxWidth/2, centerY-boxHeight/2, boxWidth, boxHeight);

      // play text
      c.font = "bold 40px sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = "white";
      c.fillText("play", centerX, centerY);
    } else {
      // play box
      c.fillStyle = "white";
      c.fillRect(centerX-boxWidth/2, centerY-boxHeight/2, boxWidth, boxHeight);

      // play text
      c.font = "bold 40px sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = "black";
      c.fillText("play", centerX, centerY);
    }
});

canvas.addEventListener("mousedown", function(e){
    if (event.x > centerX-boxWidth/2 && event.x < centerX+boxWidth/2 &&
        event.y > centerY-boxHeight/2 && event.y < centerX+boxHeight/2) {
      animate();
    }
});