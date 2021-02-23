//@ts-check
import React, { Component } from 'react';
import {renderToString} from "react-dom/server"
import Control from 'ol/control/Control'



export default class RigtTaskControl extends Control{

    constructor(opt_options){
        super(opt_options);
        /**
         * @type {HTMLElement}
         */
        this.element=opt_options.element;
        const strHtml=renderToString(<RightTaskList/>);
        opt_options.element.innerHTML+=strHtml;
    }

    updateTaskCount(currentTask){
       
       if(this.element){
           const taskCountElements=this.element.getElementsByClassName("task_count");
           taskCountElements[0].innerHTML=currentTask.Auto+"";
           taskCountElements[1].innerHTML=currentTask.Fixed+"";
           taskCountElements[2].innerHTML=currentTask.Scan+"";
       }
    }
}
class RightTaskList extends Component{

    
    render(){
        //const {currentTasks}=this.props;
        return (
            <div className="task_container" >
            <div className="single_task">
                <div className="single_task_img" style=
                {{background:"url("+require("../../../imgs/gms/task/mscan.png")+") no-repeat center"}}>
                </div>
                <div className="task_name">AUTO</div>
        <div className="task_count">0</div>
            </div>

            <div className="single_task">
                <div className="single_task_img" style=
                {{background:"url("+require("../../../imgs/gms/task/fixfq.png")+") no-repeat center"}}>
                </div>
                <div className="task_name">FIXED</div>
                <div className="task_count">0</div>
            </div>

            <div className="single_task">
            <div className="single_task_img" style=
                {{background:"url("+require("../../../imgs/gms/task/pscan.png")+") no-repeat center"}}>
                </div>
                <div className="task_name">SCAN</div>
                <div className="task_count">0</div>
            </div>
           
            </div>
        );
    }
}