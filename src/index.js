/*
 * @Author: shaomin fei
 * @Date: 2020-07-28 14:15:40
 * @LastEditTime: 2020-08-12 23:09:58
 * @LastEditors: shaomin fei
 * @Description:
 * @FilePath: \rms-ui\src\index.js
 */

import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, HashRouter } from "react-router-dom";

// import App from './App';
import * as serviceWorker from "./serviceWorker";


import "./index.css";
import { MainPageInfo,Routers } from "./config/config";
import PageNotFound from "./pages/not-found/not-found"

ReactDOM.render(
  <React.StrictMode>
    
    <HashRouter>
      <Switch>
        {
        Routers.map((router,index) => {
          // exact={true}要求必须完全匹配，cockpit/ss将认为匹配不成功，否则会匹配到cockpit 页面
          return (
            <Route key={index} path={router.path} exact={true} component={router.component}></Route>
          );
        })
        }
        {/* <Route path="/notfound" component={PageNotFound}> </Route> */}
      </Switch>
    </HashRouter>
    {/* <MainPageInfo.mainPage/> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
