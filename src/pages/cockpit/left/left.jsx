/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 10:02:28
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-20 12:49:04
 */
import React from 'react';

import DailyMonitor from "./daily-monitor/DailyMonitor";
import Status from "./status/status";

const Left=function(props){
    console.log("left called");
    return (
    <>
    <Status/>
    <DailyMonitor/>
    </>
    );
}

export default Left;
