//@ts-check
import React from "react";
import { renderToString } from "react-dom/server";
import Axios from "axios";
import {message} from "antd";
import "antd/dist/antd.css"

import {LonLat} from "../../components/map/datas";
import APIConfigEnum from "../../config/api-config";
import CenterInfo from "../../common/data/center";
import Station from "../../common/data/station";
import MapWithStationStatus from "../component/map-with-station-status/map-with-station-status";
import StationWithStatus from "../../components/station-with-status/station-with-status";
import {QueryByDateControl,
    WarningLegendControl,
    SignalFormControl,
    QueryByDateFC,
    WarningLegendFC,
    } from "./map-controls";
import './signal-manage.css'
import SignalFormFC from "./signal-form";
import { SignalInfo } from "./signal-operation";
import { transform } from "ol/proj";
import { MapBrowserEvent } from "ol";
import SignalInfoOnMap from "./signal-info-onmap";
import StationTooltip from "../component/map-with-station-status/station-tooltip";

const queryCondition={
  startTime:"",
  stopTime:"",
}
const MapControls=[
    {
        element:null,
        props:{ id:"control_signal_queryByDate",queryCallback:null},
        component:(props={})=>{return <QueryByDateFC key={props.id} {...props}/>},
    },
    {
        element:null,
        props:{id:"control_signal_legend",},
        component:(props={})=>{return <WarningLegendFC key={props.id} {...props}/>},
    },
    {

        element:null,
        props:{ 
          id:"control_signal_form",
            /**
           * @type {CenterInfo}
           */
          tree:null,
          signalChooseCallback:null,
          saveSignalInfoCallback:null,
          selectedSignalOnMap:null,
          deleteSignal:null,
          signals:null},
        component:(props={})=>{return <SignalFormFC key={props.id} {...props}/>}
    }
];
export default class MapSignalManage extends MapWithStationStatus{
    constructor(props){
        super(props,{controls:MapControls,
          showSignalInfo:false,
          mouseOverSignal:null,
          
        });
        MapControls[0].props.queryCallback=this.querySignalByDate;
        MapControls[2].props.signalChooseCallback=this.signalChooseCallback;
        MapControls[2].props.saveSignalInfoCallback=this.saveSignalInfoCallback;
        MapControls[2].props.deleteSignal=this.deleteSignal;
       this.signalLayer=null;
       this.cursor_="pointer";
       this.signalLineLayer=[];
       this.selectedSignal=null;
       this.signalToolTipBox=null;
       this.mouseLeft=0;
       this.mouseTop=0;
    }
    componentWillUnmount(){
      this.removeEventListener("pointermove",this.mapMouseMove);
       this.removeEventListener("click",this.mapMouseClick);
       super.componentWillUnmount();
    }
    componentDidMount(){
        super.componentDidMount();
       
        MapControls.forEach(ctl=>{
            ctl.element=document.getElementById(ctl.props.id);
        })
       this.addEventListener("pointermove",this.mapMouseMove);
       this.addEventListener("click",this.mapMouseClick);
        this.addAllControls();
    }

