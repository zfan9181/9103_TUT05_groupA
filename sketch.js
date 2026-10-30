// let referenceImg;

function preload(){
  // referenceImg = loadImage("assets/artwork.jpg")
  loadMusic(); // load music
}

function setup() {
  createCanvas(800, 800);
  
  createArtwork();
  setupMusic(); // click to play music
  createBackgroundSegments();
  setupSides(); // background on the sides of the screen
  
}

function draw() {
  
  // tint(255,50)
  // image(referenceImg, 0, 0, width, height);
  // noTint();

  updateMouth(); // mouth moves with music
  updateBlush(); // blush changes with the beat
  updateHair(); // hair moves with the beat
  updateBars(); // white bars move like an equaliser
  displayArtwork();
  updateTear();
  displayMagnifier();
  updateEyeTraking();
  updateVolume(); // arrow keys to change volume
  // frame.display();
  updateBackground(); //background color changes 
  updateSides(); // copy the background to the sides, keep this last

}