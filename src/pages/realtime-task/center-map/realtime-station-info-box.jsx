//@ts-check
import React from "react";
import {Link} from "react-router-dom"
import { CloseOutlined} from "@ant-design/icons";
import { Collapse, message } from 'antd';
import "antd/dist/antd.css";

import Station from "../../../common/data/station";
import {DeviceStatusEnum,DeviceInfo} from "../../../common/data/device";

import "./center-map.css"
import autoPic from "../../../imgs/gms/task/mscan.png";
import fixPic from "../../../imgs/gms/task/fixfq.png";
import scanPic from "../../../imgs/gms/task/pscan.png";

const { Panel } = Collapse;
/**
 * @Date: 2020-09-09 21:51:35
 * @Description: 
 * @param {DeviceInfo} device
 * @return {string} 
 */
function getDevStatusDes(device){
    let devStatusInfo=device.status;
        if(device.status===DeviceStatusEnum.WORKING){
            devStatusInfo+="("+device.runningTasks[0].name+")";
            
        }
        return devStatusInfo;
}
const RealtimeStationInfoBox=function(props){
    
    /**
     * @type {Station}
     */
    const station=props.currentStation;
    /**
     * @Date: 2020-09-10 00:22:38
     * @Description: 
     * @param {DeviceInfo} device
     * @return {void} 
     */
    function linkToTaskClick(device,e){
        if(device.status===DeviceStatusEnum.SHUTDOWN){
            message.info("can not execute the task, the device is shutdown");
            e.preventDefault();
            return;
        }
    }
    /**
     * @Date: 2020-09-09 21:54:58
     * @Description: 
     * @param {DeviceInfo} device
     * @return {Array<JSX.Element>} 
     */
    function getDeviceAbilityJSX(device){
        if(!device.abilities||device.abilities.length===0){
            return null;
        }
        const result= device.abilities.map(abi=>{
            let img=null;
            if(abi.name==="FIXFQ"){
                img=fixPic;
            }else if(abi.name==="Scan"){
                img=scanPic;
            }else{
                img=autoPic;
            }
            let strExecute=`/executetask/${abi.name}/type=executeTask&&`;
          let info= device?`stationid=${device.stationId}&&deviceid=${device.id}&&tasktype=${abi.name}`:"";
          strExecute+=info;
            return (
                <Link key={abi.name} to={strExecute} target="_blank" onClick={e=>linkToTaskClick(device,e)}>
                <div  className="single_task_small" >
                <div className="single_task_img_small" style=
                {{background:"url("+img+") no-repeat center"}}>
                </div>
                <div className="task_name_small">{abi.name==="FIXFQ"?"FIXED":abi.name}
                </div>
                </div>
                </Link>
            )
        });
        return result;
    }
    function getDeviceJSX(){
        if(!station||!station.devices||station.devices.length===0){
            return null;
        }
        
        return (
            <Collapse defaultActiveKey={["0"]} accordion>
                {
                    station.devices.map((dev,index)=>{

                        return (
                            <Panel  header={dev.name+"---"+getDevStatusDes(dev)} key={index}>
                                    {getDeviceAbilityJSX(dev)}
                            </Panel>
                        )
                    })
                }
            </Collapse>
        );
        
    }
    return (
       
        <div className="realtime_stationinfo_box_container">
            <div className="stationinfo_header">
            <span>{station?station.name:""}</span>
                <span>
                    <CloseOutlined onClick={props.closeCallback}/>
                </span>

            </div>
            {/* <div className="line_separator_hr"></div> */}
            <div className="realtime_device_task">
            {getDeviceJSX()}
            </div>
        </div>
    );
}
export default RealtimeStationInfoBox;