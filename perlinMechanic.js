// Perlin Noise and Randomness Mechanic
// Dynamic segmented background and living clothing

// DYNAMIC SEGMENTED BACKGROUND///////////////////////////////////////
let backgroundSegments=[];
let numSegments=80;
//Create a value to make the cloud-like color areas move
let backgroundFlow=0; 

//Background Segment class
class BackgroundSegment{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }


//Perlin noise give each segment a smooth value based on its position, nearby segments get similiar values so their colours can form connected areas
display(){
    //Control the size of the cloud-like color areas
    let noiseX= this.x*0.003 - backgroundFlow;
    let noiseY= this.y*0.003;
    
    //Get the Perlin noise value
    let noiseValue= noise(noiseX, noiseY);

    //Make stronger weather to give a higher value
    let weatherIntensity=(weather.windIntensity + weather.rainIntensity)/2;

    //Set the sunny and dark background colors
    let sunnyColor = color("#F49AB5");
    let darkColor = color("#1ea7f0");

    //Make stonger weather to make the dark areas more visible
    let darkAmount = weatherIntensity*(1-noiseValue);

    //Create a blend between the sunny pink and darker weather color
    let backgroundColor = lerpColor(sunnyColor, darkColor, darkAmount);

    //Make the clouds withe
    let cloudColor = color("#FFFFFF"); 

    let segmentColor=backgroundColor;

    //Control the clouds show more strongly near the top of the canvas
    let cloudFade = map(this.y, 0, height*0.6, 1, 0);
    if(cloudFade < 0){
        cloudFade = 0;
    }

    //Higher noise values create the white cloud areas
    if (noiseValue > 0.4) {
        let colorAmount = map(noiseValue, 0.4, 0.6, 0, 1);
        colorAmount = colorAmount*cloudFade;
        if(colorAmount > 1){
            colorAmount = 1;
        }

        segmentColor = lerpColor(backgroundColor, cloudColor, colorAmount);
    }

    //Draw this segmetn
    fill(segmentColor);
    noStroke();
    rect(this.x, this.y, this.width, this.height)

  }
}

//Divides the canvas into a grid
function createBackgroundSegments(){
    let segmentWidth = width / numSegments;
    let segmentHeight = height / numSegments;

    for (let y=0; y < height; y+=segmentHeight){
        for(let x=0; x < width; x+=segmentWidth){
            let segment= new BackgroundSegment (x,y,segmentWidth,segmentHeight);
            backgroundSegments.push(segment);
        }
    }
}

//Display all segments
function displayBackground(){
    for(let segment of backgroundSegments){
        segment.display();
    }
}

//Update the background Movement speed based on wind intensity
function updateBackground(){
    //Stronger wind makes the cloud-like color clusters move faster
    let backgroundSpeed=map(weather.windIntensity, 0.1, 1, 0.001, 0.02);
    backgroundFlow+=backgroundSpeed;
}













//LIVING CLOTHING//////////////////////////////////////

let clothingFragments=[];


//Create a class for all the small clothing pieces
class ClothingFragment{

    constructor(x, y, width, height, mainColor, lightColor, shapeType, gap){
        this.x=x;
        this.y=y;
        this.originalX=x;
        this.originalY=y;
        this.width=width;
        this.height=height;
        
        //Save the main color and second light color for color changing effect of pieces
        this.mainColor=mainColor;
        this.lightColor=lightColor;

        //Save if this piece is rectangle or triangle
        this.shapeType=shapeType;

        //Save the gap to control the movement range
        this.gap=gap;

        this.noiseX=random(1000);
        this.noiseY=random(1000);

        //Make color changing of pieces to start with the original main color
        this.currentColor=mainColor;
    }



    //Update movement and color change
    update(){

        //Set audio energy
        let audioEnergy= barLevels[0]+ barLevels[1]+ barLevels[2]+ barLevels[3];
        audioEnergy=map(audioEnergy, 0, 4, 0, 1);

        audioEnergy=constrain(audioEnergy, 0, 1);



        //Create slight movement of each piece within the range 

        //Make the movement become stronger when the audio energy is stronger
        let moveAmount=map(audioEnergy, 0, 1, 0.6, this.gap*0.4);


        //Use Perlin noise for smooth movement
        let moveX=map(noise(this.noiseX), 0, 1, -moveAmount, moveAmount);
        let moveY=map(noise(this.noiseY), 0, 1, -moveAmount, moveAmount);


        //make the movement around the original position
        this.x=this.originalX+moveX;
        this.y=this.originalY+moveY;


        ///Make the movement become faster when the audio energy is stronger
        let noiseSpeed=map(audioEnergy, 0, 1, 0.03, 0.1);
        this.noiseX+=noiseSpeed;
        this.noiseY+=noiseSpeed;



        //Create color changing effect 

        //Make the more pieces to change color when the audio energy is stronger
        let colorChangeChance=map(audioEnergy, 0, 1, 0.01, 0.12);

        if(random(1)<colorChangeChance){

            let randomColor=random(1);


            //Control most pieces to change to their relative light color, and few of them change to other colors
            if(randomColor<0.8){

                this.currentColor=this.lightColor;
            }

            //A few pieces change to blue
            else if(randomColor<0.85){

                this.currentColor="#4BBCCC";
            }

            //A few pieces change to orange
            else if(randomColor<0.90){

                this.currentColor="#E95C1B";
            }

            //A few pieces change to yellow
            else if(randomColor<0.95){

                this.currentColor="#FFE159";
            }
            
            //A few pieces change to dark colour
            else{

                this.currentColor="#090909";
            }
        }


        //Control most pieces to return to the main colour
        let returnChance=map(audioEnergy, 0, 1, 0.02, 0.06);


        if(random(1)<returnChance){

            this.currentColor=this.mainColor;
        }
    }

