/*
 * @Author: shaomin fei
 * @Date: 2020-07-28 14:15:40
 * @LastEditTime: 2020-07-28 16:53:16
 * @LastEditors: shaomin fei
 * @Description: 
 * @FilePath: \rms-ui\src\App.js
 */ 
import React from 'react';
import logo from './logo.svg';
import './App.css';
//import Spectrum from './components/spectrum/temple';




import {WrpperSpectrumTest} from './components/spectrum/testspectrum';

// const spectrumProps={
//   yData:[1,2,3,5,6,7],
//   xData:List([1,2,3,5,6,7]),
//   xTitle:"88MHz-108MHz",
//   yTitle:"dBuv",
//   yMin:0,
//   yMax:110
// }

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <WrpperSpectrumTest ></WrpperSpectrumTest>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
