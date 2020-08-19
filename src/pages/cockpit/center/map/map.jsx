// @ts-check

/*
 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-07 21:52:44
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-19 01:12:08
 */

import React, { Component } from "react";
import pubsub from "pubsub-js";

import BaseMap from "../../../../components/map/basemap";
import {MapInitInfo, LonLat} from "../../../../components/map/datas";
import OverlayInfo from "../../../../components/map/overlay-info";
import MapConfig from "../../../../config/mapconfig";
import CmdDefineEnum from "../../../../workers/cmd-define";
import CenterInfo from "../../../../common/data/center";
import {getCurrentTree} from "../../../../workers/workers-manage";
import {Issue, SignalStaticByReason} from "../../context"


import "./station_overlay.css";

class StationContainSignal{
  stationid="";
  frequencies=[];
  maxLevel=[];
  reasons=[];
  occurTime=[];
  information=[];
  occupy=[];
}

export default class CenterMap extends Component {
  /**
   * @type {Map<string,StationContainSignal>}
   */
  mapStationAndSignal=new Map();
    state={
        mapContainerHeight:0,
        mapBottomContainerTop:0,
    }
  constructor(props) {
    super(props);
    /**
     * @type {BaseMap}
     */
    this.map = null;
    this.isResizing=false;
    this.topicToken=[];
    this.stationLay=null;
  }
  componentWillUnmount(){
      document.removeEventListener("mousemove",this.resizeVertical);
      document.removeEventListener("mouseup",this.resizeEnd);
      this.topicToken.forEach(token=>{
        pubsub.unsubscribe(token);
      });
      //document.removeEventListener("mouseout",this.resizeEnd);
  }
  componentDidMount() {
      this.InitmapBottomContainerTop=this.bottomContainer.getBoundingClientRect().top;
      this.InitmapBottomContainerBottom=this.bottomContainer.getBoundingClientRect().bottom;
      this.InitmapContainerHeight=this.mapContainer.clientHeight;
      document.addEventListener("mousemove",this.resizeVertical);
      document.addEventListener("mouseup",this.resizeEnd);
      
      
      this.createMap();

      const tree=getCurrentTree();
      if(tree&&tree.stations){
        this.addTree(tree);
      }
      // put behind in order to prevent add twice.
      this.topicToken.push(pubsub.subscribe(CmdDefineEnum.cmdGetTree,this.getTree)) ;
      this.topicToken.push(pubsub.subscribe(CmdDefineEnum.cmdSignalByReasonChoosed,this.signalChoosed)) ;
      
    // let stationHtml = "";
    // let stations = [];
    // for (let i = 0; i < 10; i++) {
    //   const station = new OverlayInfo();
    //   station.id = "station_" + i.toString();
    //   station.lat = 26.945 + i * 0.2;
    //   station.lon = 111.166 + i * 0.2;
    //   station.stopEventPropagation = false;
    //   stationHtml += this.createStation(station.id);
    //   stations.push(station);
    // }
    // document.getElementById("station_overlay").innerHTML = stationHtml;

    // stations.forEach((sta) => {
    //   this.insertOverLayer(sta);
    // });
  }
/**
 * 
 * @param {string} msg 
 * @param {Array<Issue>} data 
 */
  signalChoosed=(msg,data)=>{
    this.mapStationAndSignal.clear();
    data&&data.forEach(issue=>{
      for(let i=0;i<issue.stations.length;i++){
        if(!this.mapStationAndSignal.has(issue.stations[i])){
          this.mapStationAndSignal.set(issue.stations[i],new StationContainSignal());
        }
        const temp=this.mapStationAndSignal.get(issue.stations[i]);
        temp.frequencies.push(issue.frequency);
        temp.maxLevel.push(issue.maxLevel[i]);
        temp.occurTime.push(issue.occurTime[i]);
        temp.reasons.push(issue.reason[i]);
        temp.information.push(issue.information[i]);
        temp.occupy.push(issue.occupy[i]);
      }
    });
    //first,we should clear the last time information
    this.hideAllCount();
    this.mapStationAndSignal.forEach((value,key)=>{
      this.updateStationSigCountInfo(key,value.frequencies.length);
    });
  }
  /**
   * 
   * @param {CenterInfo} tree 
   */
  getTree=(msg,tree)=>{
    
    this.addTree(tree);
    //this.map.clearOverLayers();
  }
  addTree(tree){
    this.map.clearOverLayers();
    if(!tree||!tree.stations){
      return;
    }
    let stationHtml = "";
      this.stationLay=tree.stations.map(station=>{
      const ovInfo = new OverlayInfo();
      ovInfo.id = station.id;
      ovInfo.lat = station.lat;
      ovInfo.lon = station.lon;
      ovInfo.stopEventPropagation = false;
      stationHtml += this.createStation(station.id,null);
      return ovInfo;
    });
    document.getElementById("station_overlay").innerHTML = stationHtml;
    this.stationLay.forEach((sta) => {
      this.map.insertOverLayer(sta);
    });
  }

