//@ts-check
import React from "react";
import { toLonLat, fromLonLat } from "ol/proj";
import { MapBrowserEvent } from "ol";

import OverlayInfo from "../../../components/map/overlay-info";
import MapWithStationStatus from "../../component/map-with-station-status/map-with-station-status";
import StationOperationForm from "./station-operation-form";
import StationOperationBody,{StationBodyInfo,DeviceListInfo} from "./station-operation-form-body";
import {
    getCurrentTree,
    
  } from "../../../workers/workers-manage";
import Station from "../../../common/data/station";


export default class MapStations extends MapWithStationStatus {
  constructor(props) {
    super(props, { isShowDrower: false,stationInfo:null });
    /**
     * @type {StationOperationBody}
     */
    //this.stationBody=null;
  }
  componentDidMount() {
    super.componentDidMount();
    this.addEventListener("dblclick", this.mapDbClick);
  }
  componentWillUnmount() {
    this.removeSelctState();
    this.removeEventListener("dblclick", this.mapDbClick);
    super.componentWillUnmount();
    
   
    
  }
  removeSelctState(){
    const current=this.state.currentStation;
    if(current){
      current.selected=false;
      const currentElement=document.getElementById(current.id);
      if(currentElement){
        currentElement.className="station_on_map";
      }
      
    }
  }
  /**
   *
   * @param {MapBrowserEvent} e
   */
  mapDbClick = (e) => {
    e.preventDefault();
    const stationInfo=new StationBodyInfo();
    const lonlat = toLonLat(e.coordinate);
    //@ts-ignore
    stationInfo.lon= lonlat[0].toFixed(6)*1;
    //@ts-ignore
    stationInfo.lat=lonlat[1].toFixed(6)*1;
    stationInfo.center.push(getCurrentTree().name);
    //this.stationBody.addStation(stationInfo);
    this.setState({ isShowDrower: true,stationInfo:stationInfo });
    this.removeSelctState();
    //console.log("map dbclick", e, lonlat);
  };
  getExtralControls() {
    if (this.state.isShowDrower) {
      return (
        <StationOperationForm 
        closeCallback={this.stationFormCloseCallback}
        title={this.state.stationInfo.cmd==="add"?"Add Station":"Update Station"}
        >
          <StationOperationBody   
          stationInfo={this.state.stationInfo}
          // 如果要对函数组件用ref,函数组件要通过forwardRef包裹，否则会报：warning:Function components cannot be given refs
          // ref={sta=>this.stationBody=sta}
          />
        </StationOperationForm>
      );
    }
    return null;
  }
  /**
   * @Date: 2020-09-01 22:26:55
   * @Description:
   * @param {OverlayInfo} staOverlay
   * @return
   */
  handleStationClick(e, staOverlay){
    const stationInfo=new StationBodyInfo();
    /**
     * @type {Station}
     */
    const station=staOverlay.tag.station;
    const lonlat =[staOverlay.lon,staOverlay.lat];
    stationInfo.cmd="update";
    
    stationInfo.name=station.name;
    if(station.devices&&station.devices.length>0){
      station.devices.forEach(dev=>{
        const devInfo=new DeviceListInfo();
        devInfo.url=dev.url;
        stationInfo.devicesUrl.push(devInfo);
      })
    }
    station.selected=true;
    //@ts-ignore
    stationInfo.lon= lonlat[0].toFixed(6)*1;
    //@ts-ignore
    stationInfo.lat=lonlat[1].toFixed(6)*1;
    stationInfo.center.push(getCurrentTree().name);
    //this.stationBody.addStation(stationInfo);
    /**
     * @type {Station}
     */
    const current=this.state.currentStation;
    if(current){
      this.removeSelctState();
    }
    document.getElementById(station.id).className="station_on_map station_on_map_selected";
    this.setState({ isShowDrower: true,stationInfo:stationInfo,currentStation:station });
  }
  stationFormCloseCallback = (e) => {
    this.setState({ isShowDrower: false });
    this.removeSelctState();
  };
  render() {
    return <>{super.render()}</>;
  }
}
