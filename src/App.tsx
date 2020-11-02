import React, { useContext, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import VolumeControl from './VolumeControl';
import { AudioContextProvider } from './AudioContext';
import AudioSourceControl from './AudioSourceControl';

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>
      <AudioContextProvider>
        <AudioSourceControl src="./assets/guitar.mp3" controls loop />
        <VolumeControl />
      </AudioContextProvider>
    </div>
  );
}

export default App;
