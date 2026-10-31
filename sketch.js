// let referenceImg;

// FULL SCREEN LAYOUT
// The canvas fills the window. The portrait is still drawn at 800 x 800,
// then scaled to fit the middle of the screen.
const ART_SIZE = 800;
let artScale = 1;
let artX = 0;
let artY = 0;

// Work out how big the portrait is and where it sits on the screen
function updateArtLayout() {
  artScale = min(width, height) / ART_SIZE;
  artX = (width - ART_SIZE * artScale) / 2;
  artY = (height - ART_SIZE * artScale) / 2;
}

// Anything drawn between startArt() and endArt() uses portrait coordinates (0 - 800)
function startArt() {
  push();
  translate(artX, artY);
  scale(artScale);
}

function endArt() {
  pop();
}

// Mouse position in portrait coordinates (0 - 800), use these instead of mouseX / mouseY
function artMouseX() {
  return (mouseX - artX) / artScale;
}

function artMouseY() {
  return (mouseY - artY) / artScale;
}

// Keep the canvas the same size as the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateArtLayout();
  createBackgroundSegments(); // rebuild the background for the new size
}

function preload(){
  // referenceImg = loadImage("assets/artwork.jpg")
  loadMusic(); // load music
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateArtLayout();
  
  createArtwork();
  setupMusic(); // click to play music
  createBackgroundSegments();
  createOrangeFragments();
  createBlueFragments();
  createYellowTriangleFragments();
  createBlackTriangleFragments();

}

function draw() {
  
  // tint(255,50)
  // image(referenceImg, 0, 0, width, height);
  // noTint();

  updateMouth(); // mouth moves with music
  updateBlush(); // blush changes with the beat
  updateHair(); // hair moves with the beat
  updateBars(); // white bars move like an equaliser
  displayArtwork(); // background and weather fill the screen, the portrait sits in the middle

  startArt(); // these are drawn on the portrait
  displayClothingFragments();
  updateTear();
  displayMagnifier();
  endArt();

  updateEyeTraking();
  updateVolume(); // arrow keys to change volume
  // frame.display();
  updateBackground(); //background color changes 

}