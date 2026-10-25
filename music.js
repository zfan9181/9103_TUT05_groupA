// Background music
let bgMusic;
let musicVolume = 0.5;

// length of the fade out at the end (seconds)
let fadeOutLength = 5;

// Load the music
function loadMusic() {
  bgMusic = loadSound("assets/beat-driven-music.mp3");
}

// Click the canvas to start the music
function setupMusic() {
  select("canvas").mousePressed(startMusic);
  bgMusic.setVolume(musicVolume);
}

// Play the music on loop
function startMusic() {
  if (!bgMusic.isPlaying()) {
    userStartAudio();
    bgMusic.loop();
    // jump back to the start before the fade out
    bgMusic.addCue(bgMusic.duration() - fadeOutLength, restartMusic);
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
  bgMusic.setVolume(musicVolume);
}