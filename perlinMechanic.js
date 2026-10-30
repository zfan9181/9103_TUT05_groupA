// Perlin Noise and Randomness Mechanic
// Dynamic segmented background and living clothing

// DYNAMIC SEGMENTED BACKGROUND
let backgroundSegments = [];
let numSegments = 25;
let backgroundFlow = 0; // This value will  make the cloud-like colour clusters move

// BACKGROUND SEGMENT CLASS
class BackgroundSegment {    
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }   // Represents one small rectangle in the segmented background.

 //Perlin noise gives each segment a smooth value based on its position, nearby segments get similar values so their colours can form connected areas
  display() {
    // Control the size of the cloud-like colour groups
    let noiseX = this.x * 0.003 - backgroundFlow;
    let noiseY = this.y * 0.003; 

    let noiseValue = noise(noiseX, noiseY);  // Get the Perlin noise value
    
    // Set the background colour and cloud colour
    let backgroundColour = color("#F49AB5");
    let cloudColour = color("#FFFFFF");

    // This variable stores the final color of this segment
    let segmentColour=backgroundColour;

    // Control the Clouds appear more strongly near the top of the canvas
    let cloudFade = map(this.y, 0, height * 0.6, 1, 0);
    if (cloudFade < 0) {
      cloudFade = 0;
}

    // Higher noise values create the white cloud areas
    if (noiseValue > 0.4) {

      let colourAmount = map(noiseValue, 0.4, 0.75, 0, 1);
      colourAmount = colourAmount * cloudFade;
      
      segmentColour = lerpColor(backgroundColour, cloudColour, colourAmount);
    }
 

    // Draw this segment
    fill(segmentColour);
    stroke(100);
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

// Display all segments 
function displayBackground() {

  for (let segment of backgroundSegments) {
    segment.display();
  }
}

//Update the background movement speed based on wind intensity
function updateBackground() {

  // Stronger wind makes the cloud-like colour clusters move faster
  let backgroundSpeed = map(weather.windIntensity, 0.1, 1, 0.001, 0.02);
  backgroundFlow += backgroundSpeed;
}