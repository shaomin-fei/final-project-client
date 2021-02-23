//@ts-check
import React, { useReducer,useEffect } from "react";
import { Layout,message } from "antd";

import {ToolbarCmdContext,ToolbarCmdCallback,ExecuteParam} from "../../../common/data/realtime/tasks-common";
import RealTimeContent,{startTask as startShow,stopTask as stopShow, getImportantParams,setImportantParamToToolbar,resetChart,resizeChart,setData as setGraphicData} from "./content/realtime-content";
import ParamsList,{getParams} from "../../../components/params-list/params-list";
import {ExecuteTask} from "../../../common/data/realtime/tasks-common";
import LeftTree from "../../../components/left-tree/left-tree";
import "./fixed.css";
//@ts-ignore
import FixWorker from "../webworkers/fixed/fixedtask.worker";
import WorkerParam from "../../../config/worker-param";
import CmdDefineEnum from '../../../workers/cmd-define'
import {serverWSAddr} from "../../../config/api-config"
import {parseData, DataTypeEnum} from "../../../common/data/realtime/parse-data";
import PlayAudio from "../../../common/utils/playsound";

//import {AudioData,WaveFormate,parseWaveFormate,parseAudio} from "../../../common/data/realtime/audio";

const {  Sider, Content } = Layout;
const playAudio=new PlayAudio();
let isTaskStopped=true;
const iniSiderbarState={
  left:false,
  right:false,
}
let currentWorker=null;
let isPlayAudio=true;

const toolbarCmdCallback=new ToolbarCmdCallback();
toolbarCmdCallback.startTaskCallback=startTask;
function startTask(){
  //todo get params first;
  const param=new ExecuteParam();
  param.url=serverWSAddr; //leftTree.getSelectedUrl();
  const currentSelectedInfo=leftTree.getSelectedStationInfo();
  if(!currentSelectedInfo){
    message.error("can not get selected information");
    return;
  }
  param.deviceId=currentSelectedInfo.currentDeviceId;
  param.stationId=currentSelectedInfo.currentStationId;
  param.taskName=currentSelectedInfo.currentTask;
  if(!param.url){
    message.error("can not get url of the selected station");
    return;
  }
  const importantParam=getImportantParams();
  if(importantParam.errorInfo){
    message.error(importantParam.errorInfo);
    return;
  }
  const temp=getParams();
  if(!temp){
    message.error("can not get task params");
    return;
  }
  const indexOfCenterFreq=temp.Params.Param.findIndex(param=>{
    return param.Name[0]==="CenterFreq";
  });
  if(indexOfCenterFreq>=0){
    temp.Params.Param[indexOfCenterFreq].Value[0]=(importantParam.currentCenterFreq);
  }
  const key=param.stationId+"+"+param.deviceId+"+"+param.taskName;
  localStorage.setItem(key,JSON.stringify(temp));
  param.params=convertParamToString(temp);
  
  stopTask();
  resetChart();
  currentWorker=new FixWorker();
  currentWorker.onmessage=workerMessage;
  currentWorker.postMessage(new WorkerParam(CmdDefineEnum.cmdStartRealtime,param));
  isTaskStopped=false;
  startShow();
  
}

function convertParamToString(params){
  let strParam="";
  params.Params.Param.forEach(par=>{
    if(strParam!==""){
      strParam+=";";
    }
    strParam+=par.Name+"="+par.Value;
  })
  return strParam;
}
toolbarCmdCallback.stopTaskCallback=stopTask;
window.addEventListener("close",()=>{
  stopTask();

});
toolbarCmdCallback.setImportantParam=(param)=>{
  setImportantParamToToolbar(param);
}
toolbarCmdCallback.isPlayAudioChanged=(playAudioState)=>{
  isPlayAudio=playAudioState;
  if(!isPlayAudio){
    playAudio.stop();
  }
  
}
function stopTask(){
  if(isTaskStopped){
    return;
  }
  isTaskStopped=true;
  stopShow();
  if(currentWorker){
    currentWorker.postMessage(new WorkerParam(CmdDefineEnum.cmdStopRealtime,"stop task"));
    setTimeout(() => {
      currentWorker&&currentWorker.terminate();
    currentWorker=null;
    playAudio.stop();
    
    }, 0);
    
  }
 
  
}
/**
 * @Date: 2020-08-27 07:57:34
 * @Description: 
 * @param {Int8Array} data
 * @return {void} 
 */
