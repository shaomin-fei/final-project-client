
import React,{useReducer} from "react";

import {ToolbarCmdContext} from "../../../../common/data/realtime/tasks-common"
import CommonToolbar from "../../toolbars/common-toolbar";
import Spectrum,{startTask as startShow,stopTask as stopShow, reset as resetSpectrum, resizeChart as resizeSpectrumChart,setData as setSpecData} from "../../../../components/graphic/spectrum/spectrum";
import LevelGraph,{reset as resetLevel, resizeChart as resizeLevelChart,setData as setLevelData}  from "../../../../components/graphic/level/level";
import IQGraph,{resizeChart as resizeIQChart,setData as setIQData} from "../../../../components/graphic/IQ/iq";
import ITUGraph,{setData as setITUData} from "../../../../components/graphic/itu/itu";
import "./realtime-content.css"
import { useContext } from "react";
import WorkerParam from "../../../../config/worker-param";
import CmdDefineEnum from "../../../../workers/cmd-define";

let importantParams="";
let dispatchCmd=null;
let currentCenterFreq=0;
const initState={
    checkLevel:false,
    checkIQ:false,
    checkITU:false,
    playAudio:false,
    collapse:false,
    audioChecked:true,
    centerFreq:"",
};
let toolbarContext=null;
export function resizeChart(isCollapse){

    dispatchCmd({type:"collpase",data:isCollapse});
    resizeSpectrumChart();
    resizeLevelChart();
    resizeIQChart();

}
/**
 * @Date: 2020-08-27 08:18:55
 * @Description: 
 * @param {Map<string,object>} data
 * @return  
 */
export function setData(data){
    //const dateStart=Date.now();
    setSpecData(data);
    //const spec=Date.now();
    //console.log("sepc time cost ",spec-dateStart);
    setLevelData(data);
    //const level=Date.now();
    //console.log("level time cost ",level-spec);
    setIQData(data);
    //const iq=Date.now();
    //console.log("iq time cost ",iq-level);
    setITUData(data);
    //const itu=Date.now();
    //console.log("itu time cost ",itu-iq);
    //const dateEnd=Date.now();
    //console.log("total time cost ",dateEnd-dateStart);
//@ts-ignore
    postMessage(new WorkerParam(CmdDefineEnum.cmdCouldSendData,""));
}
export function resetChart(){
    resetSpectrum();
    resetLevel();
}
/**
 * 
 * @param {TaskParamFromDevice} param 
 */
export function setImportantParamToToolbar(param){
    dispatchCmd({type:"setCenterFreq",data:param.DefaultValue});
}

export function getImportantParams(){
    let errorInfo="";
    if(!importantParams){
        errorInfo="please input center freq";
    }
    return {errorInfo,importantParams,currentCenterFreq};
}
export function startTask(){
    startShow();
}
export function stopTask(){
    stopShow();
}

function dispatcher(state,action){
    
    switch (action.type){
        case "setCenterFreq":
            {
                if(action.data){
                    importantParams="CenterFreq="+action.data+";";
                    currentCenterFreq=action.data;
                }else{
                    importantParams="";
                    currentCenterFreq=0;
                }
                
                return {...state,centerFreq:action.data};
            }
        case "changeIQ":{
            return {...state,checkIQ:action.data}
        }
        case "changeITU":{
            return {...state,checkITU:action.data}
        }
        case "changeLevel":{
            return {...state,checkLevel:action.data}
        }
        case "collpase":{
            return {...state,collapse:action.data}
        }
        case "changeAudio":{
            return {...state,audioChecked:action.data}
        }
            default:
                return {...state};
    }
}
/**
 * @Date: 2020-08-31 17:06:27
 * @Description: 
 * @param {HTMLInputElement}  target
 * @param {string} cmd
 * @return {void} 
 */
