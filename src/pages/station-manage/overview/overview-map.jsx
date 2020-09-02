//@ts-check
import React from "react";
import Axios from "axios";
import {renderToString} from "react-dom/server";

import APIConfigEnum from  "../../../config/api-config";
import CenterInfo from "../../../common/data/center";
import Station from "../../../common/data/station";
import MapWithStationStatus from "../../component/map-with-station-status/map-with-station-status";
import { LonLat } from "../../../components/map/datas";
import VectorLayer from "ol/layer/Vector";

import {NetLegend,StatusInfoControl,WarnningControl} from "./map-controls";
import {initStaticCount,staticCount} from "../../../common/utils/station-status-static";
import OverlayInfo from "../../../components/map/overlay-info";
import StationInfoBox from "./station-info-box";
import { DeviceStatusEnum } from "../../../common/data/device";
import { message } from "antd";
function getColorByNetSpeed(speed){
    if(speed<=0){
        return "grey";
    }
    if(speed<100){
        return "red";
    }
    if(speed<200){
        return "orange";
    }
    return "green";
}
export default class OverviewMap extends MapWithStationStatus{
    
    constructor(props){
        super(props);
        /**
         * @type {Map<string,VectorLayer>}
         * key is station id
         */
        this.mapLineVecLayer=new Map();

        this.statusControl=null;

       
        // this.dlgCompnent=<StationInfoBox 
        // closeCallback={this.dlgCloseCallback}
       
        // />
        this.dlgCompnent=null;
    }
    componentDidMount(){
        super.componentDidMount();
       
    }
      showStations(tree,showCenter=false){
          super.showStations(tree,true);
          this.connectCenterAndStation(tree);
          this.addAllControls();
          this.mapStatusStatic=initStaticCount(this.mapStatusStatic);
          this.mapStatusStatic=staticCount(tree);
        
          this.statusControl&&this.statusControl.setStatus(this.mapStatusStatic);
          
          //add center
      }
        /**
   * convert data to the form that tree can show
   * @param {CenterInfo} tree
   */
      connectCenterAndStation(tree){
          const centerPos=new LonLat(tree.lon,tree.lat);
          tree.stations&&tree.stations.length>0&&tree.stations.forEach(sta=>{
              const des=new LonLat(sta.lon,sta.lat);
              const color=getColorByNetSpeed(sta.netSpeed);
              this.mapLineVecLayer.set(sta.id,this.centerMap.addLine(centerPos,des,color)) ;
          });
      }
      addAllControls(){
          const controls=[];
        const netLegent=new NetLegend({
            element:this.getMapElement(),
        });
        controls.push(netLegent);

        const statusControl=new StatusInfoControl({
            element:this.getMapElement()
        });
        this.statusControl=statusControl;
        controls.push(statusControl);

        const warnningControl=new WarnningControl({
            element:this.getMapElement()
        });
        controls.push(warnningControl);
        this.addControls(controls);
      }
    /**
   * @Date: 2020-09-01 22:26:55
   * @Description: 
   * @param {OverlayInfo} staOverlay
   * @return 
   */
  handleStationClick(e,staOverlay){
      /**
       * @type {CenterInfo}
       */
      const station=staOverlay.tag.station;
      super.handleStationClick(e,staOverlay);
    //   document.getElementById(IdGroup.closeId).onclick=e=>{
    //       this.centerMap.removeOverLay(IdGroup.closeId);
    //   }
    //   document.getElementById(IdGroup.logId).onclick=e=>{this.showLogInfo(staOverlay.tag.station)};
    //   document.getElementById(IdGroup.powerId).onclick=e=>{this.powerOperation(staOverlay.tag.station)}
     
}
/**
 * 
 * @param {Station} station 
 */
showLogInfo(station){
//console.log("showloginfo",station);

}
/**
 * 
 * @param {Station} station 
 */
async powerOperation(station,callback){
    //console.log("powerOperation",station);
    try{
        const res=await Axios.put(APIConfigEnum.putPowerOperation,{
            stationid:station.id,
            value:station.status===DeviceStatusEnum.SHUTDOWN?"on":"off"
        });
        if(res.data==="ok"){
           message.info("success");
        }else{
            message.error(res.data);
        }
    }catch(err){
        message.error(err.message);
    }finally{
        callback();
    }
   
}

/**
 * 
 */
createDlg=(station)=>{
    return <StationInfoBox 
    currentStation={station} 
    closeCallback={this.dlgCloseCallback}
    showLogCallback={this.showLogInfo}
    powerCalback={this.powerOperation}
    />;
}
}