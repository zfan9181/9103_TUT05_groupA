//CLASSES/////////////////////////////////////////

//Generate Weather manager class containing weather duration and intensity initial values

class weatherManager {
    constructor() {
        this.windDuration = random(5000, 20000);
        this.rainDuration = random(5000, 20000);
        this.windIntensity = random(0.1, 1);
        this.rainIntensity = random(0.1, 1);
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
        this.speed = 15
    }
    updateRainDrop() {
          this.y += this.speed
        }
    display() {
        push();
        translate(this.x, this.y);
        strokeWeight(this.scale);
        stroke(200, 200, 200);   
        line(0, 0, 0, random(8,12));
        pop();
    }
}

//Create a shape class for wind streams
class windStream {
    constructor(){
        this.x = 0;
        this.y = random(0, height);
        this.scale = random (2, 3);
        this.speed = 10
    }
    updateWindStream() {
        this.x += this.speed + (weather.windIntensity * 30);
    }
    display() {
        push();
        translate(this.x, this.y);
        strokeWeight(this.scale);
        stroke(255, 255, 255);
        line(0, 0, random(50,75), 0);
        pop();
    }
}



//FUNCTIONS/////////////////////////////////////////



//Function to update weather values based on duration and intensity
function updateWeather(){
    const currentTime = millis();

    //This if statement allows the durations of the wind and rain state to be initiallized again with random values after the duration of either have passed.
    if (currentTime - weather.lastWindChange >= weather.windDuration) {
        //update wind values
        weather.windDuration = random(5000, 20000);
        weather.windIntensity = random(0.1, 1);
        weather.lastWindChange = currentTime;
        console.log("Wind Intensity Updated to " + weather.windIntensity); // FOR DEBUGGING//
    }
    
    if (currentTime - weather.lastRainChange >= weather.rainDuration) {
        //update rain values
        weather.rainDuration = random(5000, 20000);
        weather.rainIntensity = random(0.1, 1);
        weather.lastRainChange = currentTime;
        console.log("Rain Intensity Updated to " + weather.rainIntensity); //FOR DEBUGGING//
    }
}

let rainDrops = []               //Initialize an array to record the individual instances of the rainDrop class
let windStreams = []             //Initialize an array to record the individual instances of the windStream class
let lastRainDropTime = 0;        //Provides a variable to keep track of the last time the rain class was called. 
let lastWindStreamTime = 0;      //Provides a variable to keep track of the last time the wind class was called.

function drawRain() {
    //Initialize a current time variable and an interval variable that is mapped to the rain Intensity value such that the higher the intensity, the lower the interval.
    const currentTime = millis();
    const rainDropInterval = map(weather.rainIntensity, 0.1, 1, 1000, 10);


    if (currentTime - lastRainDropTime >= rainDropInterval) {   // If statement that checks if the time interval has passed since the last time a rainDrop was created.
        rainDrops.push(new rainDrop());                         // If true, a new rainDrop Class instance is pushed into the rainDrops array.
        lastRainDropTime = currentTime;
    }


    for (let i = rainDrops.length - 1; i >= 0; i--) {           // For loop that cycles through each active drop in the array and calls the update and display functions. 
        const drop = rainDrops[i];                              // It does this in reverse because the new drops are at the end of the array.
        drop.updateRainDrop();
        drop.display();
    }
}

function drawWind() {
    //Initialize a current time variable and an interval variable that is mapped to the wind Intensity value such that the higher the intensity, the lower the interval.
    const currentTime = millis();
    const windStreamInterval = map(weather.windIntensity, 0.1, 1, 1000, 50);

    
    if (currentTime - lastWindStreamTime >= windStreamInterval) {
        windStreams.push(new windStream());
        lastWindStreamTime = currentTime;
    }

    for (let i = windStreams.length - 1; i >= 0; i--) {
        const stream = windStreams[i];
        stream.updateWindStream();
        stream.display();


    }
}




//TO BE PUT IN THE DISPLAY FUNCTION OF THE ARTWORK.JS FILE
//function createArtwork(){
 // weather = new weatherManager();