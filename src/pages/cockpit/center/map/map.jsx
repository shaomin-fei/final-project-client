// @ts-check

/*


 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-07 21:52:44
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-20 02:43:31
 */

import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import pubsub from "pubsub-js";

import BaseMap from "../../../../components/map/basemap";
import { MapInitInfo, LonLat } from "../../../../components/map/datas";
import OverlayInfo from "../../../../components/map/overlay-info";
import MapConfig from "../../../../config/mapconfig";
import CmdDefineEnum from "../../../../workers/cmd-define";
import CenterInfo from "../../../../common/data/center";
import { getCurrentTree } from "../../../../workers/workers-manage";
import { Issue, SignalStaticByReason } from "../../context";
import SignalList from "./signal-list";

import "./station_overlay.css";

class StationContainSignal {
  stationid = "";
  frequencies = [];
  maxLevel = [];
  reasons = [];
  occurTime = [];
  information = [];
  occupy = [];
}

export default class CenterMap extends Component {
  /**
   * @type {Map<string,StationContainSignal>}
   */

  mapStationAndSignal = new Map();
  usePercent=false;
  state = {
    mapContainerHeight: 0,
    mapBottomContainerTop: 0,
    frequency: 0,
    stationName: "",
    level: 0,
    reason: "",
    information: "",
    occupy: 0,
    time: "",
    // "85%"
    mapHeightPercent:"85%",
    // "calc(15% - 10px)"
    mapBottomPercent:"calc(15% - 10px)",
  };
  constructor(props) {
    super(props);
    /**
     * @type {BaseMap}
     */
    this.map = null;
    this.isResizing = false;
    this.topicToken = [];
    /**
     * @type {Array<OverlayInfo>}
     */
    this.stationLay = null;
  }
  componentWillUnmount() {
    document.removeEventListener("mousemove", this.resizeVertical);
    document.removeEventListener("mouseup", this.resizeEnd);
    window.removeEventListener("resize",this.restoreMapHeighToOriginal);
    this.topicToken.forEach((token) => {
      pubsub.unsubscribe(token);
    });
    this.stationLay.forEach((sta) => {
      sta.element &&
        sta.element.removeEventListener("click", this.onStationClick);
    });
    //@ts-ignore
    this.signalListInfo &&
      this.signalListInfo.closeElement &&
      this.signalListInfo.closeElement.forEach((element) => {
        element.removeEventListener("click", this.closeSignalDetailDiag);
      });
    //@ts-ignore
    this.signalListInfo &&
      this.signalListInfo.showDetailElement &&
      this.signalListInfo.showDetailElement.forEach((element) => {
        element.removeEventListener("click", this.showSignalDetailClick);
      });
    //document.removeEventListener("mouseout",this.resizeEnd);
  }
  componentDidMount() {
    this.getInitSize();
    document.addEventListener("mousemove", this.resizeVertical);
    document.addEventListener("mouseup", this.resizeEnd);
    window.addEventListener("resize",this.restoreMapHeighToOriginal);
    this.signalListDlg = null;
    this.signalListInfo = {
      closeElement: null,
      showDetailElement: null,
    };

    this.createMap();

    const tree = getCurrentTree();
    if (tree && tree.stations) {
      this.addTree(tree);
    }
    //this.createSignalList(null);

    // put behind in order to prevent add twice.
    this.topicToken.push(
      pubsub.subscribe(CmdDefineEnum.cmdGetTree, this.getTree)
    );
    this.topicToken.push(
      pubsub.subscribe(
        CmdDefineEnum.cmdSignalByReasonChoosed,
        this.signalChoosed
      )
    );

    // let stationHtml = "";
    // let stations = [];
    // for (let i = 0; i < 10; i++) {
    //   const station = new OverlayInfo();
    //   station.id = "station_" + i.toString();
    //   station.lat = 26.945 + i * 0.2;
    //   station.lon = 111.166 + i * 0.2;
    //   station.stopEventPropagation = false;
    //   stationHtml += this.createStation(station.id);
    //   stations.push(station);
    // }
    // document.getElementById("station_overlay").innerHTML = stationHtml;

    // stations.forEach((sta) => {
    //   this.insertOverLayer(sta);
    // });
  }
  //change map and bottom height to 85% and calc(15% - 10px)
  getInitSize(){
    this.InitmapBottomContainerTop = this.bottomContainer.getBoundingClientRect().top;
    this.InitmapBottomContainerBottom = this.bottomContainer.getBoundingClientRect().bottom;
    this.InitmapContainerHeight = this.mapContainer.clientHeight;
  }
  restoreMapHeighToOriginal=()=>{
    this.usePercent=true;
    this.setState({
       // "85%"
    mapHeightPercent:"85%",
    // "calc(15% - 10px)"
    mapBottomPercent:"calc(15% - 10px)",
    })
    this.getInitSize();
  }
  /**
   *
   * @param {string} msg
   * @param {Array<Issue>} data
   */
  signalChoosed = (msg, data) => {
    this.mapStationAndSignal.clear();
    data &&
      data.forEach((issue) => {
        for (let i = 0; i < issue.stations.length; i++) {
          if (!this.mapStationAndSignal.has(issue.stations[i])) {
            this.mapStationAndSignal.set(
              issue.stations[i],
              new StationContainSignal()
            );
          }
          const temp = this.mapStationAndSignal.get(issue.stations[i]);
          temp.stationid = issue.stations[i];
          temp.frequencies.push(issue.frequency);
          temp.maxLevel.push(issue.maxLevel[i]);
          temp.occurTime.push(issue.occurTime[i]);
          temp.reasons.push(issue.reason[i]);
          temp.information.push(issue.information[i]);
          temp.occupy.push(issue.occupy[i]);
        }
      });
    //first,we should clear the last time information
    this.hideAllCount();
    console.log("handle signal clicked");

    this.mapStationAndSignal.forEach((value, key) => {
      this.updateStationSigCountInfo(key, value.frequencies.length);
    });
  };
  /**
   *
   * @param {CenterInfo} tree
   */
  getTree = (msg, tree) => {
    this.addTree(tree);
    //this.map.clearOverLayers();
  };
  addTree(tree) {
    if (this.stationLay) {
      this.stationLay.forEach((sta) => {
        this.map.removeOverLay(sta.id);
      });
      this.stationLay = null;
    }
    if (!tree || !tree.stations) {
      return;
    }
    //let stationHtml = "";
    let elemets = [];
    this.stationLay = tree.stations.map((station) => {
      const ovInfo = new OverlayInfo();
      ovInfo.id = station.id;
      ovInfo.lat = station.lat;
      ovInfo.lon = station.lon;
      ovInfo.stopEventPropagation = false;
      ovInfo.tag = {
        station: station,
      };

      //stationHtml += this.createStation(station.id,null);
      const element = this.createStation(station.id, null);
      element.addEventListener("click", this.onStationClick);
      //@ts-ignore
      element.tag = ovInfo;
      ovInfo.element = element;
      elemets.push(element);
      return ovInfo;
    });
    //document.getElementById("station_overlay").innerHTML = stationHtml;
    elemets.forEach((ele) => {
      document.getElementById("station_overlay").append(ele);
    });
    this.stationLay.forEach((sta) => {
      this.map.insertOverLayer(sta);
    });
  }

