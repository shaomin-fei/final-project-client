/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-15 11:17:58
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 08:59:46
 */
const DeviceInfo=require("./device");
class Station{
    id="";
    name="";
    lon=0;
    lat=0;
    /**
     * net band from center to station,MB/s
     */
    netband=10;
    /**
     * realtime speed from station to center,usually test five times and calculate the average.,KB/s
     */
    netSpeed=500
    /**
    *@type {Array<DeviceInfo>}
     * 
     */
    devices=[];

}

module.exports=Station;