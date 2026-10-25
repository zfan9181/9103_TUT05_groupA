let hairs = [];
let eyes = [];
let shapes = [];
let weather;


let face;
face = {
  x: 455,y: 400,width: 380,height: 360,colour: "#ffe159",faceRotation:0.13,scale: 1,  
  earX: -95,earY: -5,earWidth: 100,earHeight: 100,earRotation:0.35,
  blushX:-95,blushY:15,blushSize:85,blushColor:"#f7a2ad"
};
function displayFace(){
    push();
    translate(face.x, face.y);
    scale(face.scale);
    noStroke();
    
    push();
    rotate(face.faceRotation);
    fill(face.colour);
    // main face
    arc(0,0,face.width,face.height,HALF_PI,PI+HALF_PI,CHORD);
    pop();
    // ear
    push();
    translate(face.earX, face.earY);
    rotate(face.earRotation);
    fill(face.colour);
    arc(face.earX,face.earY,face.earWidth,face.earHeight,HALF_PI,PI+HALF_PI,CHORD);
    pop();
  
  pop();
}

let blush;
blush = {x: 357,y: 425,size:80,colour: "#f7a2ad",rotation: 0,scale: 1};
function displayBlush() {
  push();

  translate(blush.x, blush.y);
  rotate(blush.rotation);
  scale(blush.scale);

  noStroke();
  fill(blush.colour);

  ellipse(0, 0, blush.size);

  pop();
}

let tear;
tear = {
  x: 357,
  y: 425,
  scale: 0.95,
  rotation: 0,
  colour: "#4BBCCC"
};
function displayTear() {
  push();

  translate(tear.x, tear.y);
  rotate(tear.rotation);
  scale(tear.scale);

  noStroke();
  fill(tear.colour);

  beginShape();

  vertex(0, -42);

  bezierVertex(8, -20, 20, 10, 20, 23);
  bezierVertex(20, 48, -20, 48, -20, 23);
  bezierVertex(-20, 10, -8, -20, 0, -42);

  endShape(CLOSE);

  pop();
}

let nose;
nose = {x: 420,y: 317,scale: 0.9,rotation: -0.05,colour: "#FC6785",
    nostrilX: 32,nostrilY: 158,nostrilWidth: 18,nostrilHeight: 10,nostrilColour: "#2C292D"
};
function displayNose() {
  push();
  translate(nose.x, nose.y);
  rotate(nose.rotation);
  scale(nose.scale);

  noStroke();
  fill(nose.colour);

  beginShape();
  vertex(119.616, 178);
  vertex(50.6159, 0);
  vertex(29.3159, 123.642);
  bezierVertex(
    20.1159, 123.642,
    10.6159, 123.642,
    1.61587, 141.5
  );
  bezierVertex(
    -5.18413, 165.9,
    11.1159, 176,
    20.1159, 178
  );
  vertex(119.616, 178);
  endShape(CLOSE);
  
  fill(nose.nostrilColour);
  ellipse(
    nose.nostrilX,
    nose.nostrilY,
    nose.nostrilWidth,
    nose.nostrilHeight
  );
  pop();
}

let mouth;
mouth = {x: 443,y: 535,scale: 0.93,rotation: 0,colour: "#4BBCCC",
  upperRotation:-0.26,upperX:0,upperY:-20,upperW:90,upperH:50,
  lowerRotation:0.26,lowerX:0,lowerY:0,lowerW:90,lowerH:50};
function displayMouth() {
  push();

  translate(mouth.x, mouth.y);
  rotate(mouth.rotation);
  scale(mouth.scale);

  noStroke();
  fill(mouth.colour);

  // Upper ellipse
  push();
  translate(mouth.upperX, mouth.upperY);
  rotate(mouth.upperRotation);

  ellipse(0,0, mouth.upperW, mouth.upperH);
  pop();

  // Lower ellipse
  push();
  translate(mouth.lowerX, mouth.lowerY);
  rotate(mouth.lowerRotation);

  ellipse(0,0, mouth.lowerW, mouth.lowerH);
  pop();

  pop();
}

let Earring;
Earring = {x: 250,y: 380,rotation: 0,scale: 1,colour: "#E95C1B",x1: 0,y1: 0,x2: 40,y2: 130,x3: -45,y3: 130};
function displayEarring() {
  push();
  translate(Earring.x, Earring.y);
  rotate(Earring.rotation);
  scale(Earring.scale);

  noStroke();
  fill(Earring.colour);

  triangle(
    Earring.x1, Earring.y1,
    Earring.x2, Earring.y2,
    Earring.x3, Earring.y3
  );

  pop();
}

let clothes;
clothes = {
  x: 320,
  y: 615,
  rotation: 0,
  scale: 1,
  yellowColour: "#FFE159",
  blackColour: "#2C292D"
};
function displayClothes() {
  push();

  translate(clothes.x, clothes.y);
  rotate(clothes.rotation);
  scale(clothes.scale);

  noStroke();

  // Yellow triangle
  fill(clothes.yellowColour);
  triangle(
    -13, -90,
    -135, 87,
    135, 87
  );

  // Black triangle
  fill(clothes.blackColour);
  triangle(
    -13, -90,
    -65, -15,
    135, 87
  );

  pop();
}

