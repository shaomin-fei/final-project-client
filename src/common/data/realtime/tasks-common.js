/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-24 12:54:23
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-31 18:42:10
 */
import React from "react";

export class ExecuteTask{
    type="executeTask";//"watchTask"
    stationId="";
    deviceId="";
    tasktype="";
    taskId="";
    /**
     * @Date: 2020-08-24 10:15:07
     * @Description: 
     * @param {string}  params
     * type=watchTask&&stationid=xx&&deviceid=xxx&&tasktype=xxx&&taskid=xxx
     * @return {ExecuteTask} 
     */
    static create(params){
        const task=new ExecuteTask();
        const szTaskInfo=params.split("&&");
        szTaskInfo&&szTaskInfo.forEach(info=>{
            const szTemp=info.split("=");
            if(szTemp&&szTemp.length===2){
                if(szTemp[0]==="type"){
                    task.type=szTemp[1];
                }else if(szTemp[0]==="stationid"){
                    task.stationId=szTemp[1];
                }else if(szTemp[0]==="deviceid"){
                    task.deviceId=szTemp[1];
                }else if(szTemp[0]==="tasktype"){
                    task.tasktype=szTemp[1];
                }else if(szTemp[0]==="taskid"){
                    task.taskId=szTemp[1];
                }
            }
        })
        return task;
    }
}

export class ToolbarCmdCallback{
    startTaskCallback=null;
    stopTaskCallback=null;
    setImportantParam=null;
    isPlayAudioChanged=null;
}
export const ToolbarCmdContext=React.createContext(new ToolbarCmdCallback());

export class ExecuteResponse{
    success=true;
    info="";
    constructor(success,info){
        this.success=success;
        this.info=info;
    }
    static succeed(info){
        return new ExecuteResponse(true,info);
    }
    static error(info){
        return new ExecuteResponse(false,info);
    }
}
export class ExecuteParam{
    url="ws://localhost:4009";
    stationId="";
    deviceId="";
    taskName="";
    params="";
    taskid="";//receive from server
}

export class TaskParamFromDevice{

    Advanced=[];
    DefaultValue=[];
    Helper=[];
    IsSwitch=[];//True,/False
    MaxValue=[];
    MinValue=[];
    Name=[];
    SelectOnly=[];//True,False
    ShowName=[];
    Type=[];
    Unit=[];
    Value=[];
    EnumString=[];

}
export class Params{
    /**
     * @type {Array<TaskParamFromDevice>}
     */
    Param=[];
}
export class TaskParamListFromDevice{
    /**
     * @type {Params}
     */
    Params=null;
}
