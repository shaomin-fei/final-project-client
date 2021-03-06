//@ts-check
import React from "react";
import Control from 'ol/control/Control';

import { DeviceStatusEnum} from "../../../common/data/device";

import "./overview-map.css";
import { Component } from "react";

export class NetLegend extends Control{
    constructor(opt_options){
        super(opt_options);
        /**
         * @type {HTMLElement}
         */
        this.element=opt_options.element;
        const strHtml=`<div id=net_legend>
        <span>
        <span id=net_fast></span>
        <label>Fast</label>
        </span>
        <span>
        <span id=net_medium></span>
        <label>Medium</label>
        </span>
        <span>
        <span id=net_low></span>
        <label>Low</label>
        </span>
        <span>
        <span id=net_offline></span>
        <label>Offline</label>
        </span>
        </div>`;
        opt_options.element.innerHTML=strHtml;
    }
}

export class StatusInfoControl extends Control{
    constructor(opt_options){
        super(opt_options);
        /**
         * @type {HTMLElement}
         */
        this.element=opt_options.element;

        const strHtml=`<div id=status_control>
        <div id=status_total_info>
        <div>Total</div>
        <div id=status_total_count>0</div>
        </div>

        <div id=status_work_info>
        <div>Working</div>
        <div id=status_work_count>0</div>
        </div>

        <div id=status_idle_info>
        <div>Idle</div>
        <div id=status_idle_count>0</div>
        </div>

        <div id=status_fault_info>
        <div>Warning</div>
        <div id=status_fault_count>0</div>
        </div>

        <div id=status_shutdown_info>
        <div>Shutdown</div>
        <div id=status_shutdown_count>0</div>
        </div>
        </div>`;
        opt_options.element.innerHTML+=strHtml;
    }
    /**
     * 
     * @param {Map<string,number>} mapStatus 
     */
    setStatus(mapStatus){
        if(!mapStatus){
            return;
        }
        if(mapStatus.size===0){
            return;
        }
        const working=mapStatus.get(DeviceStatusEnum.WORKING);
        const idle=mapStatus.get(DeviceStatusEnum.IDLE);
        const fault=mapStatus.get(DeviceStatusEnum.FAULT);
        const shutdown=mapStatus.get(DeviceStatusEnum.SHUTDOWN);
        document.getElementById("status_work_count").innerHTML=working+"";
        document.getElementById("status_idle_count").innerHTML=idle+"";
        document.getElementById("status_fault_count").innerHTML=fault+"";
        document.getElementById("status_shutdown_count").innerHTML=shutdown+"";
        document.getElementById("status_total_count").innerHTML=working+idle+fault+shutdown+"";

    }
}

export class WarnningControl extends Control{
    constructor(opt_options){
        super(opt_options);
        this.element=opt_options.element;
        // const htmls=`<div id=warnning_container>
        // <div id=warnning_fatal_info>
        // <div>Fatal</div>
        // <div id=fatal_count>0</div>
        // </div>

        // <div id=warnning_serious_info>
        // <div>Serious</div>
        // <div id=serious_count>0</div>
        // </div>

        // <div id=warnning_general_info>
        // <div>General</div>
        // <div id=general_count>0</div>
        // </div>
        // </div>`;
        // opt_options.element.innerHTML+=htmls;
        // document.getElementById("warnning_fatal_info").onclick=e=>this.handleClick("fatal",e);
        // document.getElementById("warnning_serious_info").onclick=e=>this.handleClick("serious",e);
        // document.getElementById("warnning_general_info").onclick=e=>this.handleClick("general",e);
    }
    // handleClick=(cmd,e)=>{
        
    // }
    
}
export class WarningControlComponent extends Component{

    container=null;
     handleClick=(cmd,e)=>{
         this.props.handleWarningClick([cmd]);
        // switch(cmd){
        //     case "fatal":
        //         break;
        //     case "serious":
        //         break;
        //     case "general":
        //         break;
        //     default:
        //     break;
        // }
    }
    render(){
        const staticByWarningLevel=this.props.staticByWarningLevel;
        return (
            <>
            <div id="warnning_container" ref={dv=>this.container=dv}>
        <div id="warnning_fatal_info" onClick={e=>this.handleClick("Fatal",e)}>
        <div>Fatal</div>
        <div id="fatal_count">{staticByWarningLevel?staticByWarningLevel.Fatal:0}</div>
        </div>

        <div id="warnning_serious_info" onClick={e=>this.handleClick("Serious",e)}>
        <div>Serious</div>
        <div id="serious_count">{staticByWarningLevel?staticByWarningLevel.Serious:0}</div>
        </div>

        <div id="warnning_general_info" onClick={e=>this.handleClick("General",e)}>
        <div>General</div>
        <div id="general_count">{staticByWarningLevel?staticByWarningLevel.General:0}</div>
        </div>
        </div>
            </>
        );
    }
}

