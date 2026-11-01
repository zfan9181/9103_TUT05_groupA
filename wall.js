// Music wall: botanical print
// Leafy sprigs on a warm beige wall, with daisies that open and close with the music
// and little stars that twinkle with the high notes.
// Some of the sprigs grow longer with the music, curl at the end or open a daisy,
// then pull back when it is quiet.

// Colours of the wall (change these to restyle it)
let wallStyle = {
  wall: "#EDE3CF",
  leaves: ["#1F3047", "#4F6E8E", "#9DB0C4", "#6E7F5E"],  // navy, blue, light blue, sage
  daisies: ["#F8F4EC", "#E58C7A"],                         // white and coral
  centre: "#A39279",
  star: "#7F95AD"
};

let wallTexture;   // wall and the sprigs that stay still, drawn once
let sprigLayer;    // the sprigs that grow, redrawn with the music
let wallLayer;     // daisies and stars, redrawn with the music
let growingSprigs = [];
let daisies = [];
let stars = [];
let wallOpen = 0;
let wallGrowth = 0;
let drawnOpen = -1;
let drawnGrowth = -1;
let drawnBeat = -1;
let drawnSprigBeat = -1;
let drawnSparkle = -1;
let builtFor = "";
let wallSeed = 1;

function setupWall() {
  wallTexture = makeWallLayer(-3);
  sprigLayer = makeWallLayer(-2);
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
  // rebuild the wall when the window (or the painting on it) changes size
  let box = drawingContext.canvas.getBoundingClientRect();
  let size = windowWidth + "x" + windowHeight + "x" + round(box.left) + "x" + round(box.top);
  if (size != builtFor) {
    buildWall(box);
    builtFor = size;
    drawnOpen = -1;
    drawnGrowth = -1;
  }

  // how open the daisies are and how far the sprigs grow
  // (barLevels, mouthOpen and beatAmount come from music.js)
  let openTarget = 0.15;   // daisies closed when the music is not playing
  let growTarget = 0;      // sprigs at their normal size when the music is not playing
  let sparkle = 0;
  if (bgMusic.isPlaying()) {
    let energy = (barLevels[0] + barLevels[1] + barLevels[2] + barLevels[3]) / 4;
    openTarget = constrain(0.3 + energy * 0.5 + mouthOpen * 0.3, 0, 1);
    growTarget = constrain(0.25 + energy * 0.7 + mouthOpen * 0.4, 0, 1);
    sparkle = barLevels[3];   // high notes
  }
  wallOpen = lerp(wallOpen, openTarget, 0.06);
  // ease slowly, so the sprigs grow and pull back smoothly
  wallGrowth = lerp(wallGrowth, growTarget, 0.03);

  updateSprigs();
  updateDaisies(sparkle);
}

// Redraw the growing sprigs only when they have grown, shrunk or the beat has changed
function updateSprigs() {
  if (abs(wallGrowth - drawnGrowth) < 0.002 && abs(beatAmount - drawnSprigBeat) < 0.03) return;
  drawnGrowth = wallGrowth;
  drawnSprigBeat = beatAmount;

  sprigLayer.clear();
  for (let s of growingSprigs) {
    drawGrowingSprig(s, wallGrowth);
  }
}

// Redraw the daisies and stars only when something has changed, to keep things fast
function updateDaisies(sparkle) {
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
    drawDaisy(wallLayer, d.x, d.y, size, wallOpen, d.colour, d.angle + wallOpen * 0.3);
  }
}

// A random number that is the same every time, so the wall always looks the same
function wallRandom(low, high) {
  wallSeed = (wallSeed * 16807) % 2147483647;
  return low + (wallSeed / 2147483647) * (high - low);
}