  createMap() {
    const iniMap = new MapInitInfo();
    iniMap.centerPosition = new LonLat(
      MapConfig.centerLon,
      MapConfig.centerLat
    );
    iniMap.targetId = "main_page_map_container";
    iniMap.layerVisible = false;
    iniMap.url = MapConfig.url;
    iniMap.zoom = MapConfig.zoom;
    iniMap.mousePositionTargetId = "main_page_map_latlon";
    //iniMap.onMapClick=this.onMapClick;
    this.map = new BaseMap();
    this.map.loadMap(iniMap, this.mapLoaded);
    this.map.loadBoundary(MapConfig.kmlFileUrl, "#112CF8", "transparent");
  }
  getStationNameById(stationid) {
    let stationName = "";
    if (this.stationLay) {
      const temp = this.stationLay.find((sta) => {
        return sta.id === stationid;
      });
      if (temp) {
        stationName = temp.tag.station.name;
      }
      return stationName;
    }
  }
  showSignalDetailClick = (stationid, frequency, event) => {
    if (!this.mapStationAndSignal.has(stationid)) {
      return;
    }
    console.log("stationid,frequency", stationid, frequency);
    const info = this.mapStationAndSignal.get(stationid);
    let index = 0;
    let isFind = false;
    if (info && info.frequencies) {
      for (let freq of info.frequencies) {
        if (freq === frequency) {
          isFind = true;
          break;
        }
        index++;
      }
    }
    if (isFind) {
      const stationName = this.getStationNameById(stationid);
      const data = {
        frequency: info.frequencies[index],
        stationName: stationName,
        level: info.maxLevel[index],
        reason: info.reasons[index],
        information: info.information[index],
        occupy: info.occupy[index],
        time: info.occurTime[index],
      };
      this.setState(data);
    }
  };
  closeSignalDetailDiag = () => {
    console.log("closesignaldetail");
    this.map.removeOverLay("mainpage_station_signal_list");
    this.signalListDlg = null;
    this.signalListInfo.closeElement = null;
    this.signalListInfo.showDetailElement = null;
  };
  /**
   *
   * @param {MouseEvent} event
   */
  onStationClick = (event) => {
    /**
     *@type {OverlayInfo}
     */
    //@ts-ignore
    let station = event.target.tag;
    if (!station) {
      //@ts-ignore
      station = event.target.parentElement.tag;
    }
    if (!station) {
      return;
    }
    if (
      !this.mapStationAndSignal ||
      !this.mapStationAndSignal.has(station.id)
    ) {
      return;
    }
    let html = this.createSignalList(
      this.mapStationAndSignal.get(station.id).frequencies
    );
    const ovInfo = new OverlayInfo();
    ovInfo.id = "mainpage_station_signal_list";
    ovInfo.lat = station.lat;
    ovInfo.lon = station.lon;
    ovInfo.stopEventPropagation = false;
    ovInfo.position = "top-left";
    document.getElementById("signal_list_overlay").innerHTML = html;
    this.map.insertOverLayer(ovInfo);
    const mapRects = document
      .getElementById("main_page_map_container")
      .getBoundingClientRect();
    const element = document.getElementById("mainpage_station_signal_list");
    ovInfo.element = element;
    const diagWidth = ovInfo.element.clientWidth;

    const close = element.getElementsByClassName("mainpage_signal_list_close");
    //@ts-ignore
    this.signalListInfo.closeElement = close;
    if (close.length > 0) {
      close[0].addEventListener("click", this.closeSignalDetailDiag);
    }
    const detail = element.getElementsByClassName(
      "mainpage_singal_lisg_detail"
    );
    //@ts-ignore
    this.signalListInfo.showDetailElement = detail;
    if (detail.length > 0) {
      for (let i = 0; i < detail.length; i++) {
        detail[i].addEventListener(
          "click",
          this.showSignalDetailClick.bind(
            this,
            station.id,
            this.mapStationAndSignal.get(station.id).frequencies[i]
          )
        );
      }
    }
    //console.log("close,detail",close,detail);
    //@ts-ignore
    if (event.layerX + diagWidth > mapRects.width) {
      //need to be paned
      //@ts-ignore
      this.map.panMap(event.layerX + diagWidth - mapRects.width + 20, 0);
    }
    //console.log(station,event);
  };