function handleChecked(target,cmd){
    //debugger
    if(cmd==="changeIQ"){
        dispatchCmd({type:"changeIQ",data:target.checked});
        
    }
    else if(cmd==="changeLevel"){
        dispatchCmd({type:"changeLevel",data:target.checked});
        
    }
    else if(cmd==="changeITU"){
        dispatchCmd({type:"changeITU",data:target.checked});
        
    }else if(cmd==="changeAudio"){
        dispatchCmd({type:"changeAudio",data:target.checked});
        toolbarContext.isPlayAudioChanged(target.checked);
    }
    setTimeout(() => {
        resizeChart();
    }, 100);
}
/**
 * @type {function}
 */

const RealTimeContent =function(props){

    toolbarContext=useContext(ToolbarCmdContext);
    const [state,dispatch]= useReducer(dispatcher,initState);  
    dispatchCmd=dispatch;  
    //console.log("ituxxx ",state);
    return (
        <>
        <CommonToolbar>
            <span style={{marginLeft:"30px"}}>
                <label style={{color:"white",fontWeight:"bold"}} 
                htmlFor="">CenterFreq</label>
                <span >
                    <input type="text" style={{width:"70px",
                    height:"30px",borderRadius:"10px",marginLeft:"5px",
                    fontWeight:"bold",
                    // must have, compatiable with safari
                    lineHeight:"30px",
                    
                }}
                    value={state.centerFreq}
                    autoFocus={true}
                    //@ts-ignore
                    onChange={e=>dispatch({type:"setCenterFreq",data:e.target.value})}
                    />                 
                </span>
                <label style={{color:"white",fontWeight:"bolder",marginLeft:"5px"}}>MHz</label>
            </span>
            <span style={
                {
                    // border:"1px solid red",
            color:"white",
            fontWeight:"bold",marginLeft:"30px",
            padding:"5px",
            }
            }>
            <span className="graph_show">
                <label htmlFor="">Level&nbsp;</label>
                {/* @ts-ignore */}
                <input type="checkbox" onClick={e=>handleChecked(e.target,"changeLevel")}/>
            </span>

            <span className="graph_show">
                <label htmlFor="">IQ&nbsp;</label>
                {/* @ts-ignore */}
                <input type="checkbox" onClick={e=>handleChecked(e.target,"changeIQ")}/>
            </span>
            <span className="graph_show">
                <label htmlFor="">ITU&nbsp;</label>
                {/* @ts-ignore */}
                <input type="checkbox" onClick={e=>handleChecked(e.target,"changeITU")}/>
            </span>
            <span className="graph_show">
                <label htmlFor="">Audio&nbsp;</label>
                {/* @ts-ignore */}
                <input type="checkbox" checked={state.audioChecked}
                onChange={e=>handleChecked(e.target,"changeAudio")}/>
                 {/* onClick={e=>handleChecked(e.target,"changeAudio")}/> */}
            </span>
            </span>
            
         
        </CommonToolbar>
        <div className="graph_content">
        <div className="content_up" style={{
            height:(!state.checkIQ&&!state.checkITU)?"100%":"calc(70% - 5px)",
            // border:"1px solid red"
        }}>
            <div className="content_spectrum" style={
                {
                    width:(state.checkLevel?"70%":"100%"),
                    // border:"1px solid green"

                }
                }>
                <Spectrum/>
            </div>
            <div className="content_level" style={
                {
                    width:(state.checkLevel?"30%":"0%"),
                }
            }>
            {state.checkLevel?<LevelGraph />:null}
               
            </div>
        </div>
        <div className="content_down" style={{
            height:(!state.checkIQ&&!state.checkITU?"0%":"calc(30% + 5px)")
        }}>
            <div className="content_iq" style={{
                width:(state.checkIQ?(state.checkITU?"70%":"100%"):"0%")
            }}>
            {state.checkIQ?<IQGraph />:null}
                
            </div>
            <div className="content_itu" style={{
                width:(state.checkITU?(state.checkIQ?"30%":"100%"):"0%"),
                // border:"1px solid yellow"
            }}>
                {state.checkITU?<ITUGraph />:null}
            </div>
        </div>
        </div>
        </>
    );
}
export default RealTimeContent;