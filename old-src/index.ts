// Constants
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
let shaperNode: WaveShaperNode;
let filterNode: BiquadFilterNode;

// Element refs
const source = document.getElementById('audioClip') as HTMLMediaElement;
const playButton = document.getElementById('play') as HTMLButtonElement;
const pauseButton = document.getElementById('pause') as HTMLButtonElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
const stereoPannerSlider = document.getElementById(
  'panner'
) as HTMLInputElement;
const visualizer = document.getElementById('visualizer') as HTMLCanvasElement;
const shaperCheckbox = document.getElementById('shaper') as HTMLInputElement;

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

  // Analyser init
  analyserNode.fftSize = 8192;
  bufferLength = analyserNode.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // Stereo Panning Node
  stereoPannerNode = context.createStereoPanner();

  // Waveshaper node
  shaperNode = context.createWaveShaper();

  // Biquad Filter
  filterNode = context.createBiquadFilter();
  filterNode.type = 'highpass';
  filterNode.frequency.value = 1000;

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
      gainNode.gain.value = parseFloat(volumeSlider.value);
    },
    false
  );

  stereoPannerSlider.addEventListener(
    'input',
    function () {
      stereoPannerNode.pan.value = parseFloat(stereoPannerSlider.value);
    },
    false
  );

  shaperCheckbox.addEventListener(
    'change',
    function () {
      const isUsingShaper = shaperCheckbox.checked;
      if (isUsingShaper) {
        shaperNode.curve = makeDistortionCurve(400);
        shaperNode.oversample = '4x';
      } else {
        shaperNode.curve = null;
        shaperNode.oversample = 'none';
      }
    }
  );

  // Build audio node graph
  input
    .connect(gainNode)
    //.connect(filterNode)
    .connect(shaperNode)
    .connect(stereoPannerNode)
    .connect(analyserNode)
    .connect(context.destination);

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
function loop(timestamp: DOMHighResTimeStamp): void {
  // Query the analyser for the current audio frequency data
  analyserNode.getByteFrequencyData(dataArray);

  // Clear the canvas before drawing
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.beginPath();

  // Draw amplitude bars
  for (var i = 0; i <= NUM_BARS; i++) {
    const barHeight = dataArray[i];
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


function makeDistortionCurve(amount: number): Float32Array {
  var k = amount || 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};
