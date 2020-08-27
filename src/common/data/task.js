/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-16 14:05:48
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-24 09:31:24
 */
export const TaskType={
    auto:"Auto",
    realtime:"RealTime",
    schedule:"Schedule",
}
export class RunningTask{
    stationId="";
    deviceId="";
    id="";
    name="";
    param="";
    executeUser="";
    priority=1;
    type="realtime";//realtime,auto
    startTime=Date.now;
}
export class TaskInfo{
    name="";
    param="";
}

