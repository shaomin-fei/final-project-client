//@ts-check
import React from "react";
import { toLonLat, fromLonLat } from "ol/proj";
import { MapBrowserEvent } from "ol";

import MapWithStationStatus from "../../component/map-with-station-status/map-with-station-status";
import StationOperationForm from "./station-operation-form";
import StationOperationBody,{StationBodyInfo} from "./station-operation-form-body";
import {
    getCurrentTree,
    
  } from "../../../workers/workers-manage";


export default class MapStations extends MapWithStationStatus {
  constructor(props) {
    super(props, { isShowDrower: false,stationInfo:null });
    /**
     * @type {StationOperationBody}
     */
    this.stationBody=null;
  }
  componentDidMount() {
    super.componentDidMount();
    this.addEventListener("dblclick", this.mapDbClick);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.removeEventListener("dblclick", this.mapDbClick);
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
    
    console.log("map dbclick", e, lonlat);
  };
  getExtralControls() {
    if (this.state.isShowDrower) {
      return (
        <StationOperationForm 
        closeCallback={this.stationFormCloseCallback}
        >
          <StationOperationBody   
          stationInfo={this.state.stationInfo}
          ref={sta=>this.stationBody=sta}
          />
        </StationOperationForm>
      );
    }
    return null;
  }
  stationFormCloseCallback = (e) => {
    this.setState({ isShowDrower: false });
  };
  render() {
    return <>{super.render()}</>;
  }
}
