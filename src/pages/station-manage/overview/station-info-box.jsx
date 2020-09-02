import React, { useState,useEffect } from "react";
import { Button } from 'antd';
import { CloseOutlined,PoweroffOutlined,FileTextOutlined } from "@ant-design/icons";
// import { Button } from "antd";
// import "antd/dist/antd.css";

import "./overview-map.css"
import {DeviceStatusEnum} from "../../../common/data/device";
import Station from "../../../common/data/station";

export const IdGroup={
  closeId:"stationinfo_box_close",
  logId:"stationinfo_box_log",
  powerId:"stationinfo_box_power",
}
// let currentStation=null;
// export function updateValues(station){

//   currentStation=station;
// }
// export function setCurrentStation(station){
//   currentStation=station;
// }

const StationInfoBox = function (props) {
  
  
  //console.log("StationInfoBox render");
  useEffect(()=>{

    //console.log("StationInfoBox loded");
  },[]);
  const[loading,setLoading]= useState(false);
  /**
   * @type {Station}
   */
  const currentStation=props.currentStation;
  function handlePowerClick(e){

    setLoading(true);
    props.powerCalback(currentStation,()=>{
      setLoading(false);
    }) 
    // setTimeout(() => {
    //   setLoading(false);
    // }, 3000);
  }
  const arrayEnvironment=[];
  
  if(currentStation&&currentStation.environment){
    const entries=Object.entries(currentStation.environment);
    if(entries.length%2!=0){//凑够偶数，因为一行显示2组元素
      entries.push(["",{value:"",unit:"",warnning:0}]);
    }
    for(let i=0;i<entries.length;i+=2){
      //a row contain two keys
      arrayEnvironment.push([entries[i],entries[i+1]]);
    }
  }
  return (
    <div className="stationinfo_box" >
      <div className="stationinfo_box_head">
        <span>Virtual-001</span>
        <span>
        <Button type="primary" 
        size="small" 
        icon={<CloseOutlined/>}
        onClick={e=>props.closeCallback(currentStation)}
        ></Button>
        </span>
        
        <span>
        <Button type="primary" 
        size="small" 
        icon={<FileTextOutlined />}
        onClick={e=>props.showLogCallback(currentStation)}
        >Log</Button>
        </span>
        <span>
        <Button type="primary" 
        size="small" 
        icon={<PoweroffOutlined/>}
        loading={loading}
        onClick={handlePowerClick}
      >{currentStation&&currentStation.status===DeviceStatusEnum.SHUTDOWN?"on":"off"}</Button>
        </span>
               
      </div>
      <div className="line_separator_hr"></div>
      <div className="stationinfo_box_content">
        {/* first row */}
        <table>
          <tbody>
            {
              arrayEnvironment.map((attr,index)=>{
                return (
                  <tr key={index}>
                    <td>{attr[0][0]}</td>
                    <td style={
                      {
                        borderRight:"1px solid #ccc",
                        color:attr[0][1].warnning?"red":"white"
                      }
                      }>{attr[0][1].value+attr[0][1].unit}</td>

                    <td>{attr[1][0]}</td>
                    <td style={
                      {
                        color:attr[1][1].warnning?"red":"white"
                      }
                      }>{attr[1][1].value+attr[1][1].unit}</td>
                  </tr>
                )
              })
            }
          {/* <tr>
            <td>Temperature</td>
            <td style={{borderRight:"1px solid #ccc"}}>40°C</td>
            
            <td>Humidity</td>
            <td>50%</td>
          
          </tr>
          <tr>
         
            <td>Smoke</td>
            <td style={{borderRight:"1px solid #ccc"}}>No</td>
          
          
            <td>Access</td>
            <td>No</td>
          
        </tr>

        <tr> 
          
            <td>Voltage</td>
            <td style={{borderRight:"1px solid #ccc"}}>220V</td>
          
         
            <td>Current</td>
            <td>2A</td>
          
        </tr>*/}
        </tbody>
        </table>

        {/* second row */}
       

        {/* third row */}
        
      </div>
    </div>
  );
};
export default StationInfoBox;
