//@ts-check
/*
 * @Description: the main navgation bar for the whole system
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-12 23:23:21
 * @LastEditors: shaomin fei
 * @LastEditTime: 2021-02-23 00:02:29
 */
import React, { useState, useRef, useEffect,useCallback } from "react";
import { withRouter } from "react-router-dom";

// config中引用了该模块，不能在这里引用config，否则会交叉引用，
//从而出现Uncaught ReferenceError: Cannot access 'RouterEnum' before initialization
//import {RouterEnum} from "../../config/config";
import { RouterEnum } from "../../config/define";
import "../../thirdparty/bootstrap/css/bootstrap.min.css";
import "./main-nav.css";
//import navBg from '@/imgs/nav-bar-bg.png'

import mainPic from "../../imgs/common/houseWorking.png";
import realTimeTaskPic from "../../imgs/gateway/new/chaoduanbo.png";
import signalManagePic from "../../imgs/gateway/new/radio.png";
import dataBaseManagePic from "../../imgs/gateway/new/dataanalyze.png";
import stationManagePic from "../../imgs/gateway/new/monitor.png";

import HeaderRight from "../header-right/header-right";


const navBarMap = {
  Home: "Home",
  RealtimeTask: "realtimeTask",
  SignalManage: "signalManage",
  DataManage: "dataManage",
  StationManage: "stationManage",
};
const navBar = [
  {
    name: navBarMap.Home,
    select: false,
    path: RouterEnum.Home,
  },
  {
    name: navBarMap.RealtimeTask,
    select: true,
    path: RouterEnum.RealTimeTask,
  },
  {
    name: navBarMap.SignalManage,
    select: false,
    path: RouterEnum.SignalManage,
  },
  {
    name: navBarMap.DataManage,
    select: false,
    path: RouterEnum.DataManage,
  },
  {
    name: navBarMap.StationManage,
    select: false,
    path: RouterEnum.StationManage,
  },
];

