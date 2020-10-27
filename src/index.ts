const WIDTH = 400;
const HEIGHT = 256;
const NUM_BARS = 40;
const BAR_WIDTH = WIDTH / NUM_BARS;

// Declare globals
let context: AudioContext;
let input: MediaElementAudioSourceNode;
let gainNode: GainNode;
let stereoPannerNode: StereoPannerNode;
let analyserNode: AnalyserNode;

// Element refs
const source = document.getElementById('audioClip') as HTMLMediaElement;
const playButton = document.getElementById('play') as HTMLButtonElement;
const pauseButton = document.getElementById('pause') as HTMLButtonElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
const stereoPannerSlider = document.getElementById(
  'panner'
) as HTMLInputElement;
const visualizer = document.getElementById('visualizer') as HTMLCanvasElement;

let bufferLength: number;
let dataArray: Uint8Array;

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

  // Analyzer Node
  analyserNode = context.createAnalyser();

  // Stereo Panning Node
  stereoPannerNode = context.createStereoPanner();

  // Add event listeners
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

  // Build audio node graph
  input
    .connect(gainNode)
    .connect(stereoPannerNode)
    .connect(analyserNode)
    .connect(context.destination);

  // Analyser init
  analyserNode.fftSize = 256;
  bufferLength = analyserNode.frequencyBinCount;
  console.log(bufferLength);
  dataArray = new Uint8Array(bufferLength);

  // Start canvas render loop
  requestAnimationFrame(loop);

  // Remove this function from the mouseover event
  window.removeEventListener('mouseover', initializeAudio, false);
}

// Initialize AudioContext on mouse input
window.addEventListener('mouseover', initializeAudio, false);

// Canvas 2D Rendering
const canvasCtx = visualizer.getContext(
  '2d'
) as CanvasRenderingContext2D;

/**
 * Visualiser render loop function. Draws a series ofbars that reflect the amplitude
 * of the audio data.
 * @param timestamp Elapsed time since animation started
 */
function loop(timestamp: DOMHighResTimeStamp) {
  // Query the analyser for the current audio frequency data
  analyserNode.getByteFrequencyData(dataArray);

  // Clear the canvas before drawing
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.beginPath();
  canvasCtx.moveTo(0, 0);


  // Draw amplitude bars
  for (var i = 0; i <= NUM_BARS; i++) {
    const barHeight = dataArray[i];
    canvasCtx.fillStyle = `hsl(${(barHeight) * 360 / 255},100%,50%)`;
    canvasCtx.strokeStyle = `rgb(255, 0, 0)`;
    canvasCtx.lineWidth = 1;

    const x = BAR_WIDTH * i;
    const y = HEIGHT - barHeight;
    canvasCtx.lineTo(x, y);
  }
  canvasCtx.stroke();

  // Trigger the next frame
  requestAnimationFrame(loop);
};
