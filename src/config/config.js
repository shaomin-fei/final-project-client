/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 09:08:35
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-01 11:22:46
 */

 import React from "react";
 import {Redirect} from 'react-router-dom';

 import {RouterEnum}  from './define';
 import CockPit from '../pages/cockpit/cockpit';
 import PageNotFound from '../pages/not-found/not-found';
 import RealTimeTask from '../pages/realtime-task/realtime-task';
 import SignalManage from '../pages/signal-manage/signal-manage';
 import DataManage from '../pages/data-manage/data-manage';
 import ExecuteRealtimeTaskIndex from "../pages/tasks/index";
 //import StationManage from '@/pages/station-manage/station-manage';
 import StationManage from '../pages/station-manage/station-manage';
 export const MainPageInfo={
    mainPage:CockPit,
 }


 class RouterInfo{
    constructor(path,component,exact=true){
      this.path=path;//"./";
      this.component=component;//CockPit;
      this.exact=exact;
    }
    
 }
 export const Routers=[
    new RouterInfo(RouterEnum.Home,CockPit),
   //  create a react componnet which redirect to /cockpit when user inputs /
    new RouterInfo("/",()=>(<Redirect to="/cockpit"/>)),
    new RouterInfo(RouterEnum.RealTimeTask,RealTimeTask),
    new  RouterInfo(RouterEnum.SignalManage,SignalManage),
    new  RouterInfo(RouterEnum.DataManage,DataManage),
    new  RouterInfo(RouterEnum.StationManage,StationManage,false),
    new  RouterInfo(RouterEnum.ExecuteRealtimeTask,ExecuteRealtimeTaskIndex,false),


    new RouterInfo("*",PageNotFound),
 ]