function buildWall(box) {
  wallTexture.resizeCanvas(windowWidth, windowHeight);
  sprigLayer.resizeCanvas(windowWidth, windowHeight);
  wallLayer.resizeCanvas(windowWidth, windowHeight);
  wallSeed = 11;

  // the leafy sprigs, placed in a loose grid
  let sprigs = [];
  for (let y = 40; y < windowHeight + 80; y += 150) {
    for (let x = 40; x < windowWidth + 80; x += 150) {
      sprigs.push({ x: x + wallRandom(-45, 45), y: y + wallRandom(-45, 45), angle: wallRandom(0, TWO_PI),
        length: wallRandom(90, 150), colour: wallStyle.leaves[floor(wallRandom(0, 4))] });
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

  // some sprigs grow with the music, the rest stay still on the wall.
  // sprigs hidden behind the painting always stay still.
  let ring = 66; // the mat and the frame around the painting
  wallTexture.background(wallStyle.wall);
  growingSprigs = [];
  for (let s of sprigs) {
    let behindPainting = s.x > box.left - ring && s.x < box.right + ring && s.y > box.top - ring && s.y < box.bottom + ring;
    if (wallRandom(0, 1) < 0.5 && !behindPainting) {
      makeGrowingSprig(s);
      growingSprigs.push(s);
    } else {
      drawSprig(wallTexture, s.x, s.y, s.angle, s.length, s.colour);
    }
  }
}

// A curved stem with leaves on both sides
function drawSprig(g, x, y, angle, length, colour) {
  g.push();
  g.translate(x, y);
  g.rotate(angle);
  drawSprigStem(g, length, colour);
  // a leaf at the tip
  drawVeinedLeaf(g, length, 0, 0, length * 0.14, colour);
  g.pop();
}

// The stem and side leaves of a sprig (without the tip leaf)
function drawSprigStem(g, length, colour) {
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
}

// Work out where a sprig will grow to: it carries on from its tip,
// then curls into a spiral, or opens a daisy at the end
function makeGrowingSprig(s) {
  let length = s.length;
  let step = 4;
  let x = length;
  let y = 0;
  let angle = atan2(-length * 0.15, length * 0.3);  // same direction as the tip
  let steps = floor(length * wallRandom(0.8, 1.3) / step);
  let turn = wallRandom(0.004, 0.012) * (wallRandom(0, 1) < 0.5 ? -1 : 1);
  let curlSide = wallRandom(0, 1) < 0.5 ? -1 : 1;
  s.endsInFlower = wallRandom(0, 1) < 0.35;
  s.delay = wallRandom(0, 0.2);   // so they don't all grow at the same time

  // the new part of the stem
  s.points = [];
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    s.points.push({ x: x, y: y, angle: angle });
    angle += turn;
    // the end winds tighter and tighter into a spiral
    if (!s.endsInFlower && t > 0.55) {
      angle += curlSide * map(t, 0.55, 1, 0, 0.1) * step;
    }
    x += cos(angle) * step;
    y += sin(angle) * step;
  }

  // new leaves along the new part, spaced like the old ones
  s.newLeaves = [];
  let gap = max(4, round(length * 0.2 / step));
  let side = 1;
  for (let i = floor(gap / 2); i < steps * 0.6; i += gap) {
    let p = s.points[i];
    side = -side;
    s.newLeaves.push({ t: i / steps, x: p.x, y: p.y, angle: p.angle + side * 0.9,
      size: length * 0.15 * (1 - i / steps * 0.4) });
  }

  s.flowerSize = wallRandom(16, 22);
  s.flowerColour = wallStyle.daisies[wallRandom(0, 1) < 0.5 ? 0 : 1];
  s.flowerAngle = wallRandom(0, TWO_PI);
}

// Draw a sprig that has grown part of the way
function drawGrowingSprig(s, growth) {
  let grown = constrain((growth - s.delay) / 0.5, 0, 1);
  let g = sprigLayer;
  g.push();
  g.translate(s.x, s.y);
  g.rotate(s.angle);

  // the old part, same as the still sprigs
  drawSprigStem(g, s.length, s.colour);

  // the new part of the stem
  let last = floor(grown * (s.points.length - 1));
  if (last > 0) {
    g.noFill();
    g.stroke(s.colour);
    g.strokeWeight(2);
    g.beginShape();
    for (let i = 0; i <= last; i++) {
      g.vertex(s.points[i].x, s.points[i].y);
    }
    g.endShape();
  }

  // new leaves open up once the stem has grown past them
  for (let leaf of s.newLeaves) {
    let leafGrown = constrain((grown - leaf.t) * 6, 0, 1);
    if (leafGrown > 0) {
      drawVeinedLeaf(g, leaf.x, leaf.y, leaf.angle, leaf.size * leafGrown, s.colour);
    }
  }

  // the tip: a leaf while growing, then a curl or a daisy
  let tip = s.points[last];
  let bloom = 0;
  let tipLeaf = s.length * 0.14;
  if (s.endsInFlower) {
    bloom = constrain((growth - s.delay - 0.5) * 6, 0, 1);
    tipLeaf *= 1 - bloom;
  } else {
    tipLeaf *= 1 - constrain((grown - 0.5) * 4, 0, 1);   // the leaf fades as it starts to curl
  }
  if (tipLeaf > 0.5) {
    drawVeinedLeaf(g, tip.x, tip.y, tip.angle, tipLeaf, s.colour);
  }
  if (bloom > 0.05) {
    // the daisy bounces on the beat
    drawDaisy(g, tip.x, tip.y, s.flowerSize * bloom * (1 + beatAmount * 0.2), bloom, s.flowerColour, s.flowerAngle);
  }
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
function drawDaisy(g, x, y, size, open, colour, angle) {
  g.push();
  g.translate(x, y);
  g.rotate(angle);
  g.noStroke();
  g.fill(colour);
  let petalLength = size * (0.35 + open * 0.65);
  for (let i = 0; i < 16; i++) {
    g.push();
    g.rotate(i * TWO_PI / 16);
    g.ellipse(size * 0.25 + petalLength / 2, 0, petalLength, size * 0.2);
    g.pop();
  }
  // centre with a few seeds
  g.fill(wallStyle.centre);
  g.circle(0, 0, size * 0.55);
  g.fill(255, 255, 255, 120);
  for (let i = 0; i < 6; i++) {
    g.circle(cos(i) * size * 0.12, sin(i * 2) * size * 0.12, size * 0.06);
  }
  g.pop();
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