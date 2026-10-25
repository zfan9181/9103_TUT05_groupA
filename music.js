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