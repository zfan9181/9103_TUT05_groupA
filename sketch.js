// let referenceImg;

function preload(){
  // referenceImg = loadImage("assets/artwork.jpg")
}

function setup() {
  createCanvas(800, 800);
  
  createArtwork();

  
}

function draw() {
  
  // tint(255,50)
  // image(referenceImg, 0, 0, width, height);
  // noTint();

  displayArtwork();
  displayMagnifier();
  // frame.display();
  
}
