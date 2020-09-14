//@ts-check
import React from "react";
import { renderToString } from "react-dom/server";

import CenterInfo from "../../common/data/center";
import Station from "../../common/data/station";
import MapWithStationStatus from "../component/map-with-station-status/map-with-station-status";
import StationWithStatus from "../../components/station-with-status/station-with-status";
import {QueryByDateControl,
    WarningLegendControl,
    SignalFormControl,
    QueryByDateFC,
    WarningLegendFC,
    } from "./map-controls";
import './signal-manage.css'
import SignalFormFC from "./signal-form";

const MapControls=[
    {
        element:null,
        props:{ id:"control_signal_queryByDate",},
        component:(props={})=>{return <QueryByDateFC {...props}/>},
    },
    {
        element:null,
        props:{id:"control_signal_legend",},
        component:(props={})=>{return <WarningLegendFC {...props}/>},
    },
    {

        element:null,
        props:{ id:"control_signal_form",tree:null},
        component:(props={})=>{return <SignalFormFC {...props}/>}
    }
];
export default class MapSignalManage extends MapWithStationStatus{
    constructor(props){
        super(props,{controls:MapControls});
    }
    componentDidMount(){
        super.componentDidMount();
        MapControls.forEach(ctl=>{
            ctl.element=document.getElementById(ctl.props.id);
        })
        this.addAllControls();
    }
    addAllControls(){
        const controls=[];
        controls.push(new QueryByDateControl({element:MapControls[0].element}));
        controls.push(new WarningLegendControl({element:MapControls[1].element}));
        controls.push(new SignalFormControl({element:MapControls[2].element}));
        this.addControls(controls);
    }
     /**
   * convert data to the form that tree can show
   * @param {CenterInfo} center
   */
  treeUpdate(message, center){
      super.treeUpdate(message,center);
      MapControls[2].props.tree=center;
      this.setState({controls:[...MapControls]});
  }
    /**
     * override, do nothing in this page.
     * @param {*} e 
     * @param {*} staOverlay 
     */
    handleStationClick(e, staOverlay) {

    }
     /**
   * @Date: 2020-09-11 14:13:02
   * @Description: 
   * @param {Station} station
   * @return {string} 
   */
    getStationHtml(station){
       const newStation={...station};
       newStation.alwaysNotShowCircle=true;
        const strStation = renderToString(
          <StationWithStatus station={newStation} />
        );
        return strStation;
      }
     
      render(){
          /**
           * @type {Array<{id:string,element:HTMLElement,component:function,props:{}}>}
           */
          const controls=this.state.controls;
        return (
        <>
        <div id={this.mapContainerID} ref={(dv) => (this.mapContainer = dv)}>
          <div id={this.mousePositionContainerID}></div>
          {/* controls section */}
          {
            controls.map(control=>{
                  return (
                    control.component(control.props)
                    //   <div key={control.id} id={control.id} ref={dv=>control.element=dv}>
                    //       {control.component(control.props)}
                    //   </div>
                  )
              })
          }     
        </div>

        <div id={this.stationOverlayId}></div>
      </>
      )
      }
}