//CLASSES/////////////////////////////////////////

//Generate Weather manager class containing weather duration and intensity initial values

class weatherManager {
    constructor() {
        this.windDuration = random(5000, 30000);
        this.rainDuration = random(5000, 30000);
        this.windIntensityTarget = random(0.1, 1);
        this.rainIntensityTarget = random(0.1, 1);
        this.windIntensity = 0.1;
        this.rainIntensity = 0.1;
        this.lastWindChange = millis();
        this.lastRainChange = millis();
    }
}

//Rain Drop Class: This provides the variables and logic for the rain 
class rainDrop {
    constructor(){
        this.x = random(0,width);
        this.y = 0;
        this.scale = random(2, 5);
        this.speed = 30
    }
    updateRainDrop() {
          this.y += this.speed
          this.x += (weather.windIntensity * (this.speed*0.5));
        }
    display() {
        push();
        translate(this.x, this.y);
        const rainAngle = map(weather.windIntensity, 0.1, 1, 0, 0.5);
        rotate(-rainAngle);
        strokeWeight(this.scale);
        stroke(174, 219, 235);   
        line(0, 0, 0, random(8,12));
        pop();
    }
}

//Create a shape class for wind streams
class windStream {
    constructor(){
        this.x = 0;
        this.y = random(0, height);
        this.scale = random (1, 2);
        this.speed = 10
    }
    updateWindStream() {
        this.x += this.speed + (weather.windIntensity * 30);
    }
    display() {
        push();
        translate(this.x, this.y);
        strokeWeight(this.scale);
        stroke(200 , 200, 200);
        line(0, 0, random(30,75), 0);
        pop();
    }
}

//FUNCTIONS/////////////////////////////////////////


let rainDrops = []               //Initialize an array to record the individual instances of the rainDrop class
let windStreams = []             //Initialize an array to record the individual instances of the windStream class
let lastRainDropTime = 0;        //Provides a variable to keep track of the last time the rain class was called. 
let lastWindStreamTime = 0;      //Provides a variable to keep track of the last time the wind class was called.
let weatherAtmosColour;
let weatherAtmosIntensity;
let lastDisplacementChange = 0;
let hairDisplacementTarget1 = 0; 
let hairDisplacementTarget2 = 0;
let hairDisplacementTarget3 = 0;
let hairDisplacement1;
let hairDisplacement2;
let hairDisplacement3;
let hairDisplacementInterval;

//Function to update weather values based on duration and intensity
function updateWeather(){
    const currentTime = millis();
    
    weather.windIntensity = lerp(weather.windIntensity, weather.windIntensityTarget, 0.01);
    weather.rainIntensity = lerp(weather.rainIntensity, weather.rainIntensityTarget, 0.01);

    //This if statement allows the durations of the wind and rain state to be initiallized again with random values after the duration of either have passed.
    if (currentTime - weather.lastWindChange >= weather.windDuration) {
        //update wind values
        weather.windDuration = random(5000, 30000);
        weather.windIntensityTarget = random(0.1, 1);
        weather.lastWindChange = currentTime;
        console.log("Wind Intensity Target Updated to " + weather.windIntensityTarget); // FOR DEBUGGING//
    }
    
    if (currentTime - weather.lastRainChange >= weather.rainDuration) {
        //update rain values
        weather.rainDuration = random(5000, 30000);
        weather.rainIntensityTarget = random(0.1, 1);
        weather.lastRainChange = currentTime;
        console.log("Rain Intensity Target Updated to " + weather.rainIntensityTarget); //FOR DEBUGGING//
    }
}

function drawRain() {
    //Initialize a current time variable and an interval variable that is mapped to the rain Intensity value such that the higher the intensity, the lower the interval.
    const currentTime = millis();
    const rainDropInterval = map(weather.rainIntensity, 0.1, 1, 500, 10);

    if (weather.rainIntensity > 0.45) {   // If statement that checks if the rain intensity is above a certain threshold. If it is, the rainDrop class will be called.
        if (currentTime - lastRainDropTime >= rainDropInterval) {   // If statement that checks if the time interval has passed since the last time a rainDrop was created.
            rainDrops.push(new rainDrop());                         // If true, a new rainDrop Class instance is pushed into the rainDrops array.
            lastRainDropTime = currentTime;
        }

    }    
    for (let i = rainDrops.length - 1; i >= 0; i--) {   // For loop that cycles through each active drop in the array and calls the update and display functions. 
        const drop = rainDrops[i];
        if (rainDrops[i].y > height){
                rainDrops.splice(i, 1);
        } else{                                 
            drop.updateRainDrop();
            drop.display();
        }
    }
    
}

function drawWind() {
    //Initialize a current time variable and an interval variable that is mapped to the wind Intensity value such that the higher the intensity, the lower the interval.
    const currentTime = millis();
    const windStreamInterval = map(weather.windIntensity, 0.1, 1, 1000, 50);

    if (weather.windIntensity > 0.45){
        if (currentTime - lastWindStreamTime >= windStreamInterval) {
            windStreams.push(new windStream());
            lastWindStreamTime = currentTime;
        }
    }    
    for (let i = windStreams.length - 1; i >= 0; i--) {
        const stream = windStreams[i];
        if (windStreams[i].x > width){
            windStreams.splice(i, 1);
        } else{
            stream.updateWindStream();
            stream.display();
        }
    }
        
}

function weatherAtmosUpdate(){   
    push();
    const intensity = weather.windIntensity + weather.rainIntensity;
    const opacity = map(intensity, 0.2, 2, 0 ,100);
    const colour = map(intensity, 0.2, 2, 255, 150);
    noStroke();
    fill(colour, colour, colour, opacity);
    rect(0, 0, width, height);
    pop();

}

function updateHairDisplacement() {
    const currentTime = millis();
    hairDisplacementInterval = map(weather.windIntensity, 0.1, 1, 300, 75)
    if (currentTime - lastDisplacementChange >= hairDisplacementInterval){
        lastDisplacementChange = millis();
        
        hairDisplacementTarget1 = random(-10*(1.5 + weather.windIntensity), 20*(1.5 + weather.windIntensity));
        hairDisplacementTarget2 = random(-10*(1.5 + weather.windIntensity), 20*(1.5 + weather.windIntensity));
        hairDisplacementTarget3 = random(-10*(1.5 + weather.windIntensity), 20*(1.5 + weather.windIntensity));
    }

    const interpolation = map(weather.windIntensity, 0.1, 1, 0.01, 0.03);
    hair1.displacement = lerp(hair1.displacement, hairDisplacementTarget1, interpolation);
    hair2.displacement = lerp(hair2.displacement, hairDisplacementTarget2, interpolation);
    hair3.displacement = lerp(hair3.displacement, hairDisplacementTarget3, interpolation);
}