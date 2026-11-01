let isDraggingFrame = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
//enlarge strength
let enlarge = 1.17;

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
// Display the magnifying glass
function displayMagnifier() {
  // size of the round lens
  let lensSize = frame.height + 20;

  // the original source area: a square, smaller than the lens
  // (read it first, so the glass itself doesn't get magnified)
  let sourceSize = lensSize / enlarge;
  let magnifiedArea = get(
    frame.x - sourceSize / 2,
    frame.y - sourceSize / 2,
    sourceSize,
    sourceSize
  );

  magnifiedArea.filter(GRAY);
  
  // handle, drawn first so the lens sits on top of it
  push();
  translate(frame.x, frame.y);
  rotate(QUARTER_PI);
  noStroke();
  fill("#2C292D");
  rect(lensSize / 2, -7, lensSize * 0.55, 14, 7);
  fill("#C8A15A");
  rect(lensSize / 2 - 2, -9, 14, 18, 3);
  pop();

  // show the enlarged picture inside a circle
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(frame.x, frame.y, lensSize / 2, 0, TWO_PI);
  drawingContext.clip();
  image(magnifiedArea, frame.x - lensSize / 2, frame.y - lensSize / 2, lensSize, lensSize);
  drawingContext.restore();

  // gold rim and a little shine on the glass
  push();
  noFill();
  stroke("#C8A15A");
  strokeWeight(7);
  circle(frame.x, frame.y, lensSize);
  stroke(255, 255, 255, 120);
  strokeWeight(4);
  arc(frame.x, frame.y, lensSize * 0.72, lensSize * 0.72, PI + 0.4, PI + 1.3);
  pop();
}

// eye follow
function updateEyeTraking(){
  for(let eye of eyes){
    eye.pupilX = (mouseX / width - 0.5) * 35;

    eye.pupilY = (mouseY / height - 0.5) * 6.2;
  }
}

// tear drop
let isCrying = false;

function mouseClicked(){
  if(isCrying){
    isCrying = false;
  }
  else if(abs(mouseX-tear.x)<25 && abs(mouseY-tear.y)<45){
    isCrying = true;
    fallingTears.push({x:tear.x,y:tear.y,scale:tear.scale,rotation:tear.rotation,color:tear.color});
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