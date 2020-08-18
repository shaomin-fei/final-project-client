//@ts-check
/*
 * @Description: define the data structure the componet will used
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-14 14:05:46
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-15 07:41:12
 */
export class LonLat{
    constructor(lon,lat){
        /** the longitude
         * @type {number}
         */
        this.lon=lon;
         /**
          * the latitude
         * @type {number}
         */
        this.lat=lat;
    }
    
}
export class MapInitInfo{
    /**
     * the center position of the map
     * @type {LonLat}
     */
    centerPosition=new LonLat(0,0);
    /**
     * the zoom level of the init map
     * @type {number}
     */
    zoom=6;
    /**the url of the map source
     * 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
     * @type {string}
     */
    url="";
    /**
     * the id of the html element which used to mount the map
     * @type {string}
     */
    targetId="";
    /**
     * @type {string}
     */
    mapType="";

    /**
     * the minimum zoom level  of the  map,depends on the map data you have
     * @type {number}
     */
    minZoom=4;
    /**
     * the maximum zoom level  of the  map.depends on the map data you have
     * @type {number}
     */
    maxZoom=16;
/**
     * the target element used to place mouse position information,if don't need that,set null
     * @type {string|null}
     */
    mousePositionTargetId=null;
/**
     * whether to show the layer at once,default is true,that means when the map loaded, you can see the man
     * @type {boolean}
     */

    layerVisible=true;
}