function handleRealTaskData(data){
  if(isTaskStopped){
    return;
  }
  const reslut=parseData(data,1,false);
  if(reslut&&reslut.has(DataTypeEnum.Audio)){
    if(!isPlayAudio){
      return;
    }
    /**
     * @type {import("../../../common/data/realtime/audio").AudioData}
     */
    const audio=reslut.get(DataTypeEnum.Audio);
    if(!playAudio.hasInit){
      playAudio.initPlay(audio.wf);
      
    }
    playAudio.addData(audio.audioData);
    reslut.delete(DataTypeEnum.Audio);
  }
  if(reslut&&reslut.size>0){
   
    setGraphicData(reslut);
  }
}
function workerMessage(e){
/**
 * @type {WorkerParam}
 */
//console.log("xxx got int8 array",e);
 if(e.data instanceof ArrayBuffer||e.data instanceof Int8Array){
   //console.log("xxx got int8 array",e);
   //debugger
   handleRealTaskData(e.data);
   return;
 }
  const data=e.data;
  switch(data.cmd){
    case CmdDefineEnum.cmdDataCome:{
      //todo
      return;
    }
    case CmdDefineEnum.cmdSocketError:{
      message.error("error occured:"+data.arg);
      return;
    }
    case CmdDefineEnum.cmdStartTaskSucceed:{
      message.info("task started successful");
      return ;
    }
    case CmdDefineEnum.cmdStopTaskSucceed:{
      message.info(data.arg);
      return;
    }
    default:
      return;
  }
}
/**
 * @type {RealTimeContent}
 */

/**
 * @type {LeftTree}
 */
let leftTree=null;
const FixedTask = (props) => {
  
  const [stateCollapse, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "changeCollapseLeft":
          //stateCollapse.left = action.collapsed;
          return { ...state,left:action.collapsed };
        case "changeCollapseRight":
          return { ...state,right:action.collapsed };
        default:
          return state;
      }
    },
    iniSiderbarState
  );
 
  useEffect(()=>{
    return ()=>{
      stopTask();
    }
  },[]);
  function onCollapse(collapsed, type) {
    //@ts-ignore
    dispatch({
      type: type,
      collapsed: collapsed,
    });
    //resizeChart();
    setTimeout(() => {
      resizeChart(collapsed);
    }, 300);
    
  }

   const {executeInfo}=props.match.params;
   const taskInfo=ExecuteTask.create(executeInfo);

  return (
    <ToolbarCmdContext.Provider value={toolbarCmdCallback}>
    
      <Layout  className="execute_task_layout">
        {/* left tree */}

        <Sider
          className="left_sider"
          // @ts-ignore
          collapsible
          collapsedWidth={0}
          collapsed={stateCollapse.left}
          onCollapse={(collapsed) =>
            onCollapse(collapsed, "changeCollapseLeft")
          }
        >
          <LeftTree taskInfo={taskInfo} ref={left=>leftTree=left}/>
        </Sider>
        {/* center */}
        <Layout className="site-layout center_side">
          <Content className="site-layout-background">
            <RealTimeContent ></RealTimeContent>
          </Content>
        </Layout>
        {/* property */}
        <Sider className="right_sider"
          collapsible
          reverseArrow
          collapsedWidth={0}
          collapsed={stateCollapse.right}
          onCollapse={(collapsed)=> onCollapse(collapsed, "changeCollapseRight")}
        >
          <ParamsList taskInfo={taskInfo}/>
        </Sider>
      </Layout>
    </ToolbarCmdContext.Provider>
  );
};
export default FixedTask;