  mapLoaded = () => {
    console.log("map loded");
    // when the map first loaded, we need to updatesize,or the map will not be full of the container
    this.map.updateSize();
    this.map.removeLoadedCallBack(this.mapLoaded);
  };
  /**
   * @Date: 2020-08-19 08:37:02
   * @Description:
   * @param {Array<number>} signals
   * @return {string}
   */
  createSignalList(signals) {
    if (this.signalListDlg) {
      this.map.removeOverLay("mainpage_station_signal_list");
      this.signalListDlg = null;
      this.signalListInfo.closeElement = null;
      this.signalListInfo.showDetailElement = null;
    }
    //this way cann't bind event,because element have not render,the event have not mount to dom
    this.signalListDlg = (
      <SignalList
        id={"mainpage_station_signal_list"}
        signals={signals}
      ></SignalList>
    );
    // let HelloMessage = React.createFactory(SignalList)
    // const tt=ReactDOMServer.renderToString(HelloMessage({signals:signals,callBack:{closeSignalDetailDiag,showSignalDetailClick}}))
    // console.log("tt",tt);
    let signalList = ReactDOMServer.renderToString(this.signalListDlg);

    //console.log(signalList);
    return signalList;
  }

  /**
   * @Date: 2020-08-10 09:36:42
   * @Description:
   * @param {string} id
   * @return {Element}
   */
  // createStation = (id,level) => {
  //   let showLeveCircle="none";
  //   if(level!=null){
  //     showLeveCircle="block";
  //   }
  //   const imgStation = require("../../../../imgs/station/超短波一类固定站_空闲.png");
  //   let stationHtml = `<div class='station_on_map' id='${id}' onclick=${this.onMapClick}>
  //       <img class="station_img"  src=${imgStation} alt=""></img>
  //       <div class="out_flash_with_level" style="display:${showLeveCircle}">${level}</div>
  //       </div>`;
  //   return stationHtml;
  // };
  createStation = (id, level) => {
    let showLeveCircle = "none";
    if (level != null) {
      showLeveCircle = "block";
    }
    const imgStation = require("../../../../imgs/station/超短波一类固定站_空闲.png");
    let stationHtml = `<div class="station_on_map" id="${id}">
        <img class="station_img"  src=${imgStation} alt=""></img>
        <div class="out_flash_with_level" style="display:${showLeveCircle}">${level}</div>
        </div>`;

    const element = document.createElement("div");
    element.innerHTML = stationHtml;

    return element.firstElementChild;
  };
  updateStationSigCountInfo(stationid, count, value) {
    const stationDiv = document.getElementById(stationid);
    const levelDivs = stationDiv.getElementsByClassName("out_flash_with_level");
    //@ts-ignore
    levelDivs[0].style.display = "block";
    levelDivs[0].innerHTML = count;
  }
  hideAllCount() {
    this.stationLay &&
      this.stationLay.forEach((element) => {
        const stationDiv = document.getElementById(element.id);
        const levelDivs = stationDiv.getElementsByClassName(
          "out_flash_with_level"
        );
        //@ts-ignore
        levelDivs[0].style.display = "none";
      });
  }

