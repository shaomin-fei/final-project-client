/*
 * @Description: show the total statistic of the devices,like how many devices are working,idle,fault,shutdown
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 09:52:52
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-11 10:38:18
 */
import React,{Component} from "react";
import ReactDom from "react-dom"
import { ArrowUpOutlined } from "@ant-design/icons";

import NetOrder from "./net-order";
import MainPageStyleBox from "../../../../components/mainpage-style-box/mainpage-style-box"
import "./status.css";

export default class Status extends Component {
  componentDidMount(){
    ReactDom.render(
      (<>
      <section className="status_amount mainpage_title_font_info">
      <div className="status_working ">0</div>
      <div className="status_idle">0</div>
      <div className="status_fault">0</div>
      <div className="status_shutdown">0</div>
    </section>
       
    {/* show description of each circle */}
    <section className="status_description mainpage_title_font_info">
      <div className="des_working">Working</div>
      <div className="des_idle">Idle</div>
      <div className="des_fault">Fault</div>
      <div className="des_shutdown">Shutdown</div>
    </section>
    <section className="net_condition">
      <section className="mainpage_title_font_info">
        Net Speed Last 5
        <ArrowUpOutlined />
      </section>
      <NetOrder />
    </section></>)
    ,document.getElementById("status_content")
    );
  }
  render(){
    return (
    <>
      <MainPageStyleBox width="100%" height="70%" title="Device Status" mountDivId="status_content" mountDivHeight="calc(100% - 30px)"/>
      
         {/* show amount in circle button */}
         
      </>
    )
  }
}
    
    // <section className="dev_status">
    //   {/* show title */}
    //   <section className="statusTitle">
    //     <section className="left_img"></section>
    //     <section className="title font_info">Device Status</section>
    //     <section className="right_img"></section>
    //   </section>
    //   <section className="line_separator"></section>
    //   {/* show amount in circle button */}
    //   <section className="status_amount font_info">
    //     <div className="status_working ">0</div>
    //     <div className="status_idle">0</div>
    //     <div className="status_fault">0</div>
    //     <div className="status_shutdown">0</div>
    //   </section>
    //   {/* show description of each circle */}
    //   <section className="status_description font_info">
    //     <div className="des_working">Working</div>
    //     <div className="des_idle">Idle</div>
    //     <div className="des_fault">Fault</div>
    //     <div className="des_shutdown">Shutdown</div>
    //   </section>
    //   <section className="net_condition">
    //     <section className="font_info">
    //       Net Speed Last 5
    //       <ArrowUpOutlined />
    //     </section>
    //     <NetOrder />
    //   </section>
    //   {/* show highlight corner */}
    //   <section className="corner_left_top"></section>
    //   <section className="corner_left_bottom"></section>
    //   <section className="corner_right_top"></section>
    //   <section className="corner_right_bottom"></section>
    // </section>
  //);
//};