let backgroundRect;
backgroundRect = {
    x:0,y:0,width:800,height:800,color:"#F49AB5"
};
function dispalyBackgrounRect(){
    noStroke();
    fill(backgroundRect.color);
    rect(backgroundRect.x,backgroundRect.y,backgroundRect.width,backgroundRect.height);
}

class Eye {
    constructor(x,y,width,height,rotation = 0,scale = 1){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.scale = scale;
        this.eyeColour = "white";
        this.irisColour = "#48B5C5";
        this.pupilColour = "#2C292D";
        this.lidColour = "#2C292D";
        this.pupilX = 0;
        this.pupilY = 0;
        this.irisSize = height*0.58;
        this.pupilSize = height*0.28;
        this.lidOpen = 1;
    }  

    display(){
        push();
        translate(this.x,this.y);
        rotate(this.rotation);
        scale(this.scale);
        noStroke();
        // the white of eye
        fill(this.eyeColour);
        arc(0,0,this.width,this.height,0,PI,CHORD)
        // iris
        fill(this.irisColour);
        circle(this.pupilX,this.pupilY,this.irisSize);
        // pupil
        fill(this.pupilColour);
        circle(this.pupilX,this.pupilY,this.pupilSize);
        // eyelid
        fill(this.lidColour);
        arc(0,0,this.width,this.height,PI,TWO_PI,CHORD)
        pop();
    }

}

class Hair {

  constructor(x, y, size,) {

    this.x = x;
    this.y = y;
    this.size = size;
    this.strokeW = 2;
    this.color = "#2C292D"
    this.ringColor = "white"
    this.scale = 1;
    this.displacement = 0;
    this.ringPhase = 0;
  }


  display() {

    push();

    
    translate(this.x, this.y);
    scale(this.scale);

    // black hair circle
    fill(this.color);
    noStroke();
    
    
    circle(0 + this.displacement, 0, this.size);

    // white rings
    noFill();
    stroke(this.ringColor);
    strokeWeight(this.strokeW);

    

    // ringPhase 0 keeps the original ring sizes (0.38, 0.58, 0.78)
    for (let i = 0; i < 3; i++) {
      let ringSize = 0.2 + (0.18 + i * 0.2 + this.ringPhase) % 0.6;
      circle(0 + this.displacement, 0, this.size * ringSize);
    }

    pop();

  }
}

class Shape {
  constructor(x,y,width,height,type,colour,rotation = 0,scale = 1) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.type = type;
    this.colour = colour;

    this.rotation = rotation;
    this.scale = scale;

    this.strokeW = 2;
    this.handleSize = 10;
  }

  display() {
    push();

    translate(this.x, this.y);
    rotate(this.rotation);
    scale(this.scale);

    if (this.type === "rectangle") {
      noStroke();
      fill(this.colour);

      rect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }

    else if (this.type === "frame") {
      noFill();
      stroke(this.colour);
      strokeWeight(this.strokeW);

      rect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );

      fill(this.colour);
      noStroke();

      circle(
        -this.width / 2,
        -this.height / 2,
        this.handleSize
      );

      circle(
        this.width / 2,
        -this.height / 2,
        this.handleSize
      );

      circle(
        -this.width / 2,
        this.height / 2,
        this.handleSize
      );

      circle(
        this.width / 2,
        this.height / 2,
        this.handleSize
      );
    }

    pop();
  }
}

let hair1;
let hair2;
let hair3;
let eye1;
let eye2;
let eye3;
let eye4;
let rect1, rect2;
let bar1, bar2, bar3, bar4;
let frame;
function createArtwork(){
    weather = new weatherManager(); 
    hair1 = new Hair(390,205,210)
    hair2 = new Hair(265,265,125)
    hair3 = new Hair(225,393,175);
    eye1 = new Eye(365,345,130,58);
    eye2 = new Eye(537,247,165,58,-0.84);
    eye3 = new Eye(562,318,165,58,-0.47);
    eye4 = new Eye(578,393,165,58,0.1);
    rect1 = new Shape(430,637,280,130,"rectangle","#d25216");
    rect2 = new Shape(510,637,220,95,"rectangle","#4BBCCC");
    bar1 = new Shape(560,560,10,250,"rectangle","white");
    bar2 = new Shape(576,560,10,250,"rectangle","white");
    bar3 = new Shape(592,560,10,250,"rectangle","white");
    bar4 = new Shape(608,560,10,250,"rectangle","white");
    frame = new Shape(443,543,165,120,"frame","white");
}

function displayArtwork(){
    updateWeather();
    updateHairDisplacement();
    dispalyBackgrounRect();
    rect1.display();
    hair3.display();
    displayFace();
    displayBlush();
    displayNose();
    displayMouth();
    hair2.display();
    hair1.display();
    displayTear();
    displayEarring();

    eye1.display();
    eye2.display();
    eye3.display();
    eye4.display();
    displayClothes();
    rect2.display();
    bar1.display();
    bar2.display();
    bar3.display();
    bar4.display();
    weatherAtmosUpdate();
    drawRain();
    drawWind();
    
    // frame.display();
}

hairs = [hair1, hair2, hair3];

eyes = [eye1, eye2, eye3, eye4];

shapes = [
  rect1, rect2,
  bar1, bar2, bar3, bar4,
  frame
];