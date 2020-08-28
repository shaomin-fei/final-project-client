//@ts-check
import React from "react";

import CommonToolbar from "../../toolbars/common-toolbar";
import Spectrum,{resizeChart as resizeSpectrumChart,setData as setSpecData} from "../../../../components/graphic/spectrum/spectrum";
import LevelGraph,{resizeChart as resizeLevelChart,setData as setLevelData}  from "../../../../components/graphic/level/level";
import IQGraph,{resizeChart as resizeIQChart,setData as setIQData} from "../../../../components/graphic/IQ/iq";
import ITUGraph,{setData as setITUData} from "../../../../components/graphic/itu/itu";
import "./realtime-content.css"

export function resizeChart(){

    resizeSpectrumChart();
    resizeLevelChart();
    resizeIQChart();

}
/**
 * @Date: 2020-08-27 08:18:55
 * @Description: 
 * @param {Map<string,object>} data
 * @return {void} 
 */
export function setData(data){
    setSpecData(data);
    setLevelData(data);
    setIQData(data);
    setITUData(data);
}
const RealTimeContent =function(props){

    return (
        <>
        <CommonToolbar/>
        <div className="graph_content">
        <div className="content_up">
            <div className="content_spectrum">
                <Spectrum/>
            </div>
            <div className="content_level">
                <LevelGraph/>
            </div>
        </div>
        <div className="content_down">
            <div className="content_iq">
                <IQGraph/>
            </div>
            <div className="content_itu">
                <ITUGraph/>
            </div>
        </div>
        </div>
        </>
    );
}
export default RealTimeContent;