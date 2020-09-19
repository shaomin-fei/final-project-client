//@ts-check
import React,{useEffect,useState} from "react";
import {message} from "antd";

import {getTaskParam} from "../../workers/workers-manage";
import {ExecuteTask,
  TaskParamListFromDevice,
  TaskParamFromDevice,
  ToolbarCmdContext,
  ToolbarCmdCallback
} from "../../common/data/realtime/tasks-common"

import "./param-list.css"
import { useContext } from "react";
/**
 * @Date: 2020-08-30 11:51:53
 * @Description: 
 * @param {ExecuteTask}  taskInfo
 * @return {void} 
 */
function setParmFrom(taskInfo){
    if(!taskInfo){
        return;
    }
    const {stationId,deviceId,tasktype}=taskInfo;
    const key=stationId+"+"+deviceId+"+"+tasktype;
    let strContent=localStorage.getItem(key);
    let content=null;
    if(strContent){
        //change contents of list
        content=JSON.parse(strContent)
        setParams(content);
    }else{
        //todo go to get the param from server and store it
        let error="";
        getTaskParam({stationid:stationId,deviceid:deviceId,taskname:tasktype},(params,originalString,e)=>{
          error=e;
          content=params;        
        });
        let detectCount=0;
        const interval=setInterval(()=>{
          detectCount++;
          if(error){
            message.error("get param error");
            console.log("get param error",error);
            clearInterval(interval);
            return;
          }
          if(!content){
            if(detectCount===60){
              message.error("get param time out");
              clearInterval(interval);
              return;
            }
            return;
          }
          clearInterval(interval);
          setParams(content);
          localStorage.setItem(key,JSON.stringify(content));;
        },50);
    }
    
  }
/**
 * @Date: 2020-09-09 23:39:44
 * @Description: 
 * 
 * @return {TaskParamListFromDevice} 
 */  
export function getParams(){
    return currentParam;
}
/**
 * @Date: 2020-08-31 11:15:39
 * @Description: 
 * @param {TaskParamListFromDevice} content
 * @return 
 */
export function setParams(content){
  content.Params.Param.forEach(par=>{
    par.Visible=true;
  })
  const indexOfCenterFreq=content.Params.Param.findIndex(param=>{
    return param.Name[0]==="CenterFreq";
  });
  if(indexOfCenterFreq>=0){
    if(toolbarCmdContext.setImportantParam!=null){
      content.Params.Param[indexOfCenterFreq].Visible=false;
       toolbarCmdContext.setImportantParam(content.Params.Param[indexOfCenterFreq]);
    }
    //content.Params.Param.splice(indexOfCenterFreq,1);
  }
  
   setParamsList(content);
}
const initParamList=new TaskParamListFromDevice();
/**
 * @type {function}
 */
let setParamsList=null;
/**
 * @type {ToolbarCmdCallback}
 */
let toolbarCmdContext=null;
/**
 * @type {TaskParamListFromDevice}
 */
let currentParam=null;
const ParamsList =function(props){
    toolbarCmdContext=useContext(ToolbarCmdContext);
    const [paramList,setParamFunc]=useState(initParamList);
    setParamsList=setParamFunc;
    currentParam=paramList;
    useEffect(()=>{
        const {taskInfo}=props;
        if(!taskInfo){
            return null;
        }
        setParmFrom(taskInfo);
    },[]); 
    if(!paramList){
      return null;
    }
    if(!paramList.Params||paramList.Params.Param.length===0){
      return null;
    }
    const showParams=paramList.Params.Param.filter(param=>{
      return param.Visible;
    });
    return (
      <>
      <div style={{color:"wheat",fontWeight:"bold",textAlign:"center",
      border:"1px solid #ccc",marginLeft:"2px",padding:"2px"}}>Advance Params</div>
        <div className="paramList_container">
          
          <ul>
          {
          showParams.map(element => {
            return (<li key={element.Name[0]}>
          <label className="param_name">{element.Name[0]}</label>
           {
             getInputJSX(element)
           }
          </li>)
          })
          }
          </ul>
        </div>
        </>
    );
}
/**
 * @Date: 2020-08-31 11:54:45
 * @Description: 
 * @param {TaskParamFromDevice} element
 * @return {JSX.Element} 
 */
function getInputJSX(element){

  if(element.Type[0]==="Enum"){
    return <select className="input_shape" style={{height:"20px"}}>
      {
          getEnumStringJSX(element.EnumString[0])
      }
    </select>
  }else if(element.Type[0]==="Number"){
    return (
    <input  onInput={e=>checkNum(e.target)} className="input_shape" 
    onBlur={e=>judgeMaxMin(e.target,element)} 
   
    >
    </input>
    )
  }
  return null;
}
function judgeMaxMin(obj,element){
  if(element.MaxValue.length>0){
    if(parseFloat(obj.value)>parseFloat(element.MaxValue[0])){
      obj.value=element.MaxValue[0];
    }
  }
  if(element.MinValue.length>0){
    if(parseFloat(obj.value)<parseFloat(element.MinValue[0])){
      obj.value=element.MinValue[0];
    }
  }
}
function checkNum(obj){
 //检查是否是非数字值
 if (isNaN(obj.value)) {
   /**
    * @type {string}
    */
  let strTemp=obj.value;
 
  obj.value=strTemp.substring(0,strTemp.length-1)
  return;
}
if (obj.value != null) {
  //检查小数点后是否对于两位
  // if (obj.value.toString().split(".").length > 1 && obj.value.toString().split(".")[1].length > 3) {
  //     alert("only three number allowed after dot！");
  //     obj.value = "";
  //     return;
  // }
  
}
}
/**
 * @Date: 2020-08-31 12:05:40
 * @Description: 
 * @param {string} strContent
 * @return {JSX.Element} 
 */
function getEnumStringJSX(strContent){
  const szEnumString= strContent.split("|");
  return (
    <>
    {
      szEnumString.map((str,index)=>{
        return <option key={index} value={str}>{str}</option>
      })
    }
     </>
     )
  

}
export default ParamsList;