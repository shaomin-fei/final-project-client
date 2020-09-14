//@ts-check
/*
 * @Description: component which always show at the top-right corner
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 11:57:57
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-13 18:10:53
 */
import React from "react";
import {Link} from "react-router-dom"
import { Dropdown, Menu, Button } from "antd";
import "antd/dist/antd.css";

import { RouterEnum } from "../../config/define";
import mainPic from "../../imgs/common/houseWorking.png";
import realTimeTaskPic from "../../imgs/gateway/new/chaoduanbo.png";
import signalManagePic from "../../imgs/gateway/new/radio.png";
import dataBaseManagePic from "../../imgs/gateway/new/dataanalyze.png";
import stationManagePic from "../../imgs/gateway/new/monitor.png";
import './header-right.css'

const HeaderRight = function (props) {
  const userName = "--";
  function showAbout(){

  }
  const menueUser = (
    <Menu >
      <Menu.Item>
        <label className="userInfo" htmlFor="">User:{userName}</label>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        
          <div>
            <Button size="large" type="primary"> FeedBack</Button>
          </div>
        
      </Menu.Item>
      <Menu.Item>
        
          <div>
            <Button  size="large" type="primary">LogOut</Button>
          </div>
        
      </Menu.Item>
    </Menu>
  );

  const menueNav = (
    <Menu >
      <Menu.Item>
      <div >
        <Link to={RouterEnum.Home}>
            <span style={{float:"left",marginLeft:"10px"}}>
              <img src={mainPic} style={{width:"24px",height:"24px"}} alt=""/>
            </span>
            <span style={{float:"left", marginLeft:"20px",color:"white",fontWeight:"bold"}}>
              Home
            </span>
            <div style={{clear:"both",border:"1px solid #ccc",height:"1px"}}></div>
        </Link>
      </div>
      </Menu.Item>
      <Menu.Item>
      <div >
        <Link to={RouterEnum.StationManage}>
            <span style={{float:"left",marginLeft:"10px"}}>
              <img src={stationManagePic} style={{width:"24px",height:"24px"}} alt=""/>
            </span>
            <span style={{float:"left", marginLeft:"20px",color:"white",fontWeight:"bold"}}>
              Station Manage
            </span>
            <div style={{clear:"both",border:"1px solid #ccc",height:"1px"}}></div>
        </Link>
      </div>
      </Menu.Item>
      <Menu.Item>
      <div >
        <Link to={RouterEnum.RealTimeTask}>
            <span style={{float:"left",marginLeft:"10px"}}>
              <img src={realTimeTaskPic} style={{width:"24px",height:"24px"}} alt=""/>
            </span>
            <span style={{float:"left", marginLeft:"20px",color:"white",fontWeight:"bold"}}>
              RealTime Task
            </span>
            <div style={{clear:"both",border:"1px solid #ccc",height:"1px"}}></div>
        </Link>
      </div>
      </Menu.Item>
      <Menu.Item>
      <div >
        <Link to={RouterEnum.DataManage}>
            <span style={{float:"left",marginLeft:"10px"}}>
              <img src={dataBaseManagePic} style={{width:"24px",height:"24px"}} alt=""/>
            </span>
            <span style={{float:"left", marginLeft:"20px",color:"white",fontWeight:"bold"}}>
              Data Manage
            </span>
            <div style={{clear:"both",border:"1px solid #ccc",height:"1px"}}></div>
        </Link>
      </div>
      </Menu.Item>
      <Menu.Item>
      <div >
        <Link to={RouterEnum.SignalManage}>
            <span style={{float:"left",marginLeft:"10px"}}>
              <img src={signalManagePic} style={{width:"24px",height:"24px"}} alt=""/>
            </span>
            <span style={{float:"left", marginLeft:"20px",color:"white",fontWeight:"bold"}}>
              Signal Manage
            </span>
            <div style={{clear:"both",border:"1px solid #ccc",height:"1px"}}></div>
        </Link>
      </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <section className="header_always_exist">
      {/* <Dropdown 
      overlayClassName="dropDownMenu" overlay={menueUser} placement="bottomCenter">
        
          <img  className="header_always_exist_pic" src={require('../../imgs/user.png')} alt=""/>
      </Dropdown> */}

      <Dropdown overlayClassName="dropDownMenu" overlay={menueNav} placement="bottomCenter">
           {/* @ts-ignore */}
          <img className="header_always_exist_pic" src={require('../../imgs/toolbox.png')} alt=""/>
      </Dropdown>

      <img className="header_always_exist_pic" 
      //  @ts-ignore
      src={require('../../imgs/about.png')} alt=""
      onClick={showAbout}
      />
      
    </section>
  );
};

export default HeaderRight;