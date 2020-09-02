//@ts-check
import React, { Component } from "react";

import {Switch,Route} from "react-router-dom"

import OverView from "./overview/overview";
import Stations from "./stations/stations";

import "./station-manage.css";


class StationManage extends Component {

  componentDidMount() {}
 
  
  render() {
    return (
        <>
         
      <Switch>
       <Route path="/stationmanage/stations" component={Stations}></Route>
        <Route component={OverView}></Route>
      </Switch>
      </>
    );
  }
}

export default StationManage;
