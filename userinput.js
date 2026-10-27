

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
//Move the frame
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
  // the original source area
  let sourceW = frame.width / enlarge;
  let sourceH = frame.height / enlarge;
  let sourceX = frame.x - sourceW / 2;
  let sourceY = frame.y - sourceH / 2;
  let magnifiedArea = get(
    sourceX,
    sourceY,
    sourceW,
    sourceH
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
  else if(abs(mouseX-tear.x)<25 && abs(mouseY-tear.y),45){
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