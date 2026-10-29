// Perlin Noise and Randomness Mechanic
// Dynamic segmented background and living clothing

// DYNAMIC SEGMENTED BACKGROUND
let backgroundSegments = [];
let numSegments = 25;
let noiseIncrement = 0;

// BACKGROUND SEGMENT CLASS
class BackgroundSegment {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  display() {
    fill("#F49AB5");
    stroke(40);
    rect(this.x, this.y, this.width, this.height);
  }
}

//Divides the canvas into a grid
function createBackgroundSegments() {
     let segmentWidth = width / numSegments;
     let segmentHeight = height / numSegments;
     for (let y = 0; y < height; y += segmentHeight) {
         for (let x = 0; x < width; x += segmentWidth) {
            let segment = new BackgroundSegment(x,y,segmentWidth,segmentHeight);
         backgroundSegments.push(segment);
         }
  }
}

// Display 
function displayBackground() {

  for (let segment of backgroundSegments) {
    segment.display();
  }
}
