//@ts-check
import React,{Component} from "react";

import 'antd/dist/antd.css';
import { CloseOutlined} from "@ant-design/icons";

import StatusLogDaily from "./status-log-daily";
import StatusLogPie from "./status-log-pie";

import "./overview-map.css";
class StatusLog extends Component{

    render(){
      return (

        <div className="status_log_container" >
          <div className="status_header">
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
                    <td>Virtual-001</td>
                  </tr>

                  <tr>
                    <td>Status:</td>
                    <td>Normal</td>
                  </tr>

                 

                  <tr>
                    <td>Total Warning:</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td>Latest Warning:</td>
                    <td>2020-01-02 23:59:59</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="status_basic_pie">
              <StatusLogPie/>
            </div>
           
          </div>
          <div className="status_static_daily">
            <StatusLogDaily/>
          </div>
        </div>
    );
    }
    
}
export default StatusLog;