    //Draw one small piece
    display(){
        noStroke();
        fill(this.currentColor);

        //Rectangle piece
        if(this.shapeType=="rectangle"){

            rect(this.x, this.y, this.width, this.height);
        }

        //Triangle piece
        if(this.shapeType=="triangle"){

            triangle(this.x, this.y, this.x-this.width/2, this.y+this.height, this.x+this.width/2, this.y+this.height);
        }
    }
}




//CREATE RECTANGLE FRAGMENTS

//Function for orange and blue rectangles
function createRectangleFragments(rectArea, mainColor, lightColor){
    let columns=16;
    let rows=7;
    let gap=6;
    let fragmentWidth=rectArea.width/columns;
    let fragmentHeight=rectArea.height/rows;
    let startX=rectArea.x-rectArea.width/2;
    let startY=rectArea.y-rectArea.height/2;

    for(let y=0; y<rows; y++){
        for(let x=0; x<columns; x++){
            let fragmentX= startX+ x*fragmentWidth+ gap/2;
            let fragmentY= startY+ y*fragmentHeight+ gap/2;
            let fragment= new ClothingFragment( fragmentX, fragmentY, fragmentWidth-gap, fragmentHeight-gap, mainColor, lightColor, "rectangle", gap);

            clothingFragments.push(fragment);
        }
    }
}

//Create orange clothing pieces
function createOrangeFragments(){
    createRectangleFragments( rect1, "#E95C1B", "#FFAE72");
}

//Create blue clothing pieces
function createBlueFragments(){
    createRectangleFragments( rect2, "#4BBCCC", "#A8F0F7");
}


//Function for yellow triangles
function createYellowTriangleFragments(){
    let topX=clothes.x-13;
    let topY=clothes.y-90;
    let leftBottomX=clothes.x-135;
    let rightBottomX=clothes.x+135;
    let bottomY=clothes.y+87;
    let fragmentSize=13;
    let gap=7;
    let rowHeight=fragmentSize+gap;

    let rows= (bottomY-topY)/ rowHeight;

    for(let row=0; row<rows; row++){
        let rowAmount=row/rows;
        let fragmentY= topY+ rowAmount*(bottomY-topY);
        let leftX= topX+ rowAmount*(leftBottomX-topX);
        let rightX= topX+ rowAmount*(rightBottomX-topX);

         //Create the yellow triangle pieces
        for(let x=leftX+fragmentSize/2; x<rightX-fragmentSize/2; x+=fragmentSize+gap){
            let fragment= new ClothingFragment(x, fragmentY, fragmentSize, fragmentSize, "#4D4B4A", "#A19C9A", "triangle", gap);

            clothingFragments.push(fragment);
        }
    }
}



//Function for black triangles

function createBlackTriangleFragments(){
    let topX=clothes.x-13;
    let topY=clothes.y-90;
    let leftX=clothes.x-65;
    let leftY=clothes.y-15;
    let rightX=clothes.x+135;
    let rightY=clothes.y+87;

    let fragmentSize=13;
    let gap=7;
    let rowHeight=fragmentSize+gap;
    let rows= (rightY-topY)/ rowHeight;

    for(let row=0; row<rows; row++){
        let rowAmount=row/rows;
        let fragmentY= topY+ rowAmount*(rightY-topY);
        let rowLeftX;

         //Find the left boundary of this row
        if(fragmentY<leftY){

            rowLeftX=map(fragmentY, topY, leftY, topX, leftX);
        }
        else{
            rowLeftX=map( fragmentY, leftY, rightY, leftX, rightX);
        }

        //Find the right boundary of this row
        let rowRightX=map( fragmentY, topY, rightY, topX, rightX);

        //Create the black triangle pieces
        for( let x=rowLeftX+fragmentSize/2; x<rowRightX-fragmentSize/2; x+=fragmentSize+gap){
            let fragment= new ClothingFragment(x, fragmentY, fragmentSize, fragmentSize, "#FFE159", "#FFF5B8", "triangle", gap);

            clothingFragments.push(fragment);
        }
    }
}




//DISPLAY ALL CLOTHING

function displayClothingFragments(){

    for(let fragment of clothingFragments){

        fragment.update();
        fragment.display();
    }
}