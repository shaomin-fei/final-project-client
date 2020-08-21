/*
 * @Description: the frame component is used for cockpit page
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-11 07:57:25
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-20 16:18:41
 */

import React from "react";
import PropTypes from "prop-types";
import {withRouter} from 'react-router-dom'

import "./mainpage-style-box.css";

/**
 * @Date: 2020-08-11 08:06:15
 * @Description:
 * @param {object}  props
 * @param {string|number}  props.height
 * @param {string}  props.title
 * @return {type}
 */

 
const MainPageStyleBox = function (props) {
  const { height, width, title,mountDivId ,mountDivHeight,linkedPath} = props;
  return (
    <section className="outter" style={{height:height, width:width}}>
      <section className="frame_title" onClick={()=>linkedPath&&props.history.push(linkedPath)}>
        <section className="left_img"></section>
        <section className="title mainpage_title_font_info">{title}</section>
        <section className="right_img"></section>
      </section>
      <section className="line_separator"></section>
      <section id={mountDivId} style={{height:mountDivHeight}}>
        {props.children}
      </section>
      
      {/* show highlight corner */}
      <section className="corner_left_top"></section>
      <section className="corner_left_bottom"></section>
      <section className="corner_right_top"></section>
      <section className="corner_right_bottom"></section>
    </section>
  );
};
MainPageStyleBox.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  text: PropTypes.string,
  linkedPath:PropTypes.string,
//   挂载点div的id，真正的内容挂载在该div下面
  mountDivId:PropTypes.string.isRequired,
  mountDivHeight:PropTypes.string.isRequired,
};
export default withRouter(MainPageStyleBox);
