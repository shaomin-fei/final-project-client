//@ts-check
import React,{useMemo,useReducer,useEffect} from "react";
import { CloseOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { Select, TreeSelect, DatePicker, Button,message } from "antd";
import moment from 'moment';

import Utils from "../../common/utils/utils";
import "./signal-operation.css";
import CenterInfo from "../../common/data/center";

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;
const signalOption = [
  <Option key="All" value="All">
    All
  </Option>,
  <Option key="Legal" value="Legal">
    Legal
  </Option>,
  <Option key="Unknown" value="Unknown">
    Unknown
  </Option>,
  <Option key="Illegal" value="Illegal">
    Illegal
  </Option>,
];
/**
 * @type {CenterInfo}
 */
let stationTrees = null;
const dateFormat="YYYY-MM-DD HH:mm:ss";
export class SignalInfo {
  key="";  
  freq = "";
  type = "Legal";
  Lon="";
  Lat="";
  findTime = Utils.dateFormat(dateFormat, new Date());
  station = [];
  description = "";
}
function Reducer(preState,{type,data}){
    switch (type){
        case "stationTreeSelcChanged":
      return { ...preState, signalInfo: {...preState.signalInfo,station:data} };
      case "inputFreq":
          return {...preState,signalInfo:{...preState.signalInfo,freq:data}};
      case "inputDescription":{
          return {...preState,signalInfo:{...preState.signalInfo,description:data}}
      }
      case "inputLon":{
        return {...preState,signalInfo:{...preState.signalInfo,Lon:data}}
    }
    case "inputLat":{
        return {...preState,signalInfo:{...preState.signalInfo,Lat:data}}
    }
      case "updateSignal":{
          return {...preState,signalInfo:data};
      }
      case "addSignal":{
          return {...preState,signalInfo:data};
      }
      case "saveBtnLoading":{
        return {...preState,saveLoading:data};
      }
         default:
            return preState;
    }
}
const initState={
    
    signalInfo:new SignalInfo(),
    saveLoading:false,
    //stationTreeChange:[],

};
let currentSignal=null;
const SignalOperation = function (props) {
  const {cmd} =  props ;
   /**
   * @type {SignalInfo}
   */
  const signalInfo = props.signalInfo;
  currentSignal=signalInfo;

  stationTrees=props.centerInfo;
  /**
   * @type {[initState,React.Dispatch<{type,data}>]}
   */
  const [state,dispatch]= useReducer(Reducer,initState);
 
  let title = "Edit Signal";
  if (cmd === "add") {
    title = "Add Signal";
  }
  useEffect(()=>{

    console.log("signal-operation did mount");
  },[]);
  useEffect(()=>{
    console.log("signal-operation currentSignal change",cmd);
      if(cmd==="update"){
        dispatch({type:"updateSignal",data:currentSignal});
      }else{
        dispatch({type:"addSignal",data:new SignalInfo()});
      }
  },[currentSignal]);

  function handleInput(cmd,e){
     
      dispatch({type:cmd,data:e.target.value});
  }
  function onStationTreeSelcChange(value) {
    dispatch({ type: "stationTreeSelcChanged", data: value });
  }
  /**
 * @Date: 2020-09-14 18:54:18
 * @Description: 
 * @param {string} cmd "add" or "update" 
 * @param {SignalInfo} signalInfo
 * @return {void} 
 */
 function saveSignalInfo(cmd,signalInfo){
   if(!signalInfo.freq){
     message.info("Please input frequency");
     return;
   }
   if(!signalInfo.Lat){
    message.info("Please input Lat");
    return;
   }
   if(!signalInfo.Lon){
    message.info("Please input Lon");
    return;
   }
   if(!signalInfo.findTime){
    message.info("Please select findTime");
    return;
   }
   if(!signalInfo.station||signalInfo.station.length===0){
    message.info("Please select stations");
    return;
   }
   if(signalInfo.station.length===1&&signalInfo.station[0]===stationTrees.name){
     signalInfo.station=stationTrees.stations.map(sta=>{
       return sta.name;
     });
     
   }
  dispatch({type:"saveBtnLoading",data:true});
   props.saveSignalInfoCallback(cmd,signalInfo,(succeed,msg)=>{
      message.info(msg);
      dispatch({type:"saveBtnLoading",data:false});
   });
 }
  const treeData = useMemo(() => {
    //console.log("use memo call");
    if (
      stationTrees &&
      stationTrees.stations &&
      stationTrees.stations.length > 0
    ) {
      const data = [
        {
          title: stationTrees.name,
          value: stationTrees.name,
          key: stationTrees.name,
          children: stationTrees.stations.map((sta) => {
            return {
              title: sta.name,
              key: sta.name,
              value: sta.name,
            };
          }),
        },
      ];
      return data;
    } else {
      return null;
    }
  }, [stationTrees]);
  const tProps = {
    treeData,
    size: "middle",
    bordered: "false",
    value: state.signalInfo.station?state.signalInfo.station:[],
    onChange: onStationTreeSelcChange,
    treeCheckable: true,
    maxTagCount: 1,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    maxTagPlaceholder: () => {
      return <label>...</label>;
    },
    style: {
      width: "198px",
      height: "32px",
    },
  };
  return (
    <div className="signal_operation_form">
      <div className="header">
        <span>{title}</span>
        <CloseOutlined className="head_close" onClick={props.closeCallback} />
      </div>
      <div className="content">
        <table>
          <tbody>
            <tr>
              <td>Frequency:</td>
              <td>
                  <input type="number" value={state.signalInfo.freq}
                  max={108}
                  min={87} 
                  
                  style={{width:"196px",height:"32px",color:"black"}}
                  
                  onChange={e=>handleInput("inputFreq",e)}/>
              </td>
            </tr>
            <tr>
              <td>Type:</td>
              <td >
                  <span style={{border:"1px solid #ccc",display:"inline-block",height:"32px"}}>
                  <Select
                    bordered={false}
                  style={{
                     width: "194px",
                    textOverflow: "ellipsis",
                    height: "30px",
                    color: "white",
                  }}
                  placeholder="Please select"
                  defaultValue={ state.signalInfo ?[state.signalInfo.type]:["Legal"]}
                >
                  {signalOption}
                </Select>
                  </span>
                
              </td>
            </tr>
          <tr>
              <td>FindTime</td>
              <td>
              <DatePicker 
              allowClear={false}
              style={{width:"196px",height:"32px"}}
              showTime
              defaultValue={moment(state.signalInfo?state.signalInfo.findTime:Utils.dateFormat(dateFormat,new Date()),dateFormat)} 
              format={dateFormat} />
              </td>
          </tr>
          <tr>
              <td>Lon</td>
              <td>
                  <input type="text" 
                  value={state.signalInfo.Lon}
                  onChange={e=>handleInput("inputLon",e)}
                  style={{color:"black",width:"196px",height:"32px"}}/>
              </td>
          </tr>
          <tr>
              <td>Lat</td>
              <td>
                  <input type="text" 
                  value={state.signalInfo.Lat}
                  onChange={e=>handleInput("inputLat",e)}
                  style={{color:"black",width:"196px",height:"32px"}}/>
              </td>
          </tr>
          <tr>
              <td>Stations</td>
              <td>
                   {/* @ts-ignore */}
              <TreeSelect {...tProps} />
              </td>
          </tr>
          <tr>
              <td>Description</td>
              <td>
                 <textarea name="description" 
                 value={state.signalInfo.description}
                 onChange={e=>handleInput("inputDescription",e)}
                 style={{color:"black",width:"198px"}}></textarea>
              </td>
          </tr>
          </tbody>
        </table>

        <div className="save_button">
          <Button size="small" type="primary" 
          loading={state.saveLoading}
          onClick={
                  ()=>saveSignalInfo(cmd,state.signalInfo)
            }>Save</Button>
      </div>
      </div>
      
    </div>
  );
};
export default SignalOperation;
