import React from 'react';
import './App.css';
import VolumeControl from './VolumeControl';
import { AudioContextProvider } from './AudioContext';
import AudioSourceControl from './AudioSourceControl';
import { AudioContextOutput } from './AudioContextOutput';

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>
      <AudioContextProvider>
        <AudioSourceControl src="./assets/guitar.mp3" controls loop />
        <VolumeControl />
        <AudioContextOutput />
      </AudioContextProvider>
    </div>
  );
}

export default App;
