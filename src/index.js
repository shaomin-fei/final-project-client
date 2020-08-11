/*
 * @Author: shaomin fei
 * @Date: 2020-07-28 14:15:40
 * @LastEditTime: 2020-08-10 11:35:20
 * @LastEditors: shaomin fei
 * @Description: 
 * @FilePath: \rms-ui\src\index.js
 */ 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

import {MainPageInfo} from './config/config'



ReactDOM.render(
  <React.StrictMode>
    {/* <div id="test" style={{width:"100px",height:"100px",border:"1px solid red"}}>sfsdf</div> */}
    <MainPageInfo.mainPage />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
