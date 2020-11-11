import React, { useEffect, useState } from 'react'
import { useAudioContext } from './AudioContext';

export const AudioContextOutput = () => {

  const { mediaSourceRef, audioContext } = useAudioContext();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!registered && mediaSourceRef && mediaSourceRef.current && audioContext) {
      mediaSourceRef.current.connect(audioContext.destination);
      setRegistered(true);
    }
  }, [audioContext, registered, mediaSourceRef]);

  return (
    <></>
  );
}
