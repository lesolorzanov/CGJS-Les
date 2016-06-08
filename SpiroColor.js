/*
  Took the example from spirograph in p5js
       the example for FFT for mic sound.
  Found a super SUPER simple PDA algorithm here 
  http://www.kaappine.fi/tutorials/fundamental-frequencies-and-detecting-notes/
  Implemented it and mapped it to color in HSV 
  Sing to color the pretty spirograph.
*/

var NUMSINES = 10; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var rad; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 0.005; // the speed of the central sine
var ratio = 1; // what multiplier for speed is each additional sine?
var alpha = 50; // how opaque is the tracing system

var trace = false; // are we tracing?

function setup() {
  createCanvas(710, 400);
  
  mic = new p5.AudioIn();
   mic.start();
   fft = new p5.FFT();
   fft.setInput(mic);

  rad = height/4; // compute radius for central circle
  background(204); // clear the screen

  for (var i = 0; i<sines.length; i++) {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }
}

function draw() {
  if (!trace) {
    background(204); // clear screen if showing geometry
    stroke(0, 255); // black pen
    noFill(); // don't fill
  } 

  // MAIN ACTION
  push(); // start a transformation matrix
  translate(width/2, height/2); // move to middle of screen
  
  var spectrum = fft.analyze();

    s = 0.0; 
    ind=0;
    fundfreq=0.0;
    
   for (i = 0; i<spectrum.length; i++) {
    if(s < spectrum[i]){
      s= spectrum[i];
      ind=i;
    }
    fundfreq=ind*sampleRate()/1024;
     
   }
   
   
   //text(fundfreq,width/2,height/2);

  for (var i = 0; i<sines.length; i++) {
    var erad = 0; // radius for small "point" within circle... this is the 'pen' when tracing
    // setup for tracing
    if (trace) {
      colorMode(HSB);
      c=color(map(fundfreq,0,1000,0,255),125,125,alpha);
      fill(c);
      stroke(c); 
      //fill(0, 0, 255, alpha/2); // also, um, blue
      fill(map(fundfreq,0,1000,0,255),10, 125);
      erad = 5.0*(1.0-float(i)/sines.length); // pen width will be related to which sine
      //erad=1.0;
      
    }
    var radius = rad/(i+1); // radius for circle itself
    rotate(sines[i]); // rotate circle
    if (!trace) ellipse(0, 0, radius*2, radius*2); // if we're simulating, draw the sine
    push(); // go up one level
    translate(0, radius); // move to sine edge
    if (!trace) ellipse(0, 0, 5, 5); // draw a little circle
    if (trace) ellipse(0, 0, erad, erad); // draw with erad if tracing
    pop(); // go down one level
    translate(0, radius); // move into position for next sine
    sines[i] = (sines[i]+(fund+(fund*i*ratio)))%TWO_PI; // update angle based on fundamental
  }
  
  pop(); // pop down final transformation
  
}

function keyReleased() {
  if (key==' ') {
    trace = !trace; 
    background(255);
  }
}
