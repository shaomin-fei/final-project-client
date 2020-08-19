/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 16:00:14
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-18 20:49:55
 */
//const serverHttpAddr="http://192.168.0.31:3005/";
const serverWSAddr="ws://192.168.0.31:3005/";
const  APIConfigEnum={

    // http use proxy, so don't need to specify host. data come from proxy server
    getStations:"/getStations",
    getSignalStaticByReason:"/getSignalStaticByReason",
    stationChange:serverWSAddr,
}
export default APIConfigEnum;