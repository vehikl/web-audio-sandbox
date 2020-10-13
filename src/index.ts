// Declare globals
let context: AudioContext;
let input: MediaElementAudioSourceNode;
let gainNode: GainNode;
let stereoPannerNode: StereoPannerNode;

// Element refs
const source = document.getElementById('audioClip') as HTMLMediaElement;
const playButton = document.getElementById('play') as HTMLButtonElement;
const pauseButton = document.getElementById('pause') as HTMLButtonElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
const stereoPannerSlider = document.getElementById(
  'panner'
) as HTMLInputElement;

/**
 * Initialize the Web Audio API. Must be called after user input.
 */
function initializeAudio() {
  // Create context
  context = new AudioContext();

  // Create our input source node
  input = context.createMediaElementSource(source);

  //Gain node
  gainNode = context.createGain();

  // Stereo Panning Node
  stereoPannerNode = context.createStereoPanner();

  // Build audio node graph
  input
    .connect(gainNode)
    .connect(stereoPannerNode)
    .connect(context.destination);

  // Remove this function from the mouseover event
  window.removeEventListener('mouseover', initializeAudio, false);
}

// Initialize AudioContext on mouse input
window.addEventListener('mouseover', initializeAudio, false);

// Play button
playButton.addEventListener(
  'click',
  function () {
    source.play();
  },
  false
);

// Pause button
pauseButton.addEventListener(
  'click',
  function () {
    source.pause();
  },
  false
);

volumeSlider.addEventListener(
  'input',
  function () {
    console.log(volumeSlider.value);
    gainNode.gain.value = parseFloat(volumeSlider.value);
  },
  false
);

stereoPannerSlider.addEventListener(
  'input',
  function () {
    console.log(stereoPannerSlider.value);
    stereoPannerNode.pan.value = parseFloat(stereoPannerSlider.value);
  },
  false
);