    deleteSignal=async (signal)=>{
      try{
        const response=await Axios.delete(APIConfigEnum.deleteSingnalInfo,{
          params:{
            key:signal.key
          }
        });
      const data=response.data;
      if(data.success){
        message.info("delete success");
        this.querySignalByDate(queryCondition.startTime,queryCondition.stopTime);
      }else{
        message.warn("delete fail "+data.errorInfo?data.errorInfo:"");
      }
      }catch(e){
        message.info("delete fail "+e.message);
      }
     
    }
    /**
 * @Date: 2020-09-14 18:54:18
 * @Description: 
 * @param {string} cmd "add" or "update" 
 * @param {SignalInfo} signalInfo
 * @return 
 */
saveSignalInfoCallback=async (cmd,signalInfo,resultCallback)=>{
  let response=null;
  try{
    if(cmd==="add"){
      response=await Axios.post(APIConfigEnum.addSignalInfo,{
        data:signalInfo
      });
    }else if(cmd==="update"){
      response = await Axios.put(APIConfigEnum.updateSingnalInfo,{
        data:signalInfo
      });
      
    }
    const data=response.data;
    if(data.success){
      this.querySignalByDate(queryCondition.startTime,queryCondition.stopTime);
      resultCallback(true,"Operation Success");
    }else{
      resultCallback(false,"Operation Fail "+data.errorInfo?data.errorInfo:"");
    }
    
    
  }catch(e){
    resultCallback(false,"Operation Fail,See log for more information");
    console.warn("Operation Fail,See log for more information",e);
  }
  
}
    /**
     * 
     * @param {SignalInfo} signal 
     * @param {string} cmd "unSelected" "selected"
     */
    signalChooseCallback=(signal,cmd="selected")=>{
      this.selectedSignal=signal;
      this.clearSignalLine();
      if(!signal.station||signal.station.length===0){
        return;
      }
      if(cmd==="selected"){
        const staPosition=this.getStationPositionByName(signal.station);
        const featureLonLat=new LonLat(signal.Lon,signal.Lat);
        this.connectSignalAndStation(featureLonLat,staPosition);
      }
      
      
    }
    /**
     * 
     * @param {MapBrowserEvent} evt 
     */
    mapMouseMove=(evt)=>{
      let map = evt.map;
      const pixel=map.getEventPixel(evt.originalEvent);
      this.mouseLeft=pixel[0]+5;
      this.mouseTop=pixel[1]+15;
      if (this.cursor_) {
       
        let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        let element = evt.map.getTargetElement();
        //@ts-ignore
        if (this.moveElement&&(!feature||!feature.tag)){
          //move from feature
          //console.log("xxx",feature);
          this.moveElement.style.cursor = this.previousCursor_;
          this.previousCursor_ = undefined;
          this.moveElement=null;
          this.setState({showSignalInfo:false});
        }
        if (feature) {
          //@ts-ignore
          if(!feature.tag){
            return;
          }
          
          if (element.style.cursor != this.cursor_) {
            this.previousCursor_ = element.style.cursor;
            element.style.cursor = this.cursor_;
            this.moveElement=element;
            // @ts-ignore
            this.setState({showSignalInfo:true,mouseOverSignal:feature.tag});
            //console.log("move evt change",evt);
          }
        } else if (this.previousCursor_ !== undefined) {
          element.style.cursor = this.previousCursor_;
          this.previousCursor_ = undefined;
          this.moveElement=null;
          this.setState({showSignalInfo:false});
         
          //console.log("move evt restore",evt);
        }
      }
    }

    /**
     * 
     * @param {MapBrowserEvent} evt 
     */
    mapMouseClick=(evt)=>{
      var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        if (feature) {
          //@ts-ignore
          if(!feature.tag){
            return;
          }
          this.clearSignalLine();
          const featureLonLat=transform(evt.coordinate,'EPSG:3857', 'EPSG:4326');
          const featurePosition=new LonLat(featureLonLat[0],featureLonLat[1]);
         
          /**
           * @type {SignalInfo}
           * 
           */
          //@ts-ignore
          const tag=feature.tag;
          /**
           * @type {Array<string>}
           */
          const stations=tag.station;
          this.selectedSignal=tag;
          //notify signal-form to change the selection row
          MapControls[2].props.selectedSignalOnMap=tag;
          this.setState({controls:[...MapControls]});
          const stasPosition=this.getStationPositionByName(stations);
         this.connectSignalAndStation(featurePosition,stasPosition);
        }
    }
    getStationPositionByName=(stations)=>{
      const center=MapControls[2].props.tree;
      const stasPosition=[];
      stations.forEach(sta=>{
        const findSta=center.stations.find(staIncenter=>{
          return staIncenter.name===sta;
        });
        if(findSta){
          stasPosition.push(new LonLat(findSta.lon,findSta.lat));
        }
      });
      return stasPosition;
    }
    connectSignalAndStation=(featurePosition,stasPosition)=>{
      stasPosition.forEach(sta=>{
        const lay=this.centerMap.addLine(featurePosition,sta,3,"#2A3B54");
        this.signalLineLayer.push(lay);
      });
      // this.centerMap.panTo(featurePosition);

    }

    clearSignalLine=()=>{
      this.signalLineLayer.forEach(lay=>{
        this.centerMap.removeLayer(lay);
      });
    }
    querySignalByDate= async (startTime,stopTime)=>{
      queryCondition.startTime=startTime;
      queryCondition.stopTime=stopTime;
       try{
        const response=await Axios.get(APIConfigEnum.getSignalInfoByTime,{
          params:{startTime,stopTime}
        });
        const signals=response.data;
        MapControls[2].props.signals=signals;
        

        // draw signal info on the map
        this.drawSignalsOnMap(signals);
        //if current selected signal is not null,draw line
        if(this.selectedSignal){
          //replace beacuse some info is updated;
          this.selectedSignal=signals.find(sig=>{
            return sig.key===this.selectedSignal.key;
          });
          if(this.selectedSignal){//this signal might be deleted
            this.signalChooseCallback(this.selectedSignal);
          }
          
        }
        this.setState({controls:[...MapControls]});
       }catch(e){
         message.error("get signal from server error:"+e.message);
       }
      
    }
    /**
     * @Date: 2020-09-13 23:11:41
     * @Description: 
     * @param {Array<SignalInfo>}  signals
     * @return {void} 
     */
    drawSignalsOnMap=(signals)=>{
      this.clearSignalsOnMap();
      this.clearSignalLine();
      if(!signals||signals.length===0){
        return;
      }
      signals.forEach(signal=>{
        //@ts-ignore
        let point=new LonLat(signal.Lon*1,signal.Lat*1);
        let color="green";
        if(signal.type==="Illegal"){
          color="red";
        }else if(signal.type==="Unknown"){
          color="gray";
        }
        this.signalLayer=this.centerMap.addCircle(point,this.signalLayer,signal,8000,color);
      })
    }
    clearSignalsOnMap=()=>{
      if(this.signalLayer){
        this.centerMap.removeLayer(this.signalLayer);
        this.signalLayer=null;
      }
      
    }
    addAllControls(){
        const controls=[];
        controls.push(new QueryByDateControl({element:MapControls[0].element}));
        controls.push(new WarningLegendControl({element:MapControls[1].element}));
        controls.push(new SignalFormControl({element:MapControls[2].element}));
        this.addControls(controls);
    }
     /**
   * convert data to the form that tree can show
   * @param {CenterInfo} center
   */
  treeUpdate(message, center){
      super.treeUpdate(message,center);
      MapControls[2].props.tree=center;
      this.setState({controls:[...MapControls]});
  }
    /**
     * override, do nothing in this page.
     * @param {*} e 
     * @param {*} staOverlay 
     */
    handleStationClick(e, staOverlay) {

    }
     /**
   * @Date: 2020-09-11 14:13:02
   * @Description: 
   * @param {Station} station
   * @return {string} 
   */
    getStationHtml(station){
       const newStation={...station};
       newStation.alwaysNotShowCircle=true;
        const strStation = renderToString(
          <StationWithStatus station={newStation} />
        );
        return strStation;
      }
     
      render(){
          /**
           * @type {Array<{id:string,element:HTMLElement,component:function,props:{}}>}
           */
          const controls=this.state.controls;
        return (
        <>
        <div id={this.mapContainerID} ref={(dv) => (this.mapContainer = dv)}>
          <div id={this.mousePositionContainerID}></div>
          {/* controls section */}
          {
            controls.map(control=>{
                  return (
                    control.component(control.props)
                    //   <div key={control.id} id={control.id} ref={dv=>control.element=dv}>
                    //       {control.component(control.props)}
                    //   </div>
                  )
              })
          }     
        </div>

        <div id={this.stationOverlayId}></div>
        {this.state.showSignalInfo?<SignalInfoOnMap
        left={this.mouseLeft}
        top={this.mouseTop}
        // @ts-ignore
         signalInfo={this.state.mouseOverSignal}/>:null}

      {this.state.showStatonTooltip?
        <StationTooltip 
        left={this.stationTooltipLeft}
        top={this.stationTooltipTop}
        station={this.state.stationtoShowTip}
        />:null}
      </>
      )
      }
}