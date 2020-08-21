
//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 12:02:32
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-20 14:15:57
 */
//import WorkerStation from './station-worker/station.worker';

import pubsub from "pubsub-js";
//@ts-ignore
import WorkerStation from './station-worker/station.worker';
import APIConfigEnum from '../config/api-config';
import CmdDefineEnum from './cmd-define';
import WorkerParam from "../config/worker-param"

import store from "../redux/store"

import {getTree,currentTaskChange} from "../redux/actions/StationAction"

class WorkInfo{
    worker=null;
    name="";
    //message from worker
    onmessage=(e)=>{

    };
    constructor(worker,name){
        this.worker=worker;
        this.name=name;
        
    }
}
class StationWorkInfo extends WorkInfo{
    static tree=null;
    static currentTasks=null;
    static signalByReason=null;
    constructor(worker,name){
        super(worker,name);
        worker.onmessage=this.onmessage;
        
    }
    /**
     * 
     * @param {MessageEvent} e 
     */
    onmessage=(e)=>{
        //console.log("receive",e);
        const {data}=e;
        switch(data.cmd){
            case CmdDefineEnum.cmdGetTree:{
                const tree=JSON.parse(data.arg);
                StationWorkInfo.tree=tree;
                const postTreeInfo=(dispatch, getState, extraArgument)=>{
                    //console.log("extraArgument",extraArgument);
                    dispatch(getTree(tree));
                }
                pubsub.publish(data.cmd,tree);
                store&&store.dispatch(postTreeInfo);
                break;
            }
            case CmdDefineEnum.cmdCurrentTaskChange:{
                ///console.log("current task change",data.arg);
                pubsub.publish(data.cmd,data.arg);
                const tasks=JSON.parse(data.arg);
                StationWorkInfo.currentTasks=tasks;
                //debugger
                const taskChange=(dispatch)=>{
                    dispatch(currentTaskChange(tasks));
                }
                store&&store.dispatch(taskChange);
                break;
            }
            case CmdDefineEnum.cmdGetSignalByReason:{
                const singal=JSON.parse(data.arg);
                StationWorkInfo.signalByReason=singal;
                pubsub.publish(data.cmd,singal);
                break;
            }
            default:
                break;
        }

    }
}
export default class WorkersManage{
    static instance=null;
    /**
     * @type {Array<WorkInfo>}
     */
    workers=[];
    constructor(){
       
        if(!WorkersManage.instance){
            WorkersManage.instance=this;
        }
        return WorkersManage.instance;
    }
    start(){
        this.initWorkers();
    }
    async initWorkers(){
        // const path="workers/111/";
        // const tt=new Worker("tt.js");
        // const worker=new StationWorkInfo(new Worker(path+"station.worker.js"),"station-worker") ;
        const worker=new StationWorkInfo(new WorkerStation(),"station-worker") ;
        this.workers.push(worker);
        worker.worker.postMessage( new WorkerParam(CmdDefineEnum.cmdIniWorker,null
        //     {
        //     httpUrl:APIConfigEnum.getStations,
        //     wsUrl:APIConfigEnum.stationChange,
        // }
            ));
           
    }
    stop(){
        this.workers.forEach((worker)=>{
            worker.worker.postMessage(new WorkerParam(CmdDefineEnum.cmdStop,null));
            worker.worker.terminate();
        });
    }
}
export function getCurrentTree(){
    return StationWorkInfo.tree;
}
export function getCurrentTasks(){
    return StationWorkInfo.currentTasks;
}
export function getSingalByReason(){
    return StationWorkInfo.signalByReason;
}