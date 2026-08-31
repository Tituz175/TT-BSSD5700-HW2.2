/*
Lesson 2.2 Homework - Frame differencing with swipes and keyboard controls
Based on the class code from Lesson 2.2, built from the p5 examples
DOM: Capture and DOM: Video Pixels, and Daniel Shiffman's frame
differencing video: https://youtube.com/watch?v=QLHMtE5XsMs&t=41s
*/

let capture;
let pFrame;
let motionX, motionY;
let lerpX, lerpY;
let bgC;
let lastMotionX, lastMotionY;

let pixelThreshold = 1000; 
let motionThreshold = 12;  

let showVideo = false;
let debug = false;
let stepSize = 5;

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  pFrame = createImage(640,480);
  capture.hide();
  motionX = width/2;
  motionY = height/2;
  lastMotionX = motionX;
  lastMotionY = motionY;
  bgC = color(0);
  lerpX = motionX;
  lerpY = motionY;
  noStroke();
  fill(0);
}

function draw() {
  background(bgC);
  pFrame.copy(capture,
              0,0, capture.width, capture.height,
              0,0, capture.width, capture.height);
  capture.loadPixels();
  pFrame.loadPixels();

  push();
  scale(-1,1);
  translate(-width,0);

  let avgX = 0;
  let avgY = 0;
  let count = 0;
  for (let y = 0; y < height; y += stepSize) {
    for (let x = 0; x < width; x += stepSize) {
      const i = y * width + x;
      let pr = pFrame.pixels[i*4]
      let pg = pFrame.pixels[i*4+1]
      let pb = pFrame.pixels[i*4+2]

      let r = capture.pixels[i*4]
      let g = capture.pixels[i*4+1]
      let b = capture.pixels[i*4+2]
      let pxC = color(r,g,b,150); //changed it from prev

      let dist = distanceSq(pr, pg, pb, r, g, b);
      if(dist > motionThreshold*motionThreshold){
        avgX += x;
        avgY += y
        count++;
      }
      if(showVideo){
        fill(pxC);
        square(x, y, stepSize);
      }
    }
  }

  if(count > pixelThreshold){
    motionX = avgX/count;
    motionY = avgY/count;
  }
  lerpX = lerp(lerpX, motionX, 0.1);
  lerpY = lerp(lerpY, motionY, 0.1);

  if(lastMotionX > motionX){
    bgC = color(255,0,0);
  } else if(lastMotionX < motionX){
    bgC = color(0,0,255);
  }
  lastMotionX = motionX;

  if(lastMotionY > motionY){
    showVideo = true;
  } else if(lastMotionY < motionY){
    showVideo = false;
  }//don't test for ==
  lastMotionY = motionY;

  if(debug){
    fill(0,255,0);
    circle(lerpX, lerpY, 25);
  }
  pop();
}

function distanceSq(x1, y1, z1, x2, y2, z2) {
  return ((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1));
}

function keyPressed() {
  if (key == 'd') {
    debug = !debug;
  } else if (key == '+' || key == '=') {
    stepSize++;
  } else if (key == '-' || key == '_') {
    stepSize = stepSize - 1;
    if (stepSize < 1) {
      stepSize = 1;
    }
  }
}