
//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 12:02:32
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 23:41:01
 */
//import WorkerStation from './station-worker/station.worker';
//@ts-ignore
import WorkerStation from './station-worker/station.worker';
import APIConfigEnum from '../config/api-config';
import CmdDefineEnum from './cmd-define';
import WorkerParam from "../config/worker-param"

import store from "../redux/store"

import {getTree} from "../redux/actions/StationAction"

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
                
                const postTreeInfo=(dispatch, getState, extraArgument)=>{
                    console.log("extraArgument",extraArgument);
                    dispatch(getTree(JSON.parse(data.arg)));
                }
                store&&store.dispatch(postTreeInfo);
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
        worker.worker.postMessage( new WorkerParam(CmdDefineEnum.cmdIniWorker,
            {
            httpUrl:APIConfigEnum.getStations,
            wsUrl:APIConfigEnum.stationChange,
        }
            ));
           
    }
    stop(){
        this.workers.forEach((worker)=>{
            worker.worker.terminate();
        });
    }
}