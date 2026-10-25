// let referenceImg;

function preload(){
  // referenceImg = loadImage("assets/artwork.jpg")
  loadMusic(); // load music
}

function setup() {
  createCanvas(800, 800);
  
  createArtwork();
  setupMusic(); // click to play music
  
}

function draw() {
  
  // tint(255,50)
  // image(referenceImg, 0, 0, width, height);
  // noTint();

  updateMouth(); // mouth moves with music
  displayArtwork();
  displayMagnifier();
  updateVolume(); // arrow keys to change volume
  // frame.display();
  
}