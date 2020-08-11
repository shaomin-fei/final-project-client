// @ts-check

/*
 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-07 21:52:44
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-11 01:45:25
 */

import React, { Component } from "react";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import { XYZ, Cluster, OSM, Vector as VectorSource } from "ol/source.js";
import {
  defaults as defaultControls,
  Control,
  ScaleLine,
  OverviewMap,
  MousePosition,
} from "ol/control.js";
import {
  Heatmap as HeatmapLayer,
  Tile as TileLayer,
  Vector as VectorLayer,
} from "ol/layer.js";
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
  Icon as IconStyle,
} from "ol/style.js";
import {
  fromLonLat,
  toLonLat,
  transformExtent,
  transform,
  getTransform,
} from "ol/proj.js";
import { createStringXY } from "ol/coordinate.js";
import OverlayPositioning from "ol/OverlayPositioning";
import KML from "ol/format/KML";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import OverlayInfo, { IconInfo } from "./overlay-info";
import { element } from "prop-types";

import "./station_overlay.css";

import stationOffLineImg from "../../../../imgs/station/超短波一类固定站_离线.png";

export default class CenterMap extends Component {
    state={
        mapContainerHeight:0,
        mapBottomContainerTop:0,
    }
  constructor(props) {
    super(props);
    this.map = null;
    this.iconLayer = null;
    this.isResizing=false;
    /**
     * @type {VectorSource}
     */
    this.iconLayterSrc = null;
    //this.stationSrc=null;
  }
  componentWillUnmount(){
      document.removeEventListener("mousemove",this.resizeVertical);
      document.removeEventListener("mouseup",this.resizeEnd);
      //document.removeEventListener("mouseout",this.resizeEnd);
  }
  componentDidMount() {
      this.InitmapBottomContainerTop=this.bottomContainer.getBoundingClientRect().top;
      this.InitmapBottomContainerBottom=this.bottomContainer.getBoundingClientRect().bottom;
      this.InitmapContainerHeight=this.mapContainer.clientHeight;
      document.addEventListener("mousemove",this.resizeVertical);
      document.addEventListener("mouseup",this.resizeEnd);
      //document.addEventListener("mouseout",this.resizeEnd);
    // document.onmousemove=this.resizeVertical;
    // document.onmouseup=this.resizeEnd;
    // document.onmouseout=this.resizeEnd;
    this.map = new Map({
      target: "main_page_map_container",
      layers: [
        new TileLayer({
          //默认将瓦片图层放在最底层
          zIndex: -1,
          visible: false,
          source: new OSM(),
          // source: new XYZ({
          //     wrapX: false,
          //     url: ""
          // })
        }),
      ],
      controls: defaultControls({
        zoom: false,
        attribution: false,
      }),
      view: new View({
        center: fromLonLat([111.717911, 27.415878]),
        zoom: 6.7,
        minZoom: 4,
        maxZoom: 16,
        //projection:'EPSG:3857',
      }),
    });
    this.loadBoundary("hunan.kml");

    const mousePosition = new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: "EPSG:4326",
      //projection: 'EPSG:3857',
      undefinedHTML: "",
      className: "ol-mouse-position",
      target: document.getElementById("main_page_map_latlon"),
    });
    this.map.addControl(mousePosition);

    let stationHtml = "";
    let stations = [];
    for (let i = 0; i < 10; i++) {
      const station = new OverlayInfo();
      station.id = "station_" + i.toString();
      station.lat = 26.945 + i * 0.2;
      station.lon = 111.166 + i * 0.2;
      station.stopEventPropagation = false;
      stationHtml += this.createStation(station.id);
      stations.push(station);
    }
    document.getElementById("station_overlay").innerHTML = stationHtml;

    stations.forEach((sta) => {
      this.insertOverLayer(sta);
    });

    this.iconLayterSrc =
      this.iconLayterSrc || new VectorSource({ wrapX: false });
    if (!this.iconLayer) {
      this.iconLayer = new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: this.iconLayterSrc,
      });
      this.map.addLayer(this.iconLayer);
    }

    const iconInfo = new IconInfo();
    iconInfo.lon = 112.24;
    iconInfo.lat = 27.06;
    iconInfo.text = "stationx";
    iconInfo.layer = this.iconLayer;
    iconInfo.xOffset = -20;
    iconInfo.yOffset = 25;
    iconInfo.imgUrl = stationOffLineImg;
    this.addIcon(iconInfo);
  }

  /**
   * @Date: 2020-08-10 17:57:54
   * @Description:
   * @return {VectorLayer}
   */
  createVecLayer = () => {
    const vecSrc = new VectorSource({
      wrapX: false,
    });
    const vecLayer = new VectorLayer({
      source: vecSrc,
    });
    this.map.addLayer(vecLayer);
    return vecLayer;
  };
  /**
   *
   * @param {IconInfo} iconInfo
   */
  addIcon = (iconInfo) => {
    function createStyle(url, img) {
      return new Style({
        //zIndex:1000,
        image: new IconStyle({
          anchor: [0.5, 0.5],
          crossOrigin: "anonymous",
          src: url,
          img: img,
          imgSize: img ? [img.width, img.height] : undefined,
        }),
        text: new Text({
          font: "10px sans-serif",
          text: iconInfo.text,
          textBaseline: "center",
          textAlign: "end",
          offsetX: iconInfo.xOffset,
          offsetY: iconInfo.yOffset,
          fill: new Fill({
            // transparent,do not use fill,or the text will have shadow
            color: [0, 0, 0, 0],
          }),
          stroke: new Stroke({
            color: "white",
          }),
        }),
      });
    }
    let iconFeature = new Feature({
      //geometry:new Point([0, 0]),
      geometry: new Point(fromLonLat([iconInfo.lon, iconInfo.lat])),
      name: "st1",
    });
    const styleTemp = createStyle(iconInfo.imgUrl, undefined);
    iconFeature.set("style", styleTemp);

    this.iconLayer.getSource().addFeature(iconFeature);
  };
  /**
   * @Date: 2020-08-10 09:36:42
   * @Description:
   * @param {string} id
   * @return {string}
   */
  createStation = (id) => {
    const imgStation = require("../../../../imgs/station/超短波一类固定站_空闲.png");
    let stationHtml = `<div class='station_on_map' id=${id}>
        <img class="station_img"  src=${imgStation} alt=""></img>
        <div class="out_flash_circle" ></div>
        </div>`;
    return stationHtml;
  };

  /**
     * @Date: 2020-08-10 08:31:10
     * @Description: 
    
     * @param {OverlayInfo} lay
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

  loadBoundary = (url, stroke, fill) => {
    const styles = new Style({
      // zIndex: 9999,
      fill: new Fill({
        color: fill ? fill : "transparent",
      }),
      stroke: new Stroke({
        color: stroke ? stroke : "#112CF8",
        width: 1,
      }),
    });
    const vectorSource2 = new VectorSource({
      url: "/data//hunan.kml",
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
  };

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
