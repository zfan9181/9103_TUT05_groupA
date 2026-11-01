// Music wall: botanical print
// Leafy sprigs on a warm beige wall, with daisies that open and close with the music
// and little stars that twinkle with the high notes.

// Colours of the wall (change these to restyle it)
let wallStyle = {
  wall: "#EDE3CF",
  leaves: ["#1F3047", "#4F6E8E", "#9DB0C4", "#6E7F5E"],  // navy, blue, light blue, sage
  daisies: ["#F8F4EC", "#E58C7A"],                         // white and coral
  centre: "#A39279",
  star: "#7F95AD"
};

let wallLayer;     // daisies and stars, redrawn with the music
let wallTexture;   // wall and leaves, drawn once
let daisies = [];
let stars = [];
let wallOpen = 0;
let drawnOpen = -1;
let drawnBeat = -1;
let drawnSparkle = -1;
let builtFor = "";
let wallSeed = 1;

function setupWall() {
  wallTexture = makeWallLayer(-2);
  wallLayer = makeWallLayer(-1);
}

function makeWallLayer(depth) {
  let layer = createGraphics(windowWidth, windowHeight);
  layer.show();
  layer.style("position", "fixed");
  layer.style("left", "0");
  layer.style("top", "0");
  layer.style("z-index", String(depth));
  layer.style("pointer-events", "none");
  return layer;
}

function updateWall() {
  // rebuild the wall when the window changes size
  let size = windowWidth + "x" + windowHeight;
  if (size != builtFor) {
    buildWall();
    builtFor = size;
    drawnOpen = -1;
  }

  // how open the daisies are (barLevels, mouthOpen and beatAmount come from music.js)
  let target = 0.15; // closed when the music is not playing
  let sparkle = 0;
  if (bgMusic.isPlaying()) {
    let energy = (barLevels[0] + barLevels[1] + barLevels[2] + barLevels[3]) / 4;
    target = constrain(0.3 + energy * 0.5 + mouthOpen * 0.3, 0, 1);
    sparkle = barLevels[3];   // high notes
  }
  wallOpen = lerp(wallOpen, target, 0.06);

  // only redraw when something has changed, to keep things fast
  if (abs(wallOpen - drawnOpen) < 0.003 && abs(beatAmount - drawnBeat) < 0.03 && abs(sparkle - drawnSparkle) < 0.03) return;
  drawnOpen = wallOpen;
  drawnBeat = beatAmount;
  drawnSparkle = sparkle;

  wallLayer.clear();
  for (let s of stars) {
    // each star twinkles a little differently
    let twinkle = constrain(sparkle * 1.4 - s.phase * 0.5, 0, 1);
    drawStar(s.x, s.y, s.size * (0.4 + twinkle * 0.8), 80 + twinkle * 175);
  }
  for (let d of daisies) {
    let size = d.size * (1 + beatAmount * 0.12);
    drawDaisy(d.x, d.y, size, wallOpen, d.colour, d.angle + wallOpen * 0.3);
  }
}

// A random number that is the same every time, so the wall always looks the same
function wallRandom(low, high) {
  wallSeed = (wallSeed * 16807) % 2147483647;
  return low + (wallSeed / 2147483647) * (high - low);
}