const MainNavgationBar = function (props) {
  //console.log(props);
  let [items, setItems] = useState(navBar);
  let [sliderPos, setSliderPos] = useState({
    left: 0,
    width: 0,
    display: "none",
    leave: false,
  });

  const iniRefInfo = {
    /***
     * @type {HTMLElement} itemSelected
     
     */
    itemSelected: null,
    /***
     * @type {HTMLElement} itemSelected
     
     */
    itemHover: null,
    /***
     * @type {HTMLElement} itemSelected
     
     */
    sliderItem: null,
  };
  const refInfo = useRef(iniRefInfo);

  const moveSliderToSelectedItem = useCallback((target) => {
    //const {itemSelected,sliderItem}=refInfo.current;
    //debugger
    const clientRect = target.getBoundingClientRect();
    setSliderPos(t=>({...t,left:clientRect.left,width:clientRect.width}));
    //sliderPos.width=itemSelected.clientWidth;
  },[]);
  const itemSelected = (name, target) => {
    let path = "";
    navBar.forEach((item) => {
      if (item.name === name) {
        item.select = true;
        path = item.path;
      } else {
        item.select = false;
      }
    });
    refInfo.current.itemSelected = target;

    items = [...navBar];
    setItems(items);
    moveSliderToSelectedItem(target);
    props.history.push(path);
  };
  const itemEnter = (target) => {
    refInfo.current.itemHover = target;
    sliderPos.display = "block";
    sliderPos.leave = false;
    setSliderPos({ ...sliderPos });
    setTimeout(() => {
      moveSliderToSelectedItem(target);
    }, 20);
  };
  const itemLeave = (target) => {
    sliderPos.display = "block";
    sliderPos.leave = true;
    moveSliderToSelectedItem(refInfo.current.itemSelected);
  };
  const getSelectByName = (name) => {
    const item = navBar.find((bar) => {
      if (bar.name === name) {
        return true;
      }
      return false;
    });
    return item ? item.select : false;
  };
  /**
   * @Date: 2020-09-01 11:30:35
   * @Description: 
   * @param {string} path 
   * @return  
   */
  const setSelectedItem = (path) => {
    //可能有几级菜单，这里只判断第一级
    
    const szTemp=path.split("/");
    let firstPath=path;
    if(szTemp.length>1){
      firstPath="/"+szTemp[1];
    }
    //console.log("xx",szTemp);
    navBar.forEach((nav) => {
      if (nav.path === firstPath) {
        nav.select = true;
      } else {
        nav.select = false;
      }
    });
  };
  const iniSelectedItem = (target, relatedPath) => {
    if (refInfo.current.itemSelected) {
      return null;
    } else {
      let firstPath=props.location.pathname;
      const szTemp=firstPath.split("/");
    
    if(szTemp.length>1){
      firstPath="/"+szTemp[1];
    }
      if (firstPath === relatedPath) {
        refInfo.current.itemSelected = target;
      }
    }
  };

  useEffect(() => {
    setSelectedItem(props.location.pathname);
    moveSliderToSelectedItem(refInfo.current.itemSelected);
    
  }, [props.location.pathname,moveSliderToSelectedItem]);
  // 通过列的嵌套来实现对列宽的再分配
  return (
    <section className="main_navbar_container container-fluid">
      <section
        className="main_navbar_slider"
        ref={(sec) => (refInfo.current.sliderItem = sec)}
        style={{
          left: Math.round(sliderPos.left).toString() + "px",
          width: Math.round(sliderPos.width).toString() + "px",
          display: sliderPos.display,
          //opacity:sliderPos.opacity,
          height: "50px",
        }}
      ></section>
      <section
        className="row"
        onMouseLeave={(event) => itemLeave(event.target)}
        onTransitionEndCapture={() => {
          if (sliderPos.leave) {
            sliderPos.display = "none";
            //sliderPos.opacity=0;
            setSliderPos({ ...sliderPos });
            
          }
        }}
      >
        <section className="col-lg-11 col_first_section">
          <section className="row">
            <section
              className={
                getSelectByName(navBarMap.Home)
                  ? "main_navbar_itembg col-lg-2"
                  : "col-lg-2"
              }
            >
              <section
                className="main_navbar_home"
                onClick={(event) => itemSelected(navBarMap.Home, event.target)}
                onMouseEnter={(event) => itemEnter(event.target)}
                //onMouseLeave={(event)=>itemLeave(event.target)}
                ref={(sec) => {
                  return iniSelectedItem(sec, RouterEnum.Home);
                }}
              >
                <img className="titleImg" src={mainPic} alt="" />
                Home
              </section>
            </section>
            <section className="col-lg-10">
              <section className="row">
              <section
                  className={
                    getSelectByName(navBarMap.StationManage)
                      ? "main_navbar_itembg col-lg-3"
                      : "col-lg-3"
                  }
                >
                  <section
                    className="main_navbar_station"
                    onClick={(event) =>
                      itemSelected(navBarMap.StationManage, event.target)
                    }
                    onMouseEnter={(event) => itemEnter(event.target)}
                    //onMouseLeave={(event)=>itemLeave(event.target)}
                    ref={(sec) => {
                      return iniSelectedItem(sec, RouterEnum.StationManage);
                    }}
                  >
                    <img className="titleImg" src={stationManagePic} alt="" />
                    Station Manage
                  </section>
                </section>
                
                <section
                  className={
                    getSelectByName(navBarMap.RealtimeTask)
                      ? "main_navbar_itembg col-lg-3"
                      : "col-lg-3"
                  }
                >
                  <section
                    className="main_navbar_realtime"
                    onClick={(event) =>
                      itemSelected(navBarMap.RealtimeTask, event.target)
                    }
                    onMouseEnter={(event) => itemEnter(event.target)}
                    //onMouseLeave={(event)=>itemLeave(event.target)}
                    ref={(sec) => {
                      return iniSelectedItem(sec, RouterEnum.RealTimeTask);
                    }}
                  >
                    <img className="titleImg" src={realTimeTaskPic} alt="" />
                    RealTime Task
                  </section>
                </section>

                <section
                  className={
                    getSelectByName(navBarMap.DataManage)
                      ? "main_navbar_itembg col-lg-3"
                      : "col-lg-3"
                  }
                >
                  <section
                    className="main_navbar_db"
                    onClick={(event) =>
                      itemSelected(navBarMap.DataManage, event.target)
                    }
                    onMouseEnter={(event) => itemEnter(event.target)}
                    //onMouseLeave={(event)=>itemLeave(event.target)}
                    ref={(sec) => {
                      return iniSelectedItem(sec, RouterEnum.DataManage);
                    }}
                  >
                    <img className="titleImg" src={dataBaseManagePic} alt="" />
                    Data Manage
                  </section>
                </section>
                
                <section
                  className={
                    getSelectByName(navBarMap.SignalManage)
                      ? "main_navbar_itembg col-lg-3"
                      : "col-lg-3"
                  }
                >
                  <section
                    className="main_navbar_signal"
                    onClick={(event) =>
                      itemSelected(navBarMap.SignalManage, event.target)
                    }
                    onMouseEnter={(event) => itemEnter(event.target)}
                    //onMouseLeave={(event)=>itemLeave(event.target)}
                    ref={(sec) => {
                      return iniSelectedItem(sec, RouterEnum.SignalManage);
                    }}
                  >
                    <img className="titleImg" src={signalManagePic} alt="" />
                    Signal Manage
                  </section>
                </section>
              

                
              </section>
            </section>
          </section>
        </section>

        <section className="col-lg-1 col_tools">
          <HeaderRight />
        </section>
      </section>
    </section>
  );
};
export default withRouter(MainNavgationBar);
