// Background music
let bgMusic;

// Load the music
function loadMusic() {
  bgMusic = loadSound("assets/beat-driven-music.mp3");
}

// Click the canvas to start the music
function setupMusic() {
  select("canvas").mousePressed(startMusic);
}

// Play the music on loop
function startMusic() {
  if (!bgMusic.isPlaying()) {
    userStartAudio();
    bgMusic.loop();
  }
}