/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-10 09:02:09
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-19 13:08:21
 */
export default class OverlayInfo{
    
        /*
       id
       @type {string}
       */
      id="";
       /*
       lat
       @type {number}
       */
      lat=0;
      /*
       lat
       @type {number}
       */
      lon=0;
      /*
       element
       @type {HTMLElement|null}
       */
      element=null;

      
      /*
       stopEventPropagation
       @type {boolean}
       */
      stopEventPropagation=false;
/**
 *  BOTTOM_LEFT = 'bottom-left',
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_RIGHT = 'bottom-right',
    CENTER_LEFT = 'center-left',
    CENTER_CENTER = 'center-center',
    CENTER_RIGHT = 'center-right',
    TOP_LEFT = 'top-left',
    TOP_CENTER = 'top-center',
    TOP_RIGHT = 'top-right',
 */
      position="center-center";
/**
 * extra information might be used
 * @type {object}
 */
      tag=null;

  
}

export class IconInfo{
 /*
       lat
       @type {number}
       */
      lat=0;
      /*
       lat
       @type {number}
       */
      lon=0;

      /*
       @typedef import {Vector as VectorLayer} from "ol/layer.js" VectorLayer
       @type {VectorLayer}
       */
      layer=null;
       /*
       imgUrl
       @type {string}
       */
      imgUrl="";
      /*
       text below the icon
       @type {string}
       */
      text="";
      /*
       text x offset
       @type {number}
       */
      xOffset=0;
/*
       text y offset
       @type {number}
       */
      yOffset=0;


}