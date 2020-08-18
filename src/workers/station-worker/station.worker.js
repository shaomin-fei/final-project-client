/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 11:34:24
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 22:39:34
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


let stationString="";
const getStations=async (url)=>{
    try{
        const result= await axios.get(url);
        const centerTree=result.data;
        const strNowTree=JSON.stringify(centerTree);
        console.log("get",strNowTree);
        if(strNowTree!==stationString){
            stationString=strNowTree;
            console.log("post");
            postMessage(new WorkerParam(CmdDefineEnum.cmdGetTree,strNowTree));
        }
        //console.log("getStations",result);
        
    }catch(e){
        console.log(e);
    }
  
}
onmessage=(e)=>{
     console.log(e.data);
     switch(e.data.cmd){
         case CmdDefineEnum.cmdIniWorker:{
             const {httpUrl,wsUrl}=e.data.arg;
             getStations(httpUrl);
             break;
         }
         default:
             break;
     }
     //postMessage({msg:"return msg"});
    
 }