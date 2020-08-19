//@ts-check
import React, { Component } from 'react';


import "./center-map.css";
import BaseMap from '../../../components/map/basemap';
import {MapInitInfo,LonLat} from '../../../components/map/datas';
import MapConfig from "../../../config/mapconfig"
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
        initInfo.centerPosition=new LonLat(MapConfig.centerLon,MapConfig.centerLat);
        initInfo.targetId=this.mapContainerID;
        initInfo.url=MapConfig.url;
        initInfo.zoom=MapConfig.zoom;
        initInfo.layerVisible=true;
        initInfo.mousePositionTargetId=this.mousePositionContainerID;
        this.centerMap.loadMap(initInfo,this.mapLoaded);
        this.centerMap.loadBoundary(MapConfig.kmlFileUrl,"rgba(17,44,248,0.3)","transparent");
        
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