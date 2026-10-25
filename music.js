// Background music
let bgMusic;
let musicVolume = 0.5;
let musicFFT;

// the music fades out after 54s, so loop back here
let loopEnd = 54;

// Mouth movement
let mouthOpen = 0;
let mouthUpperY;
let mouthLowerY;
let mouthUpperRotation;
let mouthLowerRotation;

// Drum beat (used by the blush and the hair)
let beatAmount = 0;
let bassAverage = 0;

// Blush colour
let lightPink;
let deepPink;

// Load the music
function loadMusic() {
  bgMusic = loadSound("assets/beat-driven-music.mp3");
}

// Click the canvas to start the music
function setupMusic() {
  select("canvas").mousePressed(startMusic);
  outputVolume(musicVolume);

  // Analyse the frequencies of the music
  musicFFT = new p5.FFT(0.6);
  musicFFT.setInput(bgMusic);

  // Save where the lips start
  mouthUpperY = mouth.upperY;
  mouthLowerY = mouth.lowerY;
  mouthUpperRotation = mouth.upperRotation;
  mouthLowerRotation = mouth.lowerRotation;

  // Blush goes from light pink to deep pink
  lightPink = color(blush.colour);
  deepPink = color("#E8457A");
}

// Play the music on loop
function startMusic() {
  if (!bgMusic.isPlaying()) {
    userStartAudio();
    bgMusic.loop();
    // jump back to the start before the fade out
    bgMusic.addCue(loopEnd, restartMusic);
  }
}

// Go back to the start of the music
function restartMusic() {
  bgMusic.jump(0);
}

// Use the up and down arrow keys to change the volume
function updateVolume() {
  if (keyIsDown(UP_ARROW)) {
    musicVolume += 0.01;
  }
  if (keyIsDown(DOWN_ARROW)) {
    musicVolume -= 0.01;
  }
  musicVolume = constrain(musicVolume, 0, 1);
  outputVolume(musicVolume);
}

// Open and close the mouth with the flute melody
function updateMouth() {
  let spectrum = musicFFT.analyze();

  // Find the loudest note between 600 and 1400 Hz (the flute)
  let nyquist = sampleRate() / 2;
  let start = round(600 / nyquist * spectrum.length);
  let end = round(1400 / nyquist * spectrum.length);
  let flute = 0;
  for (let i = start; i <= end; i++) {
    flute = max(flute, spectrum[i]);
  }

  // Open the mouth when the flute is playing
  let target = constrain(map(flute, 170, 240, 0, 1), 0, 1);
  mouthOpen = lerp(mouthOpen, target, 0.2);

  // Turn the lips apart so the mouth opens on the right
  mouth.upperRotation = mouthUpperRotation - mouthOpen * 0.3;
  mouth.lowerRotation = mouthLowerRotation + mouthOpen * 0.3;
  mouth.upperY = mouthUpperY - mouthOpen * 6;
  mouth.lowerY = mouthLowerY + mouthOpen * 6;
}

// Find the drum beat and change the blush colour
function updateBlush() {
  let bass = musicFFT.getEnergy("bass");

  // Average bass level, used to find the beats
  bassAverage = lerp(bassAverage, bass, 0.05);

  // Stronger when the bass jumps above the average
  let target = constrain(map(bass - bassAverage, 0, 30, 0, 1), 0, 1);

  // Go up fast, then come back down slowly (easing)
  if (target > beatAmount) {
    beatAmount = lerp(beatAmount, target, 0.5);
  } else {
    beatAmount = lerp(beatAmount, target, 0.08);
  }

  blush.colour = lerpColor(lightPink, deepPink, beatAmount);
}

// Hair grows with the drum beat and the white rings keep moving
function updateHair() {
  let hairScale = 1 + beatAmount * 0.12;

  // move one ring every 30 frames (about one beat), then start again
  let ringPhase = (frameCount / 30 * 0.2) % 0.6;

  hair1.scale = hairScale;
  hair2.scale = hairScale;
  hair3.scale = hairScale;

  hair1.ringPhase = ringPhase;
  hair2.ringPhase = ringPhase;
  hair3.ringPhase = ringPhase;
}