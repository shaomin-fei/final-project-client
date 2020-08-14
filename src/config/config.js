/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 09:08:35
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-13 14:26:05
 */

 import React from "react";
 import {Redirect} from 'react-router-dom';

 import {RouterEnum}  from './define';
 import CockPit from '../pages/cockpit/cockpit';
 import PageNotFound from '../pages/not-found/not-found';
 import RealTimeTask from '../pages/realtime-task/realtime-task'
 export const MainPageInfo={
    mainPage:CockPit,
 }


 class RouterInfo{
    constructor(path,component){
      this.path=path;//"./";
      this.component=component;//CockPit;
    }
    
 }
 export const Routers=[
    new RouterInfo(RouterEnum.Home,CockPit),
   //  create a react componnet which redirect to /cockpit when user inputs /
    new RouterInfo("/",()=>(<Redirect to="/cockpit"/>)),
    new RouterInfo(RouterEnum.RealTimeTask,RealTimeTask),


    new RouterInfo("*",PageNotFound),
 ]