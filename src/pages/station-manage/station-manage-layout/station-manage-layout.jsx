//@ts-check
import React, { Component } from "react";
import {withRouter} from "react-router-dom"
import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import {Link} from "react-router-dom"


import MainNavgationBar from "../../../components/main-nav/main-nav";
import "./station-manage-layout.css";

const { Sider, Content } = Layout;
const { SubMenu, Item } = Menu;
// class SubItemInfo{
//     key="";
//     icon=null;
//     title="";
//     /**
//      * @type {Array<MenuItemInfo>}
//      */
//     itemInfo=[];
// }
class MenuItemInfo {
  key = "";
  title = "";
  path = "";
  icon = null;
  /**
   * @type {Array<MenuItemInfo>}
   */
  subItem = [];
  constructor(key, title, icon, path = "", subItem = []) {
    this.key = key;
    this.title = title;
    this.icon = icon;
    this.path = path;
    this.subItem = subItem;
  }
}
class StationManageLayout extends Component {
  state = {
    collapsed: false,
  };
  MenueItems = [
    new MenuItemInfo(
        "overView", 
        "Overview", 
        <PieChartOutlined />,
        "/stationmanage"),
    new MenuItemInfo(
      "stationManage",
      "Station Manage",
      <DesktopOutlined />,
      "/stationmanage/stations"
    ),
  ];
  componentDidMount() {}
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  /**
   * @Date: 2020-09-01 10:12:35
   * @Description:
   * @param {MenuItemInfo}  item
   * @return {JSX.Element}
   */
  getMenuItem = (item) => {
    if (item.subItem && item.subItem.length > 0) {
      return (
        <SubMenu key={item.key} icon={item.icon} title={item.title}>
          {item.subItem.map((sub) => {
            return (
               
              <Item key={sub.key} icon={sub.icon}>
              <Link to={item.path}>{item.title}</Link>
              </Item>
              
            );
          })}
        </SubMenu>
      );
    } else {
      return (
          
        <Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.title}</Link>
        </Item>
        
      );
    }
  };
  render() {

    console.log(this.props);
    const path=this.props.location.pathname;
    const current=this.MenueItems.find((item)=>{
        return item.path===path;
    });
    let defaultSelectKey="";
    if(current){
        defaultSelectKey=current.key;
    }
    return (
      <>
      <MainNavgationBar />
        <section className="line_separator_hr"></section>
        <Layout className="station_manage_layout">
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            {/* <div className="logo"></div> */}
            <Menu theme="dark" defaultSelectedKeys={[defaultSelectKey]} mode="inline">
              {this.MenueItems.map((item) => {
                return this.getMenuItem(item);
              })}
            </Menu>
          </Sider>
          <Layout>
            <Content className="station_manage_content">               
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </>
    );
  }
}

export default withRouter(StationManageLayout);
