//@ts-check
import React,{useReducer,useContext} from "react"
import {Button} from "antd";
 
import {ToolbarCmdContext} from "../tasks-common";
import HeadRight from "../../../components/header-right/header-right"
import "./common-toolbar.css";
const iniStateOfToolbar={
    startButton:false,//when start, it's true
}

const CommonToolbar = function(props){
    const cmdCallback=useContext(ToolbarCmdContext);
    const [toolbarState,dispatch]=useReducer((state,action)=>{
        switch(action.type){
            case "taskStart":{
                return {...state,startButton:true};
            }
            case "taskStop":{
                return {...state,startButton:false};
            }
            default:
                return state;
        }
    },iniStateOfToolbar);
    function startBtnClick(){
        const {startButton}=toolbarState;
        if(startButton){
            //stop task
            //@ts-ignore
            dispatch({
                type:"taskStop",
            });
            cmdCallback&&cmdCallback.stopTaskCallback();
        }else{
            //start task
            
            dispatch(
                 //@ts-ignore
                {
                type:"taskStart",
            });
            cmdCallback&&cmdCallback.startTaskCallback();
        }
    }
    return (
        <div className="execute_realtime_toolbar">
            <HeadRight ></HeadRight>
            <div style={{lineHeight:"40px",marginLeft:"10px"}}>
                 <Button type="primary" 
                 size="small"
                 onClick={startBtnClick}
                 >{toolbarState.startButton?"Stop":"Start"}</Button>
            </div>
        </div>
    );
}
export default CommonToolbar;