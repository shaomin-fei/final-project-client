/*
 * @Author: shaomin fei
 * @Date: 2020-07-28 14:15:40
 * @LastEditTime: 2020-08-18 14:13:28
 * @LastEditors: shaomin fei
 * @Description:
 * @FilePath: \rms-ui\src\index.js
 */

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux"
import { Switch, Route, HashRouter } from "react-router-dom";




import "./index.css";
import { MainPageInfo,Routers } from "./config/config";
import WorkersManage from "./workers/workers-manage";
import store from "./redux/store";

const workManage=new WorkersManage();
//workManage.start();
window.addEventListener("close",()=>{
  workManage.stop();
});
window.addEventListener("load",()=>{
  
});
const render=()=>{
  ReactDOM.render(
  //don't use strictMode,or the antd will report warning:findDOMNode is deprecated in StrictMode.  xx
  <Provider store={store}>
    <HashRouter>
      <Switch>
        {
        Routers.map((router,index) => {
          // exact={true}要求必须完全匹配，cockpit/ss将认为匹配不成功，否则会匹配到cockpit 页面
          return (
            <Route  key={index} path={router.path} exact={true} component={router.component} ></Route>
          );
        })
        }
        {/* <Route path="/notfound" component={PageNotFound}> </Route> */}
      </Switch>
    </HashRouter>
    {/* <MainPageInfo.mainPage/> */}
  </Provider>,
  document.getElementById("root")
)
};
render();
workManage.start();
store.subscribe(render);

