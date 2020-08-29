//@ts-check
import React, { useReducer } from "react";
import { Layout,message } from "antd";

import {ToolbarCmdContext,ToolbarCmdCallback,ExecuteParam} from "../tasks-common";
import RealTimeContent,{resetChart,resizeChart,setData as setGraphicData} from "./content/realtime-content";
import ParamsList,{getParams,changeParams} from "../../../components/params-list/params-list";
import {ExecuteTask} from "../tasks-common";
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

const { Header, Sider, Content } = Layout;
const playAudio=new PlayAudio();
let isTaskStopped=true;
const iniSiderbarState={
  left:false,
  right:false,
}
let currentWorker=null;
function treeSelectedChange({stationid,deviceid,taskname}){
  changeParams({stationid,deviceid,taskname});
}
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
  param.params=getParams();
  if(!param.params){
    message.error("can not get task params");
    return;
  }
  stopTask();
  resetChart();
  currentWorker=new FixWorker();
  currentWorker.onmessage=workerMessage;
  currentWorker.postMessage(new WorkerParam(CmdDefineEnum.cmdStartRealtime,param));
  isTaskStopped=false;
  console.log("start");
}
toolbarCmdCallback.stopTaskCallback=stopTask;
window.onclose=()=>{
  stopTask();

}
function stopTask(){

  isTaskStopped=true;
  if(currentWorker){
    currentWorker.postMessage(new WorkerParam(CmdDefineEnum.cmdStopRealtime,"stop task"));
    setTimeout(() => {
      currentWorker&&currentWorker.terminate();
    currentWorker=null;
    playAudio.stop();
    }, 500);
    
  }
 
  console.log("stop");
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
 
  // useEffect(()=>{

  // },[stateCollapse]);
  function onCollapse(collapsed, type) {
    //@ts-ignore
    dispatch({
      type: type,
      collapsed: collapsed,
    });
    //resizeChart();
    setTimeout(() => {
      resizeChart();
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
          <LeftTree taskInfo={taskInfo} ref={left=>leftTree=left} treeSelectedChange={treeSelectedChange}/>
        </Sider>
        {/* center */}
        <Layout className="site-layout">
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
          <ParamsList />
        </Sider>
      </Layout>
    </ToolbarCmdContext.Provider>
  );
};
export default FixedTask;
