//@ts-check
import React,{Component} from "react"
import 'ol/ol.css';
import {Map, View,Overlay} from 'ol';
import OverlayPositioning from "ol/OverlayPositioning";
import {fromLonLat} from 'ol/proj';
import {
  Heatmap as HeatmapLayer,
  Tile as TileLayer,
  Vector as VectorLayer,
} from "ol/layer.js";
import { createStringXY } from "ol/coordinate.js";
import KML from "ol/format/KML";
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
  Icon as IconStyle,
} from "ol/style.js";

import {
  defaults as defaultControls,
  Control,
  ScaleLine,
  OverviewMap,
  MousePosition,
} from "ol/control.js";

import {MapInitInfo} from "./datas"
import { XYZ, Cluster, OSM, Vector as VectorSource } from "ol/source.js";

import "./basemap.css"
import OverLayInfo from "./overlay-info"

export default class BaseMap extends Component{

    constructor(props){
      super(props);
      /**
       * @type {Map}
       */
      this.map=null;
      /**
       * @type {Array<Overlay>}
       */
      //this.overLayLayers=[];
      
      
    }
    dispose(){
      if(this.map){
        this.map.dispose();
        this.map=null;
      }
    }
    
    /**
     * @Date: 2020-08-14 14:43:36
     * @Description: 
     * @param {MapInitInfo}  initInfo
     * @return {void} 
     */
    loadMap(initInfo,loadedCallBack){
       this.dispose();
       const source=new XYZ({
        wrapX:false,
        url:initInfo.url,

      });
      // trigger when til load completely
      //source.on("tileloadend",loadedCallBack);
       this.map=new Map({
         target:initInfo.targetId,
         layers:[
           new TileLayer({
             visible:initInfo.layerVisible,
             zIndex:-1,
            //  minResolution:initInfo.minResolution,
            //  maxResolution:initInfo.maxResolution,
             source:source,
           }),
          ],
          controls:defaultControls({
            attribution:false,
            zoom:false,
          }),
          view:new View({
            center:fromLonLat([initInfo.centerPosition.lon,initInfo.centerPosition.lat]),
            maxZoom:initInfo.maxZoom,
            minZoom:initInfo.minZoom,
            zoom:initInfo.zoom,
            // projection:'EPSG:4326',

          }),
       });
      //  each time the map render complete will trigger this event,
      // if you just want to know if the map is loaded at firs time ,
      //you need to call removeLoadedCallBack after you received the event firstly.
      window.addEventListener("resize",this.updateSize);
      this.map.on("rendercomplete",loadedCallBack);

      initInfo.mousePositionTargetId&&this.loadMousePosition(initInfo.mousePositionTargetId);
      
    }
    
    removeLoadedCallBack(loadCallBack){
      if(loadCallBack){
        this.map.removeEventListener("rendercomplete",loadCallBack);
      }
    }
    updateSize(){
      this.map&&this.map.updateSize();
    }
    loadMousePosition(targetId){
      const mousePosition = new MousePosition({
        coordinateFormat: createStringXY(6),
        projection: "EPSG:4326",
        //projection: 'EPSG:3857',
        undefinedHTML: "",
        className: "ol-mouse-position",
        target: targetId,
      });
      this.map.addControl(mousePosition);
    }
    /**
     * @Date: 2020-08-15 07:33:23
     * @Description: 
     * @param {string} url
     * @param {string} stroke  stroke color
     * @param {string} fill    fill color
     * @return {void} 
     */
    loadBoundary(url,stroke="transparent",fill="#112CF8"){
      const styles = new Style({
        // zIndex: 9999,
        fill: new Fill({
          color: fill ,
        }),
        stroke: new Stroke({
          color: stroke ,
          width: 1,
        }),
      });
      const vectorSource2 = new VectorSource({
        url: url,
        format: new KML({
          // dataProjection: 'EPSG:4326',
          // featureProjection: 'EPSG:3857',
          extractStyles: false, //至关重要
        }),
        // projection: 'EPSG:3857'
      });
      const kmlLayer = new VectorLayer({
        // zIndex: 9999,
        source: vectorSource2,
        style: styles,
      });
      this.map.addLayer(kmlLayer);
      this.boundary = kmlLayer;
    }
    /**
     * @Date: 2020-08-15 09:02:25
     * @Description: 
     * @param {OverLayInfo} lay
     * @return {void} 
     */
    insertOverLayer = (lay) => {
      let overLay = new Overlay({
        id: lay.id,
        position: fromLonLat([lay.lon, lay.lat]),
        stopEvent: lay.stopEventPropagation || false,
        element: lay.element || document.getElementById(lay.id),
        positioning: OverlayPositioning.CENTER_CENTER,
  
        insertFirst: false,
      });
      this.map.addOverlay(overLay);
    };
  
    componentDidMount(){
      //this.loadMousePosition(this.mousePositionContainerID);
    }
    componentWillUnmount(){
      window.removeEventListener("resize",this.updateSize);
    }

    render(){
        return (
            <>
            
            </>
        );
    }
}