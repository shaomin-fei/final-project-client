/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 16:00:14
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-16 00:37:59
 */
//const serverHttpAddr="http://192.168.0.31:3005/";
export const serverWSAddr="ws://localhost:3005/";
const  APIConfigEnum={

    // http use proxy, so don't need to specify host. data come from proxy server
    getStations:"/getStations",
    getSignalStaticByReason:"/getSignalStaticByReason",
    getTaskParams:"/getTaskParam",
    getSignalInfoByTime:"/getSignalInfoByTime",
    addSignalInfo:"/addSingnalInfo",
    updateSingnalInfo:"/updateSingnalInfo",
    deleteSingnalInfo:"/deleteSingnalInfo",
    putPowerOperation:"/powerOperation",
    getDiskUsedTrend:"/getDiskUsedTrend",
    getStorageOfEachStation:"getStorageOfEachStation",
    getFoloderInfo:"/getFoloderInfo",
    download:"/downLoad",
    stationChange:serverWSAddr,
}
export default APIConfigEnum;