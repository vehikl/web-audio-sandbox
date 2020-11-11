import React, { useEffect, createRef, useState } from 'react';
import { useAudioContext } from './AudioContext';

type AudioSourceControlProps = React.HTMLProps<HTMLAudioElement>;

const AudioSourceControl: React.FC<AudioSourceControlProps> = (props) => {
  const { registerMediaSource, audioContext } = useAudioContext();
  const audioRef = createRef<HTMLAudioElement>();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!registered && audioRef.current) {
      console.log("Media Source");
      registerMediaSource(audioRef.current);
      setRegistered(true);
    }
  }, [registerMediaSource, audioRef, registered]);

  return <audio {...props} ref={audioRef}></audio>;
};

export default AudioSourceControl;
