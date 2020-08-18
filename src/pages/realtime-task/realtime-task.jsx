//@ts-check

import React, { Component } from "react";
import { Layout,Divider} from "antd";

import LeftTree from './left-tree/left-tree';
import CenterMap from './center-map/center-map';
import "./realtime-task.css";
import MainNavgationBar from "../../components/main-nav/main-nav";



const { Header, Sider, Content } = Layout;
class RealtimeTask extends Component {
  centerMap=null;
  state = {
    collapsed: false,

   
  };
  onCollapse = (collapsed) => {
    //you can't change map size here because there is animation when collapsed is changed
    //even the state has already changed, but the animation is not over,so the width of the container 
    //still the same, then call updateSize have no effect.

    this.setState({ collapsed });
    
  };
  onCollapseEnd=()=>{
    this.centerMap&&this.centerMap.updateSize();
  }
  

  render() {
    

    return (
      <>
        <MainNavgationBar />
        <section className="line_separator_hr"></section>
        <Layout className="content_layout" onTransitionEnd={this.onCollapseEnd}>
          <Sider className="left_sider"
            collapsible
            collapsedWidth={0}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            
          >
              
              <LeftTree/>
          </Sider>
          
          <Layout className="site-layout">
          <Content
            className="site-layout-background"
          >
            <CenterMap ref={map=>this.centerMap=map}/>
          </Content>
          </Layout>
          {/* <section className="page_container">i'm realtime task page</section> */}
        </Layout>
      </>
    );
  }
}

export default RealtimeTask;
