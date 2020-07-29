/*
 * @Author: shaomin fei
 * @Date: 2020-07-28 14:15:40
 * @LastEditTime: 2020-07-28 16:23:47
 * @LastEditors: shaomin fei
 * @Description: 
 * @FilePath: \rms-ui\src\index.js
 */ 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