function buildWall() {
  wallTexture.resizeCanvas(windowWidth, windowHeight);
  wallLayer.resizeCanvas(windowWidth, windowHeight);
  wallSeed = 11;

  // the wall and the leafy sprigs, drawn once
  let t = wallTexture;
  t.background(wallStyle.wall);
  for (let y = 40; y < windowHeight + 80; y += 150) {
    for (let x = 40; x < windowWidth + 80; x += 150) {
      drawSprig(t, x + wallRandom(-45, 45), y + wallRandom(-45, 45), wallRandom(0, TWO_PI),
        wallRandom(90, 150), wallStyle.leaves[floor(wallRandom(0, 4))]);
    }
  }

  // daisies, placed in a loose grid
  daisies = [];
  for (let y = 60; y < windowHeight + 60; y += 190) {
    for (let x = 60; x < windowWidth + 60; x += 190) {
      daisies.push({ x: x + wallRandom(-50, 50), y: y + wallRandom(-50, 50), size: wallRandom(24, 38),
        colour: wallStyle.daisies[wallRandom(0, 1) < 0.5 ? 0 : 1], angle: wallRandom(0, TWO_PI) });
    }
  }

  // little stars in the gaps
  stars = [];
  for (let i = 0; i < windowWidth * windowHeight / 18000; i++) {
    stars.push({ x: wallRandom(0, windowWidth), y: wallRandom(0, windowHeight), size: wallRandom(5, 9), phase: wallRandom(0, 1) });
  }
}

// A curved stem with leaves on both sides
function drawSprig(g, x, y, angle, length, colour) {
  g.push();
  g.translate(x, y);
  g.rotate(angle);
  g.noFill();
  g.stroke(colour);
  g.strokeWeight(2);
  let bend = length * 0.15;
  g.bezier(0, 0, length * 0.3, -bend, length * 0.7, bend, length, 0);
  g.noStroke();
  let side = 1;
  for (let t = 0.2; t <= 1; t += 0.2) {
    let px = bezierPoint(0, length * 0.3, length * 0.7, length, t);
    let py = bezierPoint(0, -bend, bend, 0, t);
    side = -side;
    let leafSize = length * 0.2 * (1.2 - t * 0.4);
    drawVeinedLeaf(g, px, py, side * 0.9 - 0.2, leafSize, colour);
  }
  // a leaf at the tip
  drawVeinedLeaf(g, length, 0, 0, length * 0.14, colour);
  g.pop();
}

// A pointed leaf with a pale vein down the middle
function drawVeinedLeaf(g, x, y, angle, size, colour) {
  g.push();
  g.translate(x, y);
  g.rotate(angle);
  g.noStroke();
  g.fill(colour);
  g.beginShape();
  g.vertex(0, 0);
  g.bezierVertex(size * 0.4, -size * 0.55, size * 1.1, -size * 0.45, size * 1.6, 0);
  g.bezierVertex(size * 1.1, size * 0.45, size * 0.4, size * 0.55, 0, 0);
  g.endShape();
  g.stroke(255, 255, 255, 70);
  g.strokeWeight(0.8);
  g.line(size * 0.1, 0, size * 1.4, 0);
  g.pop();
}

// A daisy: open goes from a closed bud (0) to fully open (1)
function drawDaisy(x, y, size, open, colour, angle) {
  wallLayer.push();
  wallLayer.translate(x, y);
  wallLayer.rotate(angle);
  wallLayer.noStroke();
  wallLayer.fill(colour);
  let petalLength = size * (0.35 + open * 0.65);
  for (let i = 0; i < 16; i++) {
    wallLayer.push();
    wallLayer.rotate(i * TWO_PI / 16);
    wallLayer.ellipse(size * 0.25 + petalLength / 2, 0, petalLength, size * 0.2);
    wallLayer.pop();
  }
  // centre with a few seeds
  wallLayer.fill(wallStyle.centre);
  wallLayer.circle(0, 0, size * 0.55);
  wallLayer.fill(255, 255, 255, 120);
  for (let i = 0; i < 6; i++) {
    wallLayer.circle(cos(i) * size * 0.12, sin(i * 2) * size * 0.12, size * 0.06);
  }
  wallLayer.pop();
}

// A small star made of crossing lines
function drawStar(x, y, size, alpha) {
  let c = color(wallStyle.star);
  c.setAlpha(alpha);
  wallLayer.stroke(c);
  wallLayer.strokeWeight(1.2);
  for (let i = 0; i < 4; i++) {
    let a = i * PI / 4;
    wallLayer.line(x - cos(a) * size, y - sin(a) * size, x + cos(a) * size, y + sin(a) * size);
  }
}