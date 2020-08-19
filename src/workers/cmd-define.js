/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 19:35:17
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-18 23:55:48
 */
const CmdDefineEnum={
    // msg from workers-manage.js
    cmdIniWorker:"ini",
    cmdGetTree:"getTree",
    cmdCurrentTaskChange:"currentTaskChange",
    cmdGetSignalByReason:"getSignalByReason",
    cmdStop:"stop",
    // msg from signal-chart.jsx
    // this msg send to the centermap of cockpit ,to tell the map show level of the stations
    cmdSignalByReasonChoosed:"cmdSignalByReasonChoosed",
}
export default CmdDefineEnum;