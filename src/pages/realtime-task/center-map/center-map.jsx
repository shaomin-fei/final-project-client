//@ts-check
import React from "react";
import {
  
  getCurrentTasks,
} from "../../../workers/workers-manage";
import CmdDefineEnum from "../../../workers/cmd-define";
import pubsub from "pubsub-js";


import "./center-map.css";
import RealtimeStationInfoBox from "./realtime-station-info-box";

import OverlayInfo from "../../../components/map/overlay-info";
import Station from "../../../common/data/station";
import RigtTaskControl from "./right-task-list";
import MapWithStationStatus from "../../component/map-with-station-status/map-with-station-status";
class CenterMap extends MapWithStationStatus {

   constructor(props) {
    super(props);
    this.showTaskControl=null;

  }

  componentDidMount() {
    super.componentDidMount();
    this.addAllControls();
    const currentTasks=getCurrentTasks();
    currentTasks&&this.showTaskControl.updateTaskCount(currentTasks);

    this.currentTaskToken=pubsub.subscribe(CmdDefineEnum.cmdCurrentTaskChange,this.currentTaskChanged);
  }
  currentTaskChanged=(msg,currentTasks)=>{
    currentTasks&&this.showTaskControl.updateTaskCount(currentTasks);
  }
  addAllControls(){
    const controls=[];
        this.showTaskControl=new RigtTaskControl({
            element:this.getMapElement(),
        });
        controls.push(this.showTaskControl);
        this.addControls(controls);
  }
 
  
  /**
 * @param {Station} station
 */
createDlg=(station)=>{
  return <RealtimeStationInfoBox 
  currentStation={station} 
  closeCallback={this.dlgCloseCallback}
  
  />;
}
  getExtralControls(){
    
  }

  render() {
    return (
      <>
       {super.render()}
      </>
    );
  }
}

export default CenterMap;
