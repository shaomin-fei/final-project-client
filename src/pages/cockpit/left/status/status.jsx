//@ts-check
/*
 * @Description: show the total statistic of the devices,like how many devices are working,idle,fault,shutdown
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 09:52:52
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-01 19:12:08
 */
import React,{useEffect,useContext,useRef} from "react";
import ReactDom from "react-dom"
import { ArrowUpOutlined } from "@ant-design/icons";
import ReactDOMServer from "react-dom/server";

import {RouterEnum} from "../../../../config/define"
import NetOrder from "./net-order";
import MainPageStyleBox from "../../../../components/mainpage-style-box/mainpage-style-box"
import "./status.css";
import {TreeContext} from "../../context"
import Station from "../../../../common/data/station";
import {DeviceStatusEnum} from "../../../../common/data/device";
import {staticCount,initStaticCount} from "../../../../common/utils/station-status-static";
import CenterInfo from "../../../../common/data/center";


// function staticCount(tree){
//   let staticCountMap=new Map();
//   staticCountMap=initStaticCount(staticCountMap);
//   tree.stations&&tree.stations.forEach(station=>{
//     switch(station.status){
//       case DeviceStatusEnum.WORKING:
//         increasMapData(staticCountMap,DeviceStatusEnum.WORKING);
//         break;
//       case DeviceStatusEnum.SHUTDOWN:
//         increasMapData(staticCountMap,DeviceStatusEnum.SHUTDOWN);
//         break;
//       case DeviceStatusEnum.IDLE:
//         increasMapData(staticCountMap,DeviceStatusEnum.IDLE);
//         break;
//       case DeviceStatusEnum.FAULT:
//         increasMapData(staticCountMap,DeviceStatusEnum.FAULT);
//         break;
//       default:
//         break;
//     }
//   });
//   return staticCountMap;
// }
// function increasMapData(mapData,key){
//   if(!mapData.has(key)){
//     mapData.set(key,0);
//   }
//   const count= mapData.get(key)+1;
//   mapData.set(key,count);
// }

/**
 * @Date: 2020-08-18 08:07:30
 * @Description: 
 * @param {CenterInfo}  tree
 * @return {Array<Station>|null} 
 */
function getNetLastFive(tree){
  const stations=[...tree.stations];
  if(!stations){
    return null;
  }
  stations.sort((s1,s2)=>{
    return s1.netSpeed-s2.netSpeed;
  });
  return stations;
}
export default function Status(props) {
  /**
   * @type {CenterInfo}
   */
  const tree=useContext(TreeContext);
  const statusCount=useRef(initStaticCount());
  const netSort=useRef([]);
  if(tree){
    statusCount.current=staticCount(tree);
    netSort.current=getNetLastFive(tree);
  }
  const getChildren=()=>{

    return (<>
      <section className="status_amount mainpage_title_font_info">
      <div className="status_working ">{statusCount.current.get(DeviceStatusEnum.WORKING)}</div>
      <div className="status_idle">{statusCount.current.get(DeviceStatusEnum.IDLE)}</div>
      <div className="status_fault">{statusCount.current.get(DeviceStatusEnum.FAULT)}</div>
      <div className="status_shutdown">{statusCount.current.get(DeviceStatusEnum.SHUTDOWN)}</div>
    </section>
       
    {/* show description of each circle */}
    <section className="status_description mainpage_title_font_info">
      <div className="des_working">Working</div>
      <div className="des_idle">Idle</div>
      <div className="des_fault">Warning</div>
      <div className="des_shutdown">Shutdown</div>
    </section>
    <section className="net_condition">
      <section className="mainpage_title_font_info">
        Net Speed Last 5
        <ArrowUpOutlined />
      </section>
      <NetOrder lastFive={netSort.current}/>
    </section>
    </>
    
    )
  }
  //console.log("status",tree);
  useEffect(()=>{
 
  //   ReactDom.render(
  //   (<>
  //   <section className="status_amount mainpage_title_font_info">
  //   <div className="status_working ">{statusCount.current.get(DeviceStatusEnum.WORKING)}</div>
  //   <div className="status_idle">{statusCount.current.get(DeviceStatusEnum.IDLE)}</div>
  //   <div className="status_fault">{statusCount.current.get(DeviceStatusEnum.FAULT)}</div>
  //   <div className="status_shutdown">{statusCount.current.get(DeviceStatusEnum.SHUTDOWN)}</div>
  // </section>
     
  // {/* show description of each circle */}
  // <section className="status_description mainpage_title_font_info">
  //   <div className="des_working">Working</div>
  //   <div className="des_idle">Idle</div>
  //   <div className="des_fault">Fault</div>
  //   <div className="des_shutdown">Shutdown</div>
  // </section>
  // <section className="net_condition">
  //   <section className="mainpage_title_font_info">
  //     Net Speed Last 5
  //     <ArrowUpOutlined />
  //   </section>
  //   <NetOrder lastFive={netSort.current}/>
  // </section>
  // </>
  
  // )
  // ,document.getElementById("status_content")
  // );
  return ()=>{
    
  };
  
},
    [statusCount.current,netSort.current]);

  
    return (
    <>
      {/* @ts-ignore */}
      <MainPageStyleBox width="100%" height="70%" 
      title="Device Status" mountDivId="status_content" 
      mountDivHeight="calc(100% - 30px)"
      linkedPath={RouterEnum.StationManage}>
         {getChildren()}
      </MainPageStyleBox>
     
      
         {/* show amount in circle button */}
         
      </>
    )
  }

    
    // <section className="dev_status">
    //   {/* show title */}
    //   <section className="statusTitle">
    //     <section className="left_img"></section>
    //     <section className="title font_info">Device Status</section>
    //     <section className="right_img"></section>
    //   </section>
    //   <section className="line_separator"></section>
    //   {/* show amount in circle button */}
    //   <section className="status_amount font_info">
    //     <div className="status_working ">0</div>
    //     <div className="status_idle">0</div>
    //     <div className="status_fault">0</div>
    //     <div className="status_shutdown">0</div>
    //   </section>
    //   {/* show description of each circle */}
    //   <section className="status_description font_info">
    //     <div className="des_working">Working</div>
    //     <div className="des_idle">Idle</div>
    //     <div className="des_fault">Fault</div>
    //     <div className="des_shutdown">Shutdown</div>
    //   </section>
    //   <section className="net_condition">
    //     <section className="font_info">
    //       Net Speed Last 5
    //       <ArrowUpOutlined />
    //     </section>
    //     <NetOrder />
    //   </section>
    //   {/* show highlight corner */}
    //   <section className="corner_left_top"></section>
    //   <section className="corner_left_bottom"></section>
    //   <section className="corner_right_top"></section>
    //   <section className="corner_right_bottom"></section>
    // </section>
  //);
//};

