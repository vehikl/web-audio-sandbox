import React, { useEffect, createRef, useState } from 'react';
import { useAudioContext } from './AudioContext';

type AudioSourceControlProps = React.HTMLProps<HTMLAudioElement>;

const AudioSourceControl: React.FC<AudioSourceControlProps> = (props) => {
  const { register, audioContext } = useAudioContext();
  const audioRef = createRef<HTMLAudioElement>();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!registered && audioContext && audioRef.current) {
      console.log("GAIN");
      const gain = audioContext.createMediaElementSource(audioRef.current);
      register(gain);
      setRegistered(true);
    }
  }, [register, audioContext, audioRef, registered]);

  return <audio {...props} ref={audioRef}></audio>;
};

export default AudioSourceControl;
