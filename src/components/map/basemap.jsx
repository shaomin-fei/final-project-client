//@ts-check
import React,{Component} from "react"
import 'ol/ol.css';
import {Map, View,Overlay, Feature} from 'ol';

import {fromLonLat} from 'ol/proj';
import {
  
  Tile as TileLayer,
  Vector as VectorLayer,
} from "ol/layer.js";
import { createStringXY } from "ol/coordinate.js";
import KML from "ol/format/KML";
import {
  
  Fill,
  Stroke,
  Style,
  
} from "ol/style.js";

import {
  defaults as defaultControls,
  Control,
  ScaleLine,
  OverviewMap,
  MousePosition,
} from "ol/control.js";

import {MapInitInfo,LonLat} from "./datas"
import { XYZ, Cluster, OSM, Vector as VectorSource } from "ol/source.js";

import "./basemap.css"
import OverLayInfo from "./overlay-info"
import LineString from "ol/geom/LineString";

export default class BaseMap extends Component{

    constructor(props){
      super(props);
      /**
       * @type {Map}
       */
      this.map=null;
      /**
       * @type {MapInitInfo}
       */
      //this.overLayLayers=[];
      this.iniInfo=null;
      
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
       this.iniInfo=initInfo;
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
          }).extend(initInfo.controls),
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
      initInfo.onMapClick&&this.map.addEventListener("click",initInfo.onMapClick);
      
    }
    /**
     * 
     * @param {Array<Control>} controls 
     */
    addControls(controls){
      this.map&&controls.forEach(element => {
        this.map.addControl(element);
      });
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
     * @Date: 2020-09-01 14:53:44
     * @Description: 
     * @param {LonLat} startPointLonLat
     * @param {LonLat} stopPointLonLat
     * @return {VectorLayer}
     */
    addLine(startPointLonLat,stopPointLonLat,color="green"){
      const feature=new Feature(
        new LineString(
          [
            fromLonLat([startPointLonLat.lon,startPointLonLat.lat]),
            fromLonLat([stopPointLonLat.lon,stopPointLonLat.lat]),
          ],
        )
      );
      const vecLayer=new VectorLayer({
        source:new VectorSource({
          features:[feature]
        }),
        style:new Style({
          stroke:new Stroke({
            width:2,
            color:color,
            lineDash:[6]
          }),
          fill:new Fill({
          color:"transparent"
          })
        }),
        
      });
      this.map&&this.map.addLayer(vecLayer);
      return vecLayer;
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
        //@ts-ignore
        positioning: lay.position,

  
        insertFirst: false,
      });
      this.map.addOverlay(overLay);
    };
    clearOverLayers=()=>{
      this.map.getOverlays().clear();
    }
    panMap(newScreenOffsetX,newScreenOffsetY){
      const centerPix=this.map.getPixelFromCoordinate(this.map.getView().getCenter());
      centerPix[0]=centerPix[0]+newScreenOffsetX;
      centerPix[1]=centerPix[1]+newScreenOffsetY;
      const centerCor=this.map.getCoordinateFromPixel(centerPix);
      this.map.getView().setCenter(centerCor);
      
    }
    removeOverLay(id){
      const temp=this.map.getOverlayById(id);
      temp&&this.map.removeOverlay(temp);
    }
    getPixelFromCoordinate([lon,lat]){

      return this.map.getPixelFromCoordinate([lon,lat]);
    }
    getCoordinateFromPixel([x,y]){
      return this.map.getCoordinateFromPixel([x,y]);
    }
   
    componentDidMount(){
      //this.loadMousePosition(this.mousePositionContainerID);
    }
    componentWillUnmount(){
      window.removeEventListener("resize",this.updateSize);
      this.iniInfo&&this.iniInfo.onMapClick&&this.map.removeEventListener("click",this.iniInfo.onMapClick);
    }

    render(){
        return (
            <>
            
            </>
        );
    }
}