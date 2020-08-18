/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-16 14:05:48
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 09:33:52
 */
class RunningTask{
    id="";
    name="";
    param="";
    executeUser="";
    priority=1;
    type="realtime";//realtime,auto
    startTime=Date.now;
}
class TaskInfo{
    name="";
    param="";
}
module.exports={
    RunningTask,
    TaskInfo,
}
