//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-09-01 19:08:18
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-01 19:14:48
 */
/**
 * @Date: 2020-08-18 00:34:06
 * @Description: 
 *  /**
   * @typedef {import('../../common/data/center').default} CenterInfo   
 * @param {CenterInfo} tree
 * @return {Map<string,number>} total count of [woring idle fault shutdown]
 */

import {DeviceStatusEnum} from "../../common/data/device";
export function staticCount(tree){
    let staticCountMap=new Map();
  staticCountMap=initStaticCount(staticCountMap);
  tree.stations&&tree.stations.forEach(station=>{
    switch(station.status){
      case DeviceStatusEnum.WORKING:
        increasMapData(staticCountMap,DeviceStatusEnum.WORKING);
        break;
      case DeviceStatusEnum.SHUTDOWN:
        increasMapData(staticCountMap,DeviceStatusEnum.SHUTDOWN);
        break;
      case DeviceStatusEnum.IDLE:
        increasMapData(staticCountMap,DeviceStatusEnum.IDLE);
        break;
      case DeviceStatusEnum.FAULT:
        increasMapData(staticCountMap,DeviceStatusEnum.FAULT);
        break;
      default:
        break;
    }
  });
  return staticCountMap;
}
function increasMapData(mapData,key){
    if(!mapData.has(key)){
      mapData.set(key,0);
    }
    const count= mapData.get(key)+1;
    mapData.set(key,count);
  }
  export function initStaticCount(initCount){
    if(!initCount){
      initCount=new Map();
    }
    
    initCount.set(DeviceStatusEnum.WORKING,0);
    initCount.set(DeviceStatusEnum.IDLE,0);
    initCount.set(DeviceStatusEnum.FAULT,0);
    initCount.set(DeviceStatusEnum.SHUTDOWN,0);
    return initCount;
  }