# 9103_TUT05_groupA
## Group Members

| Name | Student ID | Mechanic |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|Tom Loftus-Hills | 550835480 | Time-based |
|  |  |  |

## How to Run

## How to Interact

## Inspiration

## Group Concept

## Individual Mechanics

- User Input Mechanic:
Zhiqi Fan 560111004
1.dragable magnifier frame --- enlarge element
2.eye follow the mouse
3.tears drop and stop by mouse clicking

### Audio Mechanic
**Name / Student ID:**

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

**Techniques from outside the course:**
- `style()` with CSS (`position: fixed`, `z-index`, `pointer-events`) puts the wallpaper layers behind the artwork. [p5 style()](https://p5js.org/reference/p5.Element/style/), [MDN z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
- `getBoundingClientRect()` finds where the artwork is on the page, so the wallpaper can be rebuilt when the window changes. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
- `wallRandom()` uses the Lehmer (Park-Miller) random formula, so the wallpaper looks the same every time. I didn't use `randomSeed()` because it would also change `random()` in my group's code. [Wikipedia](https://en.wikipedia.org/wiki/Lehmer_random_number_generator)
- `sampleRate()` is used to work out which part of the FFT spectrum is 600–1400 Hz (the flute). [p5 getEnergy()](https://p5js.org/reference/p5.FFT/getEnergy/)
- `addCue()` jumps the music back to the start at 54s. [p5 addCue()](https://archive.p5js.org/reference/#/p5.SoundFile/addCue)
- CSS variables, `min()` and `box-shadow` make the gold frame and mat around the artwork. [MDN box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow), [MDN min()](https://developer.mozilla.org/en-US/docs/Web/CSS/min)

**Files:**
`music.js`, `wall.js` (and small changes in `sketch.js`, `artwork.js`, `style.css` and `index.html`)

### Perlin Noise and Randomness Mechanic
**Name / Student ID:**

**What it does:**

**How it works:**

**Files:**

###### Weather Mechanic ######
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


## File Structure

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

## AI Acknowledgement
AI (ChatGPT) was used to help TEST and debug some of this code.
