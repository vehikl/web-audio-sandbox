// Declare globals
let context: AudioContext;
let input: MediaElementAudioSourceNode;

// Element refs
const source = document.getElementById('audioClip') as HTMLMediaElement;
const playButton = document.getElementById('play') as HTMLButtonElement;
const pauseButton = document.getElementById('pause') as HTMLButtonElement;

/**
 * Initialize the Web Audio API. Must be called after user input.
 */
function initializeAudio() {
  // Create context
  context = new AudioContext();

  // Create our input source node
  input = context.createMediaElementSource(source);

  // Build audio node graph
  input.connect(context.destination);

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

// TODO: Resume stereo panning and volume controls...
