import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';

interface AppAudioContextInterface {
  audioContext?: AudioContext;
  inputSource?: MediaElementAudioSourceNode;
  register: (node: AudioNode) => void;
  registerMediaSource: (node: HTMLMediaElement) => void;
  mediaSourceRef?: React.MutableRefObject<MediaElementAudioSourceNode | undefined>
}

const AppAudioContext = createContext<AppAudioContextInterface>({
  register: () => {
    /** */
  },
  registerMediaSource: () => {
    /** */
  },
});

export const useAudioContext = () => useContext(AppAudioContext);

export const AudioContextProvider: React.FC = ({ children }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | undefined>(
    undefined
  );
  const [headNode, setHeadNode] = useState<AudioNode | undefined>(undefined);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | undefined>();
  // console.log(headNode);

  // useEffect(() => {
  //   if (audioContext && audioNodes.length > 0) {
  //     console.log(audioNodes);
  //     // audioNodes.forEach((a) => a.disconnect());
  //     audioNodes
  //       .reduce((inputer, node) => inputer.connect(node))
  //       .connect(audioContext.destination);
  //   }
  //   if (audioContext && audioNodes.length > 0) {
  //     for (let i = 0, j = 1; i < audioNodes.length; i++, j++) {
  //       const currentNode = audioNodes[i];
  //       const nextNode = audioNodes[j] || audioContext?.destination;
  //       currentNode.connect(nextNode);
  //     }
  //   }
  // }, [headNode, audioContext]);

  const registerMediaSource: AppAudioContextInterface['registerMediaSource'] = (mediaElement) => {
    setAudioContext((currentAudioContext) => {
      if (!mediaSourceRef.current && currentAudioContext) {
        mediaSourceRef.current = currentAudioContext.createMediaElementSource(mediaElement);
      }
      return currentAudioContext;
    });
  }

  const register: AppAudioContextInterface['register'] = (newNode) => {
    if (mediaSourceRef.current && audioContext) {
      mediaSourceRef.current.connect(newNode);
    }
  }

  const initializeAudio = useCallback(() => {
    // Create context
    setAudioContext(new AudioContext());

    // Create our input source node
    // input = context.createMediaElementSource(source);

    // //Gain node
    // gainNode = context.createGain();

    // // Analyzer Node
    // analyserNode = context.createAnalyser();

    // // Analyser init
    // analyserNode.fftSize = 8192;
    // bufferLength = analyserNode.frequencyBinCount;
    // dataArray = new Uint8Array(bufferLength);

    // // Stereo Panning Node
    // stereoPannerNode = context.createStereoPanner();

    // // Waveshaper node
    // shaperNode = context.createWaveShaper();

    // // Biquad Filter
    // filterNode = context.createBiquadFilter();
    // filterNode.type = 'highpass';
    // filterNode.frequency.value = 1000;

    // Build audio node graph
    // input
    //   .connect(gainNode)
    //   //.connect(filterNode)
    //   .connect(shaperNode)
    //   .connect(stereoPannerNode)
    //   .connect(analyserNode)
    //   .connect(context.destination);
    window.removeEventListener('mouseover', initializeAudio, false);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseover', initializeAudio, false);
  }, [initializeAudio]);

  return (
    <AppAudioContext.Provider value={{ audioContext, register, registerMediaSource, mediaSourceRef }}>
      {children}
    </AppAudioContext.Provider>
  );
};
