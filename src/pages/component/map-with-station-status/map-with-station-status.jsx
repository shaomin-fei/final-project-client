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
import "./map-with-station-status.css";
import BaseMap from "../../../components/map/basemap";
import { MapInitInfo, LonLat } from "../../../components/map/datas";
import OverlayInfo from "../../../components/map/overlay-info";
import MapConfig from "../../../config/mapconfig";
import centerIcon from "../../../imgs/station/省中心.png";
import { stopTask } from "../../tasks/fixed/content/realtime-content";
//import RigtTaskControl from "./right-task-list";
class MapWithStationStatus extends Component {

  // state={
  //   currentTasks:null,
  // }
  state={
    showDlg:false,
    currentStation:null
  }
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

    this.dlgContainerID="dlg_on_map_container";
    this.dlgContainer=null;
    this.dlgCompnent=null;
    /**
     * @type {Array<OverlayInfo>}
     */
    this.stationLay = null;

    this.subscribToken = null;
    this.currentTaskToken=null;

    this.showControls=[];

    this.mapControlId="realtime_map_control_container";
    this.mapControlContainer=null;

    this.showStations=this.showStations.bind(this);
    this.handleStationClick=this.handleStationClick.bind(this);
    this.dlgCloseCallback=this.dlgCloseCallback.bind(this);
    
  }

  getMapElement(){
      return this.mapControlContainer;
  }
  addControls(controls){
      this.centerMap.addControls(controls);
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
    //this.showTaskControl=new RigtTaskControl({element:document.getElementById(this.mapControlId)});
    
    //initInfo.controls.push(this.showTaskControl);
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
    //const currentTasks=getCurrentTasks();
    //currentTasks&&this.showTaskControl.updateTaskCount(currentTasks);

    //this.currentTaskToken=pubsub.subscribe(CmdDefineEnum.cmdCurrentTaskChange,this.currentTaskChanged);
  }
//   currentTaskChanged=(msg,currentTasks)=>{
//     currentTasks&&this.showTaskControl.updateTaskCount(currentTasks);
//   }
  /**
   * convert data to the form that tree can show
   * @param {CenterInfo} center
   */
  treeUpdate=(message, center)=> {
    if(center){
      this.showStations(center);
      if(this.state.currentStation){
        let newStation=null;
        if(center.stations.length>0){
           newStation=center.stations.find(sta=>{
            return sta.id===this.state.currentStation.id;
          });
        }
        this.setState({currentStation:newStation});
      }
    } 
    
  }
  clearStationOverlay=()=>{
    if(this.stationLay&&this.stationLay.length>0){
      this.stationLay.forEach(lay=>{
        this.centerMap.removeOverLay(lay.id);
      });
    }
  }
  /**
   * convert data to the form that tree can show
   * @param {CenterInfo} tree
   */
  showStations(tree,showCenter=false) {
    if (!tree.stations || tree.stations.length === 0) {
      return;
    }
    let stationHtmls="";
    this.clearStationOverlay();
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
    if(showCenter){
        stationHtmls+=`<div id=${tree.id}><img src=${centerIcon} alt=""/></div>`;
        const ovInfo = new OverlayInfo();
      ovInfo.id = tree.id;
      ovInfo.lat = tree.lat;
      ovInfo.lon = tree.lon;
      ovInfo.stopEventPropagation = false;
      this.stationLay.push(ovInfo);
    }
    document.getElementById(this.stationOverlayId).innerHTML=stationHtmls;
    this.stationLay.forEach(sta=>{
        this.centerMap.insertOverLayer(sta);
       
        sta.element=document.getElementById(sta.id);
        sta.element.onclick=e=>this.handleStationClick(e,sta);
        //sta.element.addEventListener("click",e=>this.handleStationClick(e,sta));
        
    });
  };
  /**
   * @Date: 2020-09-01 22:26:55
   * @Description: 
   * @param {OverlayInfo} staOverlay
   * @return 
   */
  handleStationClick(e,staOverlay){
    //console.log("station clicked",staOverlay);
    //const html=this.createDlg();
    const container=this.dlgContainer;
    //container.innerHTML=html;
    const station=staOverlay.tag.station;
    const ovDlg=new OverlayInfo();
    ovDlg.lon=station.lon;
    ovDlg.element=this.dlgContainer;
    ovDlg.lat=station.lat;
    ovDlg.position="top-left";
    ovDlg.stopEventPropagation=false;
    ovDlg.id=this.dlgContainerID;
    this.centerMap.insertOverLayer(ovDlg);

    const mapRects = this.mapContainer
      .getBoundingClientRect();
    const diagWidth = this.dlgContainer.clientWidth;
    //@ts-ignore
    if (e.layerX + diagWidth > mapRects.width) {
      //need to be paned
      //@ts-ignore
      this.centerMap.panMap(e.layerX + diagWidth - mapRects.width + 20, 0);
    }
    this.setState({showDlg:true,currentStation:{...station}});
  }
  /**
   * todo, child implement
   * @return {JSX.Element}
   */
  createDlg(station){
    return null;
  }
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
  dlgCloseCallback(clickedStation){

    //console.log("close",clickedStation);
    this.centerMap.removeOverLay(this.dlgContainerID);
    this.setState({showDlg:false,currentStation:null});

  }
  render() {
    console.log("mat station render");
    return (
      <>
        <div id={this.mapContainerID} ref={(dv) => (this.mapContainer = dv)}>
          <div id={this.mousePositionContainerID}></div>
        </div>
        <div id={this.stationOverlayId}></div>
        <div id={this.mapControlId} ref={dv=>this.mapControlContainer=dv}></div>
        <div id={this.dlgContainerID} 
        ref={dv=>this.dlgContainer=dv} 
        style={{display:this.state.showDlg?"block":"none"}}>
          {this.createDlg(this.state.currentStation)}
        </div>
      </>
    );
  }
}

export default MapWithStationStatus;
