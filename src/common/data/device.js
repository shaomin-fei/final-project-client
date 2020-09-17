/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-16 13:24:41
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-09 15:28:40
 */

import {RunningTask,TaskInfo} from "./task";

export const DeviceStatusEnum={
    WORKING:"working",
    IDLE:"idle",
    FAULT:"warning",
    SHUTDOWN:"shutdown"
}
export class DeviceInfo{
    stationId="";
    id="";
    name="";
    url="";
    status=DeviceStatusEnum.WORKING;
    /**
     * the key is the ability name, the value is the param that the task needs when it runs.
     * @type {Array<TaskInfo>}
     */
    abilities=[];

    /**
     * @typedef {imort ("./task")} RunningTask
     * @type {Array<RunningTask>} 
     */
    runningTasks=[];
}

