
//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 12:02:32
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-31 13:22:41
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
import Axios from "axios";
import XML2Json from "xml2js";

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
                
                const tasks=JSON.parse(data.arg);
                StationWorkInfo.currentTasks=tasks;
                pubsub.publish(data.cmd,tasks);
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
        worker.worker.postMessage( new WorkerParam(CmdDefineEnum.cmdIniWorker,"i'm worker manager"
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
/**
 * @Date: 2020-08-25 23:34:44
 * @Description: 
 * @typedef {import("../common/data/center").default} CenterInfo
 * 
 * @return {CenterInfo} 
 */
export function getCurrentTree(){
    return StationWorkInfo.tree;
}
export function getCurrentTasks(){
    return StationWorkInfo.currentTasks;
}
export function getSingalByReason(){
    return StationWorkInfo.signalByReason;
}
export async function getTaskParam({stationid,deviceid,taskname},contentCallback){

    try{
        const res= await Axios.get(APIConfigEnum.getTaskParams,{
            params:{
                stationid,
                deviceid,
                taskname
            }
        });
        let data=res.data;
        const xml2json=new XML2Json.Parser();
        //data='<Params Type="0"><Param><Name>CenterFreq</Name><ShowName>Frequency</ShowName><MaxValue>6000.000000</MaxValue><MinValue>20.000000</MinValue><Type>Number</Type><Unit>MHz</Unit><Advanced>False</Advanced><SelectOnly>False</SelectOnly><IsSwitch>False</IsSwitch><DefaultValue>101.7</DefaultValue><Value>101.7</Value><Helper>中心频率设置,单位:MHz</Helper></Param></Params>';
        xml2json.parseString(data,(err, result)=>{
            console.log("get params",result);
            contentCallback(result,res.data,err);
            if(err){
                console.log("convert to json error: ",err);
            }
        });
       
    }
    catch(error){
        contentCallback("","",error)
    }
    
}