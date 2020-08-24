import React, { Component } from "react";

import Station from "../../common/data/station";
import "./station-with-status.css";
import statioIdle from "../../imgs/station/超短波一类固定站_空闲.png";
import statioOffline from "../../imgs/station//超短波一类固定站_离线.png";
import StatusEnum from "../../common/data/status";

export default class StationWithStatus extends Component {
  render() {
    /**
     * @type {Station}
     */
    const station = this.props.station;
    let img = statioIdle;
    let showCircle = true;
    let circleColor = "green";
    if (station.status === StatusEnum.SHUTDOWN) {
      img = statioOffline;
      showCircle = false;
    } else if (station.status === StatusEnum.IDLE) {
      showCircle = false;
    } else if (station.status === StatusEnum.FAULT) {
      circleColor = "red";
    }
    return (<div className="station_on_map" id={station.id}>
      <img className="station_img" src={img} alt=""></img>
      {showCircle ? (
        <div className="out_flash_circle" style={{ backgroundColor: circleColor }}></div>
      ) : null}
    </div>);
  }
}
