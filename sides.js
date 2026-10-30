// Fill the sides of the screen with the background
let sideBackground;
let stripSize = 96; 

function setupSides() {
  sideBackground = createGraphics(windowWidth, windowHeight);
  sideBackground.show();
  sideBackground.style("position", "fixed");
  sideBackground.style("left", "0");
  sideBackground.style("top", "0");
  sideBackground.style("z-index", "-1");
}

function updateSides() {
  // Match the size of the window
  if (sideBackground.width != windowWidth || sideBackground.height != windowHeight) {
    sideBackground.resizeCanvas(windowWidth, windowHeight);
  }

  // Where the artwork is on the screen
  let size = min(windowWidth, windowHeight);
  let s = size / width;
  let left = (windowWidth - size) / 2;
  let top = (windowHeight - size) / 2;
  let tileW = stripSize * s;

  // Copy the edges of the artwork outwards
  // every second copy is flipped so the colours join up
  for (let k = 0; left - k * tileW > 0; k++) {
    let flip = k % 2 == 0;
    drawStrip(0, flip, left - (k + 1) * tileW, top, tileW, size);
    drawStrip(width - stripSize, flip, left + size + k * tileW, top, tileW, size);
  }
}

// Draw one strip of the artwork onto the side background
function drawStrip(sourceX, flip, x, y, w, h) {
  let ctx = sideBackground.drawingContext;
  let d = pixelDensity();
  ctx.save();
  if (flip) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x, y);
  }
  ctx.drawImage(drawingContext.canvas, sourceX * d, 0, stripSize * d, height * d, 0, 0, w, h);
  ctx.restore();
}