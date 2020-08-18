//@ts-check
import React, { Component } from 'react';


import "./center-map.css";
import BaseMap from '../../../components/map/basemap';
import {MapInitInfo,LonLat} from '../../../components/map/datas';
class CenterMap extends Component {
    constructor(props){
        super(props);
        /**
         * @type {BaseMap}
         */
        this.centerMap=null;
        // it maybe repeat if we let the basemap to decide the id
        this.mapContainerID="realtime_center_map_container";
        this.mousePositionContainerID="realtime_mouseposition_container";
        this.mapContainer=null;

    }
   
    componentDidMount(){
        this.centerMap=new BaseMap();
        const initInfo=new MapInitInfo();
        initInfo.centerPosition=new LonLat(111.717911,27.415878);
        initInfo.targetId=this.mapContainerID;
        initInfo.url="http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0";
        initInfo.zoom=6.7;
        initInfo.layerVisible=true;
        initInfo.mousePositionTargetId=this.mousePositionContainerID;
        this.centerMap.loadMap(initInfo,this.mapLoaded);
        this.centerMap.loadBoundary("/data/hunan.kml","rgba(17,44,248,0.3)","transparent");
        
    }

    updateSize(){
        this.centerMap&&this.centerMap.updateSize();
    }
    mapLoaded=()=>{
        console.log("map loded");
        // when the map first loaded, we need to updatesize,or the map will not be full of the container
        this.centerMap.updateSize();
        this.centerMap.removeLoadedCallBack(this.mapLoaded);
    }
    componentWillUnmount(){
       this.centerMap&&this.centerMap.dispose();
    }
    render() {
        return (
            
            <div id={this.mapContainerID} ref={dv=>this.mapContainer=dv}>
               <div id={this.mousePositionContainerID}></div>
            </div>
            
            
        );
    }
}

export default CenterMap;