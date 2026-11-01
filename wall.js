// Music wall
// The flowers on the wallpaper (assets/wall-flowers.svg) bloom and glow gold
// when a drum beat spreads out from the painting.
let wallLayer;
let wallWaves = [];
let lastBeat = 0;
let wallHasGlow = false;

// same sizes and places as the flowers in wall-flowers.svg
let flowerGap = 140;
let flowerSize = 34;

function setupWall() {
  wallLayer = createGraphics(windowWidth, windowHeight);
  wallLayer.show();
  wallLayer.style("position", "fixed");
  wallLayer.style("left", "0");
  wallLayer.style("top", "0");
  wallLayer.style("z-index", "-1");
  wallLayer.style("pointer-events", "none");
}

function updateWall() {
  // match the size of the window
  if (wallLayer.width != windowWidth || wallLayer.height != windowHeight) {
    wallLayer.resizeCanvas(windowWidth, windowHeight);
  }

  // start a new wave when a drum beat hits (beatAmount comes from music.js)
  if (beatAmount > 0.6 && lastBeat <= 0.6) {
    wallWaves.push({ radius: 0, strength: beatAmount });
  }
  lastBeat = beatAmount;

  // the waves start from the middle of the painting
  let box = drawingContext.canvas.getBoundingClientRect();
  let centreX = box.left + box.width / 2;
  let centreY = box.top + box.height / 2;
  // waves fade out before they reach the far corners
  let maxRadius = dist(0, 0, windowWidth, windowHeight) * 0.7;

  // waves grow outwards
  for (let wave of wallWaves) {
    wave.radius += 12;
  }
  wallWaves = wallWaves.filter(wave => wave.radius < maxRadius);

  // only redraw when something is glowing, to keep things fast
  if (wallWaves.length == 0 && !wallHasGlow) return;
  wallLayer.clear();
  wallHasGlow = wallWaves.length > 0;
  if (!wallHasGlow) return;

  // the flowers are in rows, every second row is moved across by half a gap
  for (let row = 0; row * flowerGap / 2 < windowHeight + flowerGap; row++) {
    let y = row * flowerGap / 2;
    let offset = row % 2 == 1 ? flowerGap / 2 : 0;
    for (let x = offset; x < windowWidth + flowerGap; x += flowerGap) {
      let d = dist(x, y, centreX, centreY);

      // how much the waves light up this flower
      let glow = 0;
      for (let wave of wallWaves) {
        let closeness = 1 - abs(d - wave.radius) / 70;
        let fade = 1 - wave.radius / maxRadius;
        glow = max(glow, closeness * fade * wave.strength);
      }
      if (glow > 0.08) {
        // the middle flowers are turned 30 degrees, like in the svg
        drawBloomingFlower(x, y, row % 2 == 1 ? 30 : 0, glow);
      }
    }
  }
}

// Draw one flower on top of the wallpaper: bigger and brighter when glow is higher
function drawBloomingFlower(x, y, turn, glow) {
  let size = flowerSize * (1 + glow * 0.35);

  wallLayer.push();
  wallLayer.translate(x, y);
  wallLayer.rotate(radians(turn) + glow * 0.3);

  // petals
  wallLayer.stroke(255, 214, 140, 120 + glow * 135);
  wallLayer.strokeWeight(1.2 + glow * 1.2);
  wallLayer.fill(lerpColor(color("#211E1F"), color("#4A4034"), glow));
  for (let i = 0; i < 6; i++) {
    wallLayer.push();
    wallLayer.rotate(i * TWO_PI / 6);
    wallLayer.ellipse(size * 0.55, 0, size, size * 0.55);
    wallLayer.pop();
  }

  // centre with a gold ring, like the hair
  wallLayer.fill("#0F0D0E");
  wallLayer.circle(0, 0, size * 0.56);
  wallLayer.noFill();
  wallLayer.circle(0, 0, size * 0.36);

  wallLayer.pop();
}