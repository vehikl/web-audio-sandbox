const audioCtx = new AudioContext();

const audioElement = document.getElementById("guitar") as HTMLMediaElement;
const source = audioCtx.createMediaElementSource(audioElement);

// Volume control
const gainNode = audioCtx.createGain();

// Stereo pan
const stereoPanNode = audioCtx.createStereoPanner();

// Build signal chain
source.connect(gainNode).connect(stereoPanNode).connect(audioCtx.destination);

// Wire event listeners
const panElement = document.getElementById("pan") as HTMLInputElement;
panElement.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  console.log(target.value);
  const val = parseInt(target.value);
  stereoPanNode.pan.value = val;
});
