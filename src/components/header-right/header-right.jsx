/*
 * @Description: component which always show at the top-right corner
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 11:57:57
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-06 16:06:42
 */
import React from "react";
import { Dropdown, Menu, Button } from "antd";
import "antd/dist/antd.css";

import './header-right.css'

const HeaderRight = function (props) {
  const userName = "--";
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
      <div>
            <Button  size="large" type="primary">RealTime</Button>
          </div>
      </Menu.Item>
      <Menu.Item>
      <div>
            <Button  size="large" type="primary">Maintaince</Button>
          </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <section className="header_always_exist">
      <Dropdown overlayClassName="dropDownMenu" overlay={menueUser} placement="bottomCenter">
          <img className="header_always_exist_pic" src={require('../../imgs/user.png')} alt=""/>
      </Dropdown>

      <Dropdown overlayClassName="dropDownMenu" overlay={menueNav} placement="bottomCenter">
          <img className="header_always_exist_pic" src={require('../../imgs/toolbox.png')} alt=""/>
      </Dropdown>

      <img className="header_always_exist_pic" src={require('../../imgs/about.png')} alt=""/>
      
    </section>
  );
};

export default HeaderRight;