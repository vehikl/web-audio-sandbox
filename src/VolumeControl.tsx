import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
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
  const { register, audioContext } = useAudioContext();
  const [registered, setRegistered] = useState(false);

  const [gainNode, setGainNode] = useState<GainNode | undefined>(undefined);

  useEffect(() => {
    if (!registered && audioContext) {
      const gain = audioContext.createGain();
      register(gain);
      setGainNode(gain);
      setRegistered(true);
    }
  }, [register, audioContext, registered]);

  const onVolumeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (gainNode) {
        gainNode.gain.value = parseFloat(e.target.value);
      }
    },
    [gainNode]
  );

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
