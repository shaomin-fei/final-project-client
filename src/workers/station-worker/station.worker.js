
//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 11:34:24
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-26 15:16:50
 */
let temp=0;
temp=temp+1;
console.log("load worker",temp);
/**
 * @Date: 2020-08-17 16:07:56
 * @Description: 
 * @param {object} e 
 * @param {string} e.cmd
 * @param {object} e.arg
 * @param {string} e.arg.httpUrl
 * @param {string} e.arg.wsUrl
 * @return {void} 
 */
import axios from 'axios';
import CmdDefineEnum from '../cmd-define'
import WorkerParam from "../../config/worker-param"
import CenterInfo from "../../common/data/center";
import { DeviceStatusEnum } from '../../common/data/device';
import { TaskType, TaskInfo } from '../../common/data/task';
import APIConfigEnum from "../../config/api-config";


let stationString="";
let currentTaskStatic="";
let signalByReason="";
let interval=null;
const getStations=async (url)=>{
    try{
        const result= await axios.get(url);
        const centerTree=result.data;
        //console.log("get tree",centerTree);
        if(!centerTree){
            return;
        }
        const strNowTree=JSON.stringify(centerTree);
        //console.log("get",strNowTree);
        if(strNowTree!==stationString){
            stationString=strNowTree;
            //console.log("post");
            if(!signalByReason){
                //the first time to get the signal,must after the stations get value;
                getSignalByReason(APIConfigEnum.getSignalStaticByReason);
            }
           
            //@ts-ignore
            postMessage(new WorkerParam(CmdDefineEnum.cmdGetTree,strNowTree));
            let tasks=staticCurrentTask(centerTree);
            //debugger
            if(tasks!==currentTaskStatic)
            {
                currentTaskStatic=tasks;
                //console.log("find current task change",currentTaskStatic);
                  //@ts-ignore
                postMessage(new WorkerParam(CmdDefineEnum.cmdCurrentTaskChange,currentTaskStatic));
            }
        }
        //console.log("getStations",result);
        
    }catch(e){
        console.log(e);
    }
  
}
/**
 * @Date: 2020-08-18 11:46:59
 * @Description: 
 * @param {CenterInfo}  tree
 * @return {string} 
 */
function staticCurrentTask(tree){
    //debugger
    let result="";

    const stations=tree.stations;
    let autoCount=0,fixCount=0,scanCount=0;
    if(!stations){
        return result;
    }
    stations.forEach(station=>{
        const devices=station.devices;
        if(devices){
            devices.forEach(dev=>{
                //debugger
                if(dev.status===DeviceStatusEnum.WORKING){
                    //debugger
                    const runningTasks=dev.runningTasks;
                    runningTasks.forEach(task=>{
                        // be careful,only auto task used task.type to compare,others use task.name
                        if(task.type===TaskType.auto){
                            autoCount++;
                        }else if(task.name==="FIXFQ"){
                            fixCount++;
                        }else if(task.name==="Scan"){
                            scanCount++;
                        }
                    });
                }
            })
        }
    });
    // const mapTasks=new Map()
    // mapTasks.set(TaskType.auto,autoCount);
    // mapTasks.set(TaskType.fixed,fixCount);
    // mapTasks.set(TaskType.scan,scanCount);
    // result=JSON.stringify(mapTasks);
    const tasks={
        Auto:autoCount,
        Fixed:fixCount,
        Scan:scanCount,
    }
    result=JSON.stringify(tasks);
    return result;
}
async function  getSignalByReason(url){
    // if we don't get tree,the signal doesn't have any mean.
    if(!stationString){
        return;
    }
    try{
        const res=await axios.get(url);
        const result=res.data;
        const strSignal=JSON.stringify(result);
        if(strSignal!==signalByReason){
            signalByReason=strSignal;
            //@ts-ignore
            postMessage(new WorkerParam(CmdDefineEnum.cmdGetSignalByReason,signalByReason));
        }
    }catch(e){
        console.log(e);
    }
    
}
onmessage=(e)=>{
     //console.log(e.data);
     switch(e.data.cmd){
         case CmdDefineEnum.cmdIniWorker:{
             //const {httpUrl,wsUrl}=e.data.arg;
            //  get stations at first to initialize,then set timer
            const httpUrl=APIConfigEnum.getStations;
             getStations(httpUrl);
             
             interval=setInterval(() => {
                getStations(httpUrl);
                getSignalByReason(APIConfigEnum.getSignalStaticByReason);
             }, 3000);
             break;
         }
         case CmdDefineEnum.cmdStop:{
             clearInterval(interval);
             break;
         }
         default:
             break;
     }
     //postMessage({msg:"return msg"});
    
 }