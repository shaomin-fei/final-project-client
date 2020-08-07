/*
 * @Description: show the total statistic of the devices,like how many devices are working,idle,fault,shutdown
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 09:52:52
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-06 19:44:21
 */
import React from "react";

import './status.css'
const Status = function (props) {
  return (
    <section className="dev_status">
        {/* show title */}
      <section className="statusTitle">
        <section className="left_img"></section> 
        <section className="title">Device Status</section>
        <section className="right_img"></section> 
      </section>
      {/* show amount in circle button */}
      <section></section>
    </section>
  );
};

export default Status;
