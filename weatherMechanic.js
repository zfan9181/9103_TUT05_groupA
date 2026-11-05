//CLASSES/////////////////////////////////////////

//The weather manager class stores essential variables for the weather mechanic.
class weatherManager {
    constructor() {
        this.windDuration = random(5000, 30000);        //Initialize a random duration for the current wind state
        this.rainDuration = random(5000, 30000);        //Initialize a random duration for the current rain state
        this.windIntensityTarget = random(0.1, 1);      //Initialize a random target intensity for the current wind state
        this.rainIntensityTarget = random(0.1, 1);      //Initialize a random target intensity for the current rain state
        this.windIntensity = 0.1;                       //Provides a starting value for the wind intensity to be updated by the updateWeather() function
        this.rainIntensity = 0.1;                       //Provides a starting value for the rain intensity to be updated by the updateWeather() function
        this.lastWindChange = millis();                 //Provides variable and initial value to keep track of the last time the wind state changed
        this.lastRainChange = millis();                 //Provides variable and initial value to keep track of the last time the rain state changed
    }
}

//Rain Drop Class: This provides the variables and logic for the rain visual effect. 
class rainDrop {
    constructor(){
        this.x = random(0,width);                                         //The x position of the rain drop is randomized across the width of the canvas
        this.y = random(-60, 0);                                          //The y position of the rain drop is randomized above the canvas so that in the case that multiple rain drops are falling, they will not all start at the same position.
        this.scale = random(0.13, 0.24);                                  //The scale of the random is randomized within a range thought to provide realistic variation in the size of the rain drops.
        this.speed = random(7, 13);                                       //The speed of the rain drop also randomized to give the effect of variation in perceived depth of the visual effect.
    }
    //This is a nested update function for the rain drop class to be called in the drawRain() function.
    updateRainDrop() {
          this.y += this.speed                                            //The speed of the rain drop is added to the y position to provide the animation of the rain drops falling   
          this.x += (weather.windIntensity * (this.speed*0.5));           //The x position of the rain drop is also update and scaled according to the wind intensity value to give the effect of the wind blowing the rain drops sideways.
    }
    //This is a nested display function for the rain drop class to be called in the drawRain() function.
    display() {                                                           
        push();
        translate(this.x, this.y);                                        //The position of the rain drop is translated to the x and y position of the rain drop instance.
        const rainAngle = map(weather.windIntensity, 0.1, 1, 0, 0.5);     //The angle of the rain drop is mapped to the wind intensity value. This means the rain drop will be angle based on how much wind there is.
        rotate(-rainAngle);                                               
        scale(this.scale);
        noStroke();
        fill(75, 188, 204, 220);   // same blue as the tear               //The follow is a revised design for the overall shape of the rain drops.
        beginShape();
        vertex(0, -42);
        bezierVertex(8, -20, 20, 10, 20, 23);
        bezierVertex(20, 48, -20, 48, -20, 23);
        bezierVertex(-20, 10, -8, -20, 0, -42);
        endShape(CLOSE);
        // a small shine, like on the magnifying glass
        fill(255, 255, 255, 170);
        ellipse(-7, 20, 8, 16);
        pop();
    }
}

//Create a shape class for wind streams
class windStream {
    constructor(){
        this.x = 0;                                                       //All wind streams start at the left side of the canvas and move to the right so the initial x postion is always 0.
        this.y = random(0, height);                                       //The y position of the wind stream is randomized across the height of the canvas to provide variation in the visual effect.
        this.scale = random (1, 2);                                       //See above.
        this.speed = 10                                                   //Wind streams are given a constant speed value, however this value is scaled in the nest update function.
    }
    //This is a nested update function for the wind stream class to be called in the drawWind() function.
    updateWindStream() {
        this.x += this.speed + (weather.windIntensity * 30);              //Scales the wind speed based on the wind intensity values.
    }
    //This is a nested display function for the wind stream class to be called in the drawWind() function.
    display() {
        push();
        translate(this.x, this.y);                                        //The position of the wind stream is translated to the x and y position of the wind stream instance.
        strokeWeight(this.scale);                                         //The stroke weight of the wind stream is scaled based on the randomized scale value of the wind stream instance.
        stroke(200 , 200, 200);                                           //The stroke colour of the wind stream is set to a light grey
        line(0, 0, random(30,75), 0);                                     //The line function is used to draw a simple windstream. The length of the wind stream is also randomized.
        pop();
    }
}

//FUNCTIONS/////////////////////////////////////////

//Initializes all of the relevant variables for the following weather mechanic functions.
let rainDrops = []               
let windStreams = []             
let lastRainDropTime = 0;        
let lastWindStreamTime = 0;      
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
    const currentTime = millis();    //This constant provides a constantly updating value of the current time in milliseconds to be used in the following if statements.
    
    weather.windIntensity = lerp(weather.windIntensity, weather.windIntensityTarget, 0.01);    //Uses the target values initialized in the weatherManager to ease changes in the wind and rain intensity values. 
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

    if (weather.rainIntensity > 0.45) {                                           // If statement that checks if the rain intensity is above a certain threshold. This prevents rain drops from being created when the rain intensity is low.
        if (currentTime - lastRainDropTime >= rainDropInterval) {                 // If statement that checks if the time interval has passed since the last time a rainDrop was created.
            const dropCount = floor(map(weather.rainIntensity, 0.45, 1, 1, 4));   // The dropCount variable is mapped to the rain intensity value such that if the rain intensity is high, more than one rainDrop will be created at a time via the follow code. Floor function is used to make sure that value is a whole number.
            for (let i = 0; i < dropCount; i++) {                                 //A for loop that pushes an amount of new rainDrop instances into the rainDrops array based on the dropCount value.
                rainDrops.push(new rainDrop());                     
            }
            lastRainDropTime = currentTime;                                       //Resets the lastRainDropTime variable to the current time so that the interval can be checked again in the next frame.
        }

    }    
    for (let i = rainDrops.length - 1; i >= 0; i--) {   // For loop that cycles through each active drop in the array and calls the update and display functions. 
        const drop = rainDrops[i];
        if (rainDrops[i].y > height){                   //If statement that checks if the rain drop has fallen below the canvas. If it has, it is removed from the array to prevent performance issues.
                rainDrops.splice(i, 1);
        } else{                                 
            drop.updateRainDrop();                      //Calls the update function for the rain drop instance.
            drop.display();                             //Calls the display function for the rain drop instance.
        }
    }
    
}

function drawWind() {
    //Initialize a current time variable and an interval variable that is mapped to the wind Intensity value such that the higher the intensity, the lower the interval.
    const currentTime = millis();
    const windStreamInterval = map(weather.windIntensity, 0.1, 1, 1000, 50);

    if (weather.windIntensity > 0.45){                                   //The following logic is idenitical to the drawRain() function, besides the fact that is can't create more than one wind stream at a time.
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
//This function established an additional visual effect to the weather mechanic by overlaying a semi-transparent rectangle over the entire canvas. 
function weatherAtmosUpdate(){   
 
    push();
    const intensity = weather.windIntensity + weather.rainIntensity;    //The intensity variable is the sum of the wind and rain intensity values. 
    const opacity = map(intensity, 0.2, 2, 0 ,100);                     //The opacity of the rectangle is mapped to the intensity value such that the higher the intensity, the more opaque the rectangle will be.
    const colour = map(intensity, 0.2, 2, 255, 150);                    //The colour of the rectangle is also mapped to the intensity value such that the higher the intensity, the darker the rectangle will be.
    noStroke();
    fill(colour, colour, colour, opacity);
    rect(0, 0, width, height);
    pop();
        
    
}
//This function provide a visual effect to the hair of the character by creating logic to randomly and constantly displace the hair x coordinates to create the effect of hair moving in the wind.
function updateHairDisplacement() {
    const currentTime = millis();                                                                                //This constant provides a constantly updating value of the current time in milliseconds to be used in the following if statements.
    hairDisplacementInterval = map(weather.windIntensity, 0.1, 1, 300, 75)                                       //Maps an inverse relationship between the wind intensity and the interval after which the hair displacement target values are updated. The higher the wind intensity, the more frequently the hair displacement target values will be updated.
    if (currentTime - lastDisplacementChange >= hairDisplacementInterval){
        lastDisplacementChange = millis();
        
        hairDisplacementTarget1 = random(-10*(1.5 + weather.windIntensity), 20*(1.5 + weather.windIntensity)); //The 3 hair displacement target values are randomized within a range that is scaled based on the wind intensity value. 
        hairDisplacementTarget2 = random(-10*(1.5 + weather.windIntensity), 20*(1.5 + weather.windIntensity));
        hairDisplacementTarget3 = random(-10*(1.5 + weather.windIntensity), 20*(1.5 + weather.windIntensity));
    }

    const interpolation = map(weather.windIntensity, 0.1, 1, 0.01, 0.03);                                      //The interpolation value is mapped to the wind intensity value such that the higher the wind intensity, the faster the hair displacement values will ease towards their target values.
    hair1.displacement = lerp(hair1.displacement, hairDisplacementTarget1, interpolation);                     //The hair displacement values are eased towards their target values using the lerp() function and the interpolation value.
    hair2.displacement = lerp(hair2.displacement, hairDisplacementTarget2, interpolation);
    hair3.displacement = lerp(hair3.displacement, hairDisplacementTarget3, interpolation);
}