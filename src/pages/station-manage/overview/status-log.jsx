//@ts-check
import React,{Component} from "react";
import Axios from "axios";
import { message } from "antd";

import 'antd/dist/antd.css';
import { CloseOutlined} from "@ant-design/icons";

import StatusLogDaily from "./status-log-daily";
import StatusLogPie from "./status-log-pie";
import Station from "../../../common/data/station";
import APIConfigEnum from "../../../config/api-config";

import "./overview-map.css";
import Utils from "../../../common/utils/utils";
import withDrag from "../../../components/HOC/with-drag/with-drag";
class StatusLog extends Component{

   data={
     totalWarning:50,
     latestWarning:"2020-01-02 23:59:59",
     warningTime:100,
     workingTime:100,
     idleTime:100,
     shutdownTime:100,
     dailyWarningInfo:[
       {
         day:"2020-01-01",
        //  minute
         time:10,
       }
     ]

  }
  state={
    logData:this.data
  }
  componentDidMount(){
    this.getLogInfo()
  }
  async getLogInfo(){
    const dateNow=new Date();
    const dateHalfBefore=new Date();
    dateHalfBefore.setMonth(dateHalfBefore.getMonth()-6);
    try{
      const response=await Axios.get(APIConfigEnum.getStationLogInfo,{
        params:{
          stationName:this.props.showLogStation.name,
          startTime:Utils.dateFormat("YYYY-MM-DD HH:mm:ss",dateHalfBefore ),
          stopTime:Utils.dateFormat("YYYY-MM-DD HH:mm:ss",dateNow ),
          
        }
      });
      const data=response.data;
      this.setState({
        logData:data
      });
    }catch(e){
      message.warn(e.message);
    }
   
  }
    render(){

/**
 * @type {Station}
 */
     const showLogStation=this.props.showLogStation;
      //console.log(showLogStation);
      return (

        <div className="status_log_container" id="status_log_container_id">
          <div className="status_header" id="status_header_drag">
            <span>Status Log</span>
            <span>
              <CloseOutlined onClick={this.props.closeCallback}/>
            </span>
          </div>
          <div className="status_info">

            <div className="status_basic_info">
              <table>
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{showLogStation.name}</td>
                  </tr>

                  <tr>
                    <td>Status:</td>
                    <td>{showLogStation.status}</td>
                  </tr>

                 

                  <tr>
                    <td>Total Warning:</td>
                    <td>{this.state.logData.totalWarning}</td>
                  </tr>
                  <tr>
                    <td>Latest Warning:</td>
                    <td>{this.state.logData.latestWarning}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="status_basic_pie">
              <StatusLogPie logData={
                this.state.logData
              }/>
            </div>
           
          </div>
          <div className="status_static_daily">
            <StatusLogDaily logData={this.state.logData}/>
          </div>
        </div>
    );
    }
    
}
export default withDrag(StatusLog,"status_header_drag","status_log_container_id");
//export default StatusLog;