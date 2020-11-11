import React, { useEffect, useState, useCallback, ChangeEvent, useRef } from 'react';
import { useAudioContext } from './AudioContext';

interface VolumeControlProps {
  min?: number;
  max?: number;
  step?: number;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  min = 0,
  max = 100,
  step = 1
}) => {
  const { mediaSourceRef, audioContext } = useAudioContext();
  const [registered, setRegistered] = useState(false);

  const gainNode = useRef<GainNode | undefined>(undefined);

  useEffect(() => {
    if (!registered && mediaSourceRef && mediaSourceRef.current && audioContext) {
      gainNode.current = audioContext.createGain();
      mediaSourceRef.current.connect(gainNode.current);
      setRegistered(true);
    }
  }, [audioContext, registered, mediaSourceRef]);

  const onVolumeChange =
    (e: ChangeEvent<HTMLInputElement>) => {
      console.log('volume channged', parseFloat(e.target.value));
      if (gainNode.current) {
        gainNode.current.gain.value = parseFloat(e.target.value);
      }
    };

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={onVolumeChange}
      />
    </>
  );
};

export default VolumeControl;
