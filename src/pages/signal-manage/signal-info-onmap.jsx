import React from "react";

import "./signal-info-onmap.css";
const SignalInfoOnMap=function(props){
    //console.log("xxx",props)
    /**
     * @type {SignalInfo}
     */
    const signal=props.signalInfo;
    return (
        <div className="signal_tooltip" 
        style={{position:"absolute",left:props.left+"px",top:props.top+"px"}}>
            <div>
                <span>
                    Frequency:
                </span>
                <span>{signal.freq}</span>
            </div>

            <div>
                <span>
                    Time:
                </span>
                <span>{signal.findTime}</span>
            </div>

            <div>
                <span>
                    Type:
                </span>
                <span>{signal.type}</span>
            </div>
        </div>
    );
}

export default SignalInfoOnMap;