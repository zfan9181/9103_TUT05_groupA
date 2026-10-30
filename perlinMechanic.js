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