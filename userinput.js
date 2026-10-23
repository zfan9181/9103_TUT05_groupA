// console.log("NEW userInput.js loaded");

let isDraggingFrame = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Magnification strength
let magnification = 1.12;


// Start dragging the frame
function mousePressed() {

  let left = frame.x - frame.width / 2;
  let right = frame.x + frame.width / 2;
  let top = frame.y - frame.height / 2;
  let bottom = frame.y + frame.height / 2;

  if (
    mouseX >= left &&
    mouseX <= right &&
    mouseY >= top &&
    mouseY <= bottom
  ) {
    isDraggingFrame = true;

    dragOffsetX = mouseX - frame.x;
    dragOffsetY = mouseY - frame.y;
  }
}


// Move the frame
function mouseDragged() {

  if (isDraggingFrame) {

    frame.x = constrain(
      mouseX - dragOffsetX,
      frame.width / 2,
      width - frame.width / 2
    );

    frame.y = constrain(
      mouseY - dragOffsetY,
      frame.height / 2,
      height - frame.height / 2
    );

  }
}


// Stop dragging
function mouseReleased() {
  isDraggingFrame = false;
}


// Display the magnifying effect
function displayMagnifier() {

  // Calculate the smaller source area
  let sourceW = frame.width / magnification;
  let sourceH = frame.height / magnification;

  let sourceX = frame.x - sourceW / 2;
  let sourceY = frame.y - sourceH / 2;

  // Capture the artwork underneath the frame
  let magnifiedArea = get(
    sourceX,
    sourceY,
    sourceW,
    sourceH
  );

  // Stretch that area to fill the frame
  image(
    magnifiedArea,
    frame.x - frame.width / 2,
    frame.y - frame.height / 2,
    frame.width,
    frame.height
  );

  // Draw the white frame on top
  frame.display();
}
