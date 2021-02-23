import React from "react";

import "./station-tooltip.css"
const StationTooltip=function(props){
   
    const station=props.station;
    const left=props.left;
    const top=props.top;
    return (
        <div className="station_tooltip"
        style={{left:left+"px",top:top+"px"}}
        >
            {station.name}
        </div>
    );
}
export default StationTooltip;