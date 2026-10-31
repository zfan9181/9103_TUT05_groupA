let isDraggingFrame = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
//enlarge strength
let enlarge = 1.12;

//drag the frame
function mousePressed() {
  let left = frame.x - frame.width / 2;
  let right = frame.x + frame.width / 2;
  let top = frame.y - frame.height / 2;
  let bottom = frame.y + frame.height / 2;
  // artMouseX / artMouseY: mouse position on the portrait (see sketch.js)
  if (
    artMouseX() >= left &&
    artMouseX() <= right &&
    artMouseY() >= top &&
    artMouseY() <= bottom
  ) {
    isDraggingFrame = true;

    dragOffsetX = artMouseX() - frame.x;
    dragOffsetY = artMouseY() - frame.y;
  }
}
//Move the frame
function mouseDragged() {
  if (isDraggingFrame) {

    // keep the frame on the portrait (ART_SIZE = 800)
    frame.x = constrain(
      artMouseX() - dragOffsetX,
      frame.width / 2,
      ART_SIZE - frame.width / 2
    );

    frame.y = constrain(
      artMouseY() - dragOffsetY,
      frame.height / 2,
      ART_SIZE - frame.height / 2
    );

  }
}
// Stop dragging
function mouseReleased() {
  isDraggingFrame = false;
}
// Display the magnifying effect
function displayMagnifier() {
  // the original source area
  let sourceW = frame.width / enlarge;
  let sourceH = frame.height / enlarge;
  let sourceX = frame.x - sourceW / 2;
  let sourceY = frame.y - sourceH / 2;
  // get() reads pixels from the screen, so turn the portrait position into a screen position
  let magnifiedArea = get(
    artX + sourceX * artScale,
    artY + sourceY * artScale,
    sourceW * artScale,
    sourceH * artScale
  );
  // after enlarged
  image(
    magnifiedArea,
    frame.x - frame.width / 2,
    frame.y - frame.height / 2,
    frame.width,
    frame.height
  );
  // the white frame on top
  frame.display();
}

// eye follow
function updateEyeTraking(){
  for(let eye of eyes){
    eye.pupilX = (mouseX / width - 0.5) * 35;

    eye.pupilY = (mouseY / height - 0.5) * 6;
  }
}

// tear drop
let isCrying = false;

function mouseClicked(){
  if(isCrying){
    isCrying = false;
  }
  else if(abs(artMouseX()-tear.x)<25 && abs(artMouseY()-tear.y),45){
    isCrying = true;
  }
}
function updateTear(){
  if(!isCrying)return;
  
  if(frameCount % 55 === 0){
    fallingTears.push({x:tear.x,y:tear.y,scale:tear.scale,rotation:tear.rotation,color:tear.color});
  }
  for(let drop of fallingTears){
    drop.y+=2;
  }
  fallingTears = fallingTears.filter(drop=>drop.y<600);
}