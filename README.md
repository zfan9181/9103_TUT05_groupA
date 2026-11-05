# 9103_TUT05_groupA
## Group Members

| Name | Student ID | Mechanic |
| --- | --- | --- |
| Zhiqi Fan | 560111004 | Artwork Recreation and User Input |
| Xiaoru (Renee) Luan | 560435807 | Audio |
| Yuwei Wu | 560362798 | Perlin Noise and Randomness |
| Tom Loftus-Hills | 550835480 | Time-based (Weather) |

## How to Interact

**Things you can do:**

- **Click the artwork** to start the music. Press the ↑ / ↓ arrow keys to change the volume.
- **Drag the magnifier** (the round glass on the face) to look closer at any part of the portrait. The area inside the glass turns grey.
- **Move the mouse** and all four eyes follow it.
- **Click the tear** on the cheek to make her cry. Click anywhere again to stop.

**Things to watch:**

- **Music:** the mouth sings, the blush turns deep pink on the beat, the white bars move, the hair grows and shrinks, and the flower wallpaper grows with the music.
- **Background:** the cloud-like colours keep moving. Stronger wind makes them move faster, and stronger weather turns the background from pink to blue.
- **Clothing and hair pieces:** the small pieces on the clothing and the small circles in the hair shake and flicker between colours. Stronger music makes them more active.
- **Earring:** the earring swings gently and its highlight flickers.
- **Weather:** the weather changes by itself every 5 to 30 seconds. Rain, wind and the grey overlay come and go, and the hair moves in the wind.

## Inspiration

## Group Concept
Our idea is to bring a still painting to life. We show the woman as a framed painting on a wall, like in a gallery, and she reacts to the viewer, the music and the weather. Perlin noise keeps her moving softly, so she always feels alive. Our mechanics also share values with each other, so the whole artwork reacts as one piece.

## Individual Mechanics

### Artwork Recreation and User Input Mechanic
Name: Zhiqi Fan  Student ID: 560111004

What it does:

1. Artwork recreation --- recreated the original portrait in p5.js with simple shapes, including the face, hair, eyes, nose, mouth, blush, tear, earring, clothing and background blocks. This file is the shared base that the other mechanics build on.
2. Magnifier --- drag the magnifier around the portrait to enlarge the area under it. The enlarged area turns grey, so the viewer's attention is pulled to that part while the rest of the artwork stays in colour.
3. Eye tracking --- all four eyes follow the mouse. The movement is kept small on purpose, so it looks like how real eyes move.
4. Tears --- click the tear on the face to start crying, and tears keep dropping from the cheek. Click again to stop.

How it works:

1. Artwork: each element is stored as an object or a class (`Eye`, `Hair`, `Shape`) with its own position, rotation and scale, then drawn with `translate()`, `rotate()` and `scale()`. Curved shapes such as the nose and the tear are drawn with `bezierVertex()`. Because every element keeps its values as variables, the other mechanics can animate them without redrawing the artwork.
2. Dragging: `mousePressed()` checks whether the mouse is inside the frame area and saves the offset between the mouse and the frame centre. `mouseDragged()` moves the frame with that offset, and `constrain()` keeps it inside the canvas. `mouseReleased()` stops the dragging.
* Enlarging: `get()` copies a smaller area of the canvas around the frame centre (lens size divided by `enlarge`), then `image()` draws it back at full lens size, so the content looks enlarged.
3. Grey filter: `filter(GRAY)` is applied only to the copied area before it is drawn, so only the part inside the magnifier turns grey.
* Eye tracking: the mouse position is mapped to a small offset for the iris and pupil: `(mouseX / width - 0.5) * 35` sideways and `(mouseY / height - 0.5) * 6.2` up and down. The eyelid is drawn on top, so the iris always stays inside the eye.
4. Tears: `mouseClicked()` checks whether the click is near the tear and switches `isCrying` on or off. The first drop falls right away, then a new drop is added every 55 frames. Each drop moves down 2 pixels per frame and is removed once it leaves the face area.

Files: artwork.js, userInput.js

### Audio Mechanic
Name：xiaoru（Renee）luan   Student ID: 560435807

**What it does:**
Click the artwork to start the music. 
Press ↑ / ↓ to change the volume.

1. Music --- the background music plays on loop, and jumps back to the start before it fades out.
2. Mouth sings with the music --- the mouth opens and closes with the flute melody
3. Blush --- changes from light pink to deep pink on every drum beat
4. White bars --- move up and down like a music equaliser (bass, low-mid, mid, treble)
5. Hair --- grows and shrinks with the drum beat, and the white rings keep moving outwards in a loop
6. Flower wallpaper --- the wall behind the frame grows with the music: some leaf sprigs grow longer and curl or open a daisy, the daisies open and close, and the small stars twinkle with the high notes. When the music is quiet, the sprigs pull back.

**How it works:**
- `loadSound()` loads the music. `addCue()` jumps it back to the start at 54s, so the loop has no gap.
- `p5.FFT` analyses the music every frame.
- Mouth: finds the loudest sound between 600 and 1400 Hz (the flute) and maps it to how wide the lips open.
- Drum beat: compares the bass with its average level. When the bass jumps above the average, it counts as a beat. It goes up fast and comes back down slowly.
- Blush: `lerpColor()` mixes light pink and deep pink using the beat.
- Hair: the hair scales up a little on each beat. The ring sizes change every 30 frames and start again with `%`, so the rings keep looping.
- White bars: each bar uses `getEnergy()` of one frequency band to set its height, growing from the bottom.
- Wallpaper: drawn on `createGraphics()` layers behind the artwork. How far the sprigs grow depends on the bar energy and the mouth. It only redraws when something changes, to keep the sketch fast.
- `lerp()` is used everywhere so all the changes are smooth.

**Files:**
`music.js`, `wall.js` (and small changes in `sketch.js`, `artwork.js`, `style.css` and `index.html`)

### Perlin Noise and Randomness Mechanic
Name: Yuwei Wu          Student ID: 560362798

**What it does:**
1. Background --- Perlin noise creates moving cloud-like color areas. The background color changes from pink to blue with the weather intensity.
2. Clothing --- the clothing is divided into small rectangle or triangle pieces. Create shaking effects by moving these pieces slightly, and randomly change their colors among the main color, lighter color, and some other colors from the artwork palette. Stronger music makes the effect more active.
3. Hair ---  Add three rings being made by small circle pieces wthin the black hair. They move slightly and randomly flicker between black and white like clothing effects.
4. Earring --- the earring has a flickering highlight, and Perlin noise makes the earring swing smoothly.

**How it works:**
- Background: each background segment gets a `noise()` value based on its position. Nearby segments get similar values, so the colors connect together and create cloud-like areas. Changing the noise position over time makes the cloud-like areas move continuously.
- Background color: Combine the wind and rain intensity into one weather intensity value. Use `lerpColor()` to change the background from pink to blue. Control how fast the cloud-like color areas move throught wind intensity `map()`.
- Clothing: each piece saves its original position. Two `noise()` values control the x and y movement, so the pieces move slightly around their original positions.
- Clothing color:` random()` decides when a piece changes color. Most pieces change to their lighter color, while some pieces randomly change to other colors from the artwork palette.
- Hair: Add small circle pieces inside each black hair circle. Set three different radius ratios for the three rings. `hair.size` and radiusRatio are used to calculate the actual radius of each ring. Then the small circle pieces are placed around these three rings. `noise()` makes them move slightly, and `random()` controls the black and white flicker effect.

**Files:**
Perlin&RandomnessMechanic.js

### Weather Mechanic 
**Tom Loftus-Hills / 550835480:**

**The weather mechanic as a whole provides random weather event timer logic that drives its own associated visual effects as well as provides the other mechanics a way of influencing their behaviour based on the weather state with simple weather intensity values.:**

### CLASSES: ###
# - weatherManager():
**Stores essential logic for weather intensity variables to be called from outside functions. Includes easing of the weather intensities so changes made via its associated update function don't happen suddenly**. 

# - rainDrop():
**Defines a repeatable rain drop shape which has range controlled random properties related to its scale, speed, and x and y starting positions. Included within the class are nested update functions to be called by the associated draw function. `updateRainDrop()` controls the animation of the rain drop falling and is dependant on weather intensity values. `displayRainDrop()` defines the physical shape of the rain drop. It also allows the rotation of the shape to be controlled by the wind intensity value to convey the sidwards momentum**.

# - windStream()
**Follows identical logic of the rainDrop class but defines its variables such that the shape moves sidewards instead of downwards. `updateWindStream()` & `displayWindStream` nested in this class also follow the same logic of rainDrop class' nested functions**.

### FUNCTIONS: ###
# - updateWeather()
**This function is called within draw() of artwork.js and provides the weatherManager class a way of updating its values to change weather states (values). This function essentially checks whether or not the predefined wind and rain state durations (in milliseconds) have passed, and if so, redefines such durations with different random values. It also provides a console log message for the sake of debugging other visual effects dependant on the weather states.** 

# - drawRain()
**This function is the method used for displaying the rainDrop class shapes. The key logic of this function is that the rainIntensity value is mapped (via an inverse relationship) to a rainDropInterval time (in milliseconds). Everytime that amount of time has passed, this function will push a new rain drop into the rainDrops[] array. Additionally, the dropCount variable (mapped to rainIntensity) allows more than one rain drop to be made over the same interval (this was a last minute revision to make the visual effect more appropriate). This function then uses a for loop to call the updateRainDrop() function for rainDrops[i]. Additionally, if any of the rain drops move below the height of the canvas, that particular drop is spliced from the array.** 

# - drawWind()
**This function follow an identical procedure to the drawRain() function but discludes a way of generating more than one wind stream per time interval**.

# - weatherAtmosUpdate()
**This function creates a simple visual effect aiming to dull the colours of the main artwork visuals in a way that reacts to the weather states. It follows a simple procedure of mapping the combined values of the weather intensity values to an associated opacity of a grey rectangle that covers the main artwork canvas**.

# - updateHairDisplacement()
**This function creates 3 hair displacement values that are referenced in the x value input arguments each of the 3 hair shapes. This is intended to create the effect of hair moving in the wind. This function works by creating 3 range controlled displacement targets every time an interval of time (determined by wind intensity) passes. These values are also scaled based on the wind intensity. It then uses easing to create 3 moving hair displacement values which are then added to the x input argument for each of the 3 hair shapes.**

**Files:**
`weatherMechanic.js` + changes to `artwork.js`


## References
1. Minimalistic Women Figurative Art - abstract, minimalist painting
online. (2026). Fizdi.com. https://www.fizdi.com/minimalistic-women-figurative-art-
prt_15815-canvas-art-print-13in-x-
13in/?srsltid=AU7gw4WNPwmH9rhoJK8vJ7fBCWIpYzMn_o8R9qC_KUzVrACcJI0Z
w2A5

2. 2D Perlin noise - Moussa, A. (2021, June 9). An introduction to Perlin Noise in P5JS
and Processing. Gorilla Sun. https://www.gorillasun.de/blog/an-introduction-to-
perlin-noise-in-p5js-and-processing/
 
3. bobbyraysimmons-141059862. (n.d.). Beat driven music [Song]. SoundCloud. https://soundcloud.com/bobbyraysimmons-141059862/beat-driven-music

## Techniques from outside the course
- `style()` with CSS (`position: fixed`, `z-index`, `pointer-events`) puts the wallpaper layers behind the artwork. [p5 style()](https://p5js.org/reference/p5.Element/style/), [MDN z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
- `getBoundingClientRect()` finds where the artwork is on the page, so the wallpaper can be rebuilt when the window changes. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
- `wallRandom()` uses the Lehmer (Park-Miller) random formula, so the wallpaper looks the same every time. `randomSeed()` was not used because it would also change `random()` in the rest of the code. [Wikipedia](https://en.wikipedia.org/wiki/Lehmer_random_number_generator)
- `sampleRate()` is used to work out which part of the FFT spectrum is 600–1400 Hz (the flute). [p5 getEnergy()](https://p5js.org/reference/p5.FFT/getEnergy/)
- `addCue()` jumps the music back to the start at 54s. [p5 addCue()](https://archive.p5js.org/reference/#/p5.SoundFile/addCue)
- The round magnifier uses `drawingContext` and canvas `clip()` to show the picture only inside a circle. [p5 drawingContext](https://p5js.org/reference/p5/drawingContext/), [MDN clip()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip)
- CSS variables, `min()` and `box-shadow` make the gold frame and mat around the artwork. [MDN box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow), [MDN min()](https://developer.mozilla.org/en-US/docs/Web/CSS/min)

## AI Acknowledgement
AI (ChatGPT) was used to help TEST and debug some of this code. and assist with grammar refinement and clarity of expression.
- Zhiqi Fan: I used ChatGPT to learn and understand p5.js coding concepts, and all the interaction design decisions and final implementation were guided by my own ideas and understanding.