  createMap(){
    const iniMap=new MapInitInfo();
    iniMap.centerPosition=new LonLat(MapConfig.centerLon,MapConfig.centerLat);
    iniMap.targetId="main_page_map_container";
    iniMap.layerVisible=false;
    iniMap.url=MapConfig.url;
    iniMap.zoom=MapConfig.zoom;
    iniMap.mousePositionTargetId="main_page_map_latlon";
    this.map=new BaseMap();
    this.map.loadMap(iniMap,this.mapLoaded);
    this.map.loadBoundary(MapConfig.kmlFileUrl,"#112CF8","transparent");
  }
  mapLoaded=()=>{
    console.log("map loded");
    // when the map first loaded, we need to updatesize,or the map will not be full of the container
    this.map.updateSize();
    this.map.removeLoadedCallBack(this.mapLoaded);
}
 
  /**
   * @Date: 2020-08-10 09:36:42
   * @Description:
   * @param {string} id
   * @return {string}
   */
  createStation = (id,level) => {
    let showLeveCircle="none";
    if(level!=null){
      showLeveCircle="block";
    }
    const imgStation = require("../../../../imgs/station/超短波一类固定站_空闲.png");
    let stationHtml = `<div class='station_on_map' id='${id}'>
        <img class="station_img"  src=${imgStation} alt=""></img>
        <div class="out_flash_with_level" style="display:${showLeveCircle}">${level}</div>
        </div>`;
    return stationHtml;
  };
  updateStationSigCountInfo(stationid,count){
    
    const stationDiv=document.getElementById(stationid);
    const levelDivs=stationDiv.getElementsByClassName("out_flash_with_level");
    //@ts-ignore
    levelDivs[0].style.display="block";
    levelDivs[0].innerHTML=count;
  }
  hideAllCount(){
    this.stationLay.forEach(element => {
      const stationDiv=document.getElementById(element.id);
    const levelDivs=stationDiv.getElementsByClassName("out_flash_with_level");
    //@ts-ignore
    levelDivs[0].style.display="none";
    });
  }

  //* @typedef {React.MouseEvent<HTMLDivElement, MouseEvent>} mouseEvent
/**@typedef {React.MouseEvent<HTMLDivElement, MouseEvent>} mouseEvent
   * @Date: 2020-08-10 23:12:40
   * @Description: 
   
   * @param {mouseEvent} event
   * @return {void} 
   */
  beginResize=(event)=>{
      this.isResizing=true;
      this.downX=event.screenX;
      this.downY=event.screenY;

  }
 /**
   * @Date: 2020-08-10 23:12:40
   * @Description: 
   * @param {MouseEvent} event
   * @return {void} 
   */
  resizeVertical=(event)=>{
      if(!this.isResizing){
          //console.log("move but not resizing");
          return;
      }

      let {mapContainerHeight,mapBottomContainerTop}=this.state;
      if (mapContainerHeight===0){
          mapContainerHeight=this.InitmapContainerHeight;
          mapBottomContainerTop=this.InitmapBottomContainerTop;
      }
      const offsetY=event.screenY-this.downY;
    //   becareful, when mouse move ,you need to cal offset from last point
      this.downY=event.screenY;
      this.setState(
          {
             mapContainerHeight:mapContainerHeight+offsetY,
            mapBottomContainerTop:mapBottomContainerTop+offsetY
    })
      console.log("offsety",offsetY,mapBottomContainerTop);
      
  }
  /**
   * @Date: 2020-08-10 23:12:40
   * @Description: 
   * @param {MouseEvent} event
   * @return {void} 
   */
  resizeEnd=(event)=>{
      this.isResizing=false;
  }
  render() {
      const {mapContainerHeight,mapBottomContainerTop}=this.state;
    return (
      <>
        <div id="main_page_map_container" 
        ref={dv=>this.mapContainer=dv}
        style={mapContainerHeight===0?null:
            {height:mapContainerHeight}}
        >
          <div id="main_page_map_latlon"></div>
        </div>
        <div className="drag_vertical" 
        onMouseDown={this.beginResize} 
        
        ></div>
        <div className="map_bottom container-fluid" 
        ref={dv=>this.bottomContainer=dv}
        style={mapBottomContainerTop===0?null:
            {top:mapBottomContainerTop,
                height:this.InitmapBottomContainerBottom-
                this.InitmapBottomContainerTop+
                this.InitmapBottomContainerTop-mapBottomContainerTop}}
        // style={mapBottomContainerTop===0?null:
        //     {top:mapBottomContainerTop,
        //         }}
        >
          <div className="row align-items-center">
            
              <div className="col-lg-4">Frequency:<span>101.725</span>MHz</div>            
            
              
              <div className="col-lg-5">Station:<span>saskatoon</span></div>
              <div className="col-lg-3">Level:<span>10</span>dBμV </div>
              
            
          </div>
          <div className="row align-items-center">
                
          <div className="col-lg-4">Reason:<span>Power Exceed</span> </div>
          <div className="col-lg-5">Information:<span >music stationcccccccc</span> </div>
          <div className="col-lg-3">Occupy:<span>10</span>% </div>
          </div>
          <div className="row align-items-center">
          <div className="col-lg-12">Time:<span>2020-10-1 13:00:00</span> </div>
          </div>
         
        </div>
        <div id="station_overlay"></div>
        <div className="corner_left_top"></div>
        <div className="corner_left_bottom"></div>
        <div className="corner_right_top"></div>
        <div className="corner_right_bottom"></div>
      </>
    );
  }
}