  //* @typedef {React.MouseEvent<HTMLDivElement, MouseEvent>} mouseEvent
  /**@typedef {React.MouseEvent<HTMLDivElement, MouseEvent>} mouseEvent
   * @Date: 2020-08-10 23:12:40
   * @Description: 
   
   * @param {mouseEvent} event
   * @return {void} 
   */
  beginResize = (event) => {
    this.usePercent=false;
    this.isResizing = true;
    this.getInitSize();
    this.downX = event.screenX;
    this.downY = event.screenY;
  };
  /**
   * @Date: 2020-08-10 23:12:40
   * @Description:
   * @param {MouseEvent} event
   * @return {void}
   */
  resizeVertical = (event) => {
    if (!this.isResizing) {
      //console.log("move but not resizing");
      return;
    }

    let { mapContainerHeight, mapBottomContainerTop } = this.state;
    if (mapContainerHeight === 0) {
      mapContainerHeight = this.InitmapContainerHeight;
      mapBottomContainerTop = this.InitmapBottomContainerTop;
    }
    const offsetY = event.screenY - this.downY;
    //   becareful, when mouse move ,you need to cal offset from last point
    this.downY = event.screenY;
    this.setState({
      mapContainerHeight: mapContainerHeight + offsetY,
      mapBottomContainerTop: mapBottomContainerTop + offsetY,
    });
    console.log("offsety", offsetY, mapBottomContainerTop);
  };
  /**
   * @Date: 2020-08-10 23:12:40
   * @Description:
   * @param {MouseEvent} event
   * @return {void}
   */
  resizeEnd = (event) => {
    this.isResizing = false;
  };
  render() {
    //console.log("render map.jsx");
    const { mapContainerHeight, mapBottomContainerTop } = this.state;
    return (
      <>
        <div
          id="main_page_map_container"
          ref={(dv) => (this.mapContainer = dv)}
          style={
            !this.usePercent?(mapContainerHeight === 0 ? null : { height: mapContainerHeight }):
            {height:this.state.mapHeightPercent}
          }
        >
          <div id="main_page_map_latlon"></div>
        </div>
        <div className="drag_vertical" onMouseDown={this.beginResize}></div>
        <div
          className="map_bottom container-fluid"
          ref={(dv) => (this.bottomContainer = dv)}
          style={
            !this.usePercent?(mapBottomContainerTop === 0
              ? null
              : {
                  top: mapBottomContainerTop,
                  height:
                    this.InitmapBottomContainerBottom -
                    this.InitmapBottomContainerTop +
                    this.InitmapBottomContainerTop -
                    mapBottomContainerTop,
                }):{height:this.state.mapBottomPercent}
            
          }
          // style={mapBottomContainerTop===0?null:
          //     {top:mapBottomContainerTop,
          //         }}
        >
          <div className="row align-items-center">
            <div className="col-lg-4">
              Frequency:<span>{this.state.frequency}</span>MHz
            </div>

            <div className="col-lg-5">
              Station:<span>{this.state.stationName}</span>
            </div>
            <div className="col-lg-3">
              Level:<span>{this.state.level}</span>dBμV{" "}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-4">
              Reason:<span>{this.state.reason}</span>{" "}
            </div>
            <div className="col-lg-5">
              Information:<span>{this.state.information}</span>{" "}
            </div>
            <div className="col-lg-3">
              Occupy:<span>{this.state.occupy}</span>%{" "}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-12">
              Time:<span>{this.state.time}</span>{" "}
            </div>
          </div>
        </div>
        <div id="station_overlay"></div>
        <div id="signal_list_overlay"></div>
        <div className="corner_left_top"></div>
        <div className="corner_left_bottom"></div>
        <div className="corner_right_top"></div>
        <div className="corner_right_bottom"></div>
      </>
    );
  }
}
