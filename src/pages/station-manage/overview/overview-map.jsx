//@ts-check
import React from "react"

import CenterInfo from "../../../common/data/center";
import MapWithStationStatus from "../../component/map-with-station-status/map-with-station-status";
import { LonLat } from "../../../components/map/datas";
import VectorLayer from "ol/layer/Vector";

import {NetLegend,StatusInfoControl,WarnningControl} from "./map-controls";
import {initStaticCount,staticCount} from "../../../common/utils/station-status-static";
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
    
}