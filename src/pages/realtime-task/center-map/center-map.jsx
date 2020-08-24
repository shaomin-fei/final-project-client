//@ts-check
import React, { Component } from "react";
import { renderToString } from "react-dom/server";
import {
  getCurrentTree,
  getCurrentTasks,
} from "../../../workers/workers-manage";
import CmdDefineEnum from "../../../workers/cmd-define";
import pubsub from "pubsub-js";

import StationWithStatus from "../../../components/station-with-status/station-with-status";
import CenterInfo from "../../../common/data/center";
import "./center-map.css";
import BaseMap from "../../../components/map/basemap";
import { MapInitInfo, LonLat } from "../../../components/map/datas";
import OverlayInfo from "../../../components/map/overlay-info";
import MapConfig from "../../../config/mapconfig";
import RigtTaskControl from "./right-task-list";
class CenterMap extends Component {

  // state={
  //   currentTasks:null,
  // }
   constructor(props) {
    super(props);
    /**
     * @type {BaseMap}
     */
    this.centerMap = null;
    // it maybe repeat if we let the basemap to decide the id
    this.mapContainerID = "realtime_center_map_container";
    this.mousePositionContainerID = "realtime_mouseposition_container";
    this.stationOverlayId = "realtime_station_overlay";
    this.mapContainer = null;
    /**
     * @type {Array<OverlayInfo>}
     */
    this.stationLay = null;

    this.subscribToken = null;
    this.currentTaskToken=null;

    this.showTaskControl=null;

    this.mapControlId="realtime_map_control_container";

    
  }

  componentDidMount() {
    this.centerMap = new BaseMap();
    const initInfo = new MapInitInfo();
    initInfo.centerPosition = new LonLat(
      MapConfig.centerLon,
      MapConfig.centerLat
    );
    initInfo.targetId = this.mapContainerID;
    initInfo.url = MapConfig.url;
    initInfo.zoom = MapConfig.zoom;
    initInfo.layerVisible = true;
    initInfo.mousePositionTargetId = this.mousePositionContainerID;
    this.showTaskControl=new RigtTaskControl({element:document.getElementById(this.mapControlId)});
    initInfo.controls.push(this.showTaskControl);
    this.centerMap.loadMap(initInfo, this.mapLoaded);
    this.centerMap.loadBoundary(
      MapConfig.kmlFileUrl,
      "rgba(17,44,248,0.3)",
      "transparent"
    );
    const tree = getCurrentTree();

    tree && this.showStations(tree);

    this.subscribToken = pubsub.subscribe(
      CmdDefineEnum.cmdGetTree,
      this.treeUpdate
    );
    const currentTasks=getCurrentTasks();
    currentTasks&&this.showTaskControl.updateTaskCount(currentTasks);

    this.currentTaskToken=pubsub.subscribe(CmdDefineEnum.cmdCurrentTaskChange,this.currentTaskChanged);
  }
  currentTaskChanged=(msg,currentTasks)=>{
    currentTasks&&this.showTaskControl.updateTaskCount(currentTasks);
  }
  /**
   * convert data to the form that tree can show
   * @param {CenterInfo} center
   */
  treeUpdate=(message, center)=> {
    center && this.showStations(center);
  }
  /**
   * convert data to the form that tree can show
   * @param {CenterInfo} tree
   */
  showStations = (tree) => {
    if (!tree.stations || tree.stations.length === 0) {
      return;
    }
    let stationHtmls="";
    this.stationLay = tree.stations.map((station) => {
      const ovInfo = new OverlayInfo();
      ovInfo.id = station.id;
      ovInfo.lat = station.lat;
      ovInfo.lon = station.lon;
      ovInfo.stopEventPropagation = false;
      ovInfo.tag = {
        station: station,
      };
      const strStation = renderToString(
        <StationWithStatus station={station} />
      );
      stationHtmls+=strStation;
      return ovInfo;
    });
    document.getElementById(this.stationOverlayId).innerHTML=stationHtmls;
    this.stationLay.forEach(sta=>{
        this.centerMap.insertOverLayer(sta);
    });
  };

  updateSize() {
    this.centerMap && this.centerMap.updateSize();
  }
  mapLoaded = () => {
    console.log("map loded");
    // when the map first loaded, we need to updatesize,or the map will not be full of the container
    this.centerMap.updateSize();
    this.centerMap.removeLoadedCallBack(this.mapLoaded);
  };
  componentWillUnmount() {
    this.centerMap && this.centerMap.dispose();
    pubsub.unsubscribe(this.subscribToken);
    pubsub.unsubscribe(this.currentTaskToken);
  }
  render() {
    return (
      <>
        <div id={this.mapContainerID} ref={(dv) => (this.mapContainer = dv)}>
          <div id={this.mousePositionContainerID}></div>
        </div>
        <div id={this.stationOverlayId}></div>
        <div id={this.mapControlId}></div>
      </>
    );
  }
}

export default CenterMap;
