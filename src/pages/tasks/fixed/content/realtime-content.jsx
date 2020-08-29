//@ts-check
import React from "react";

import CommonToolbar from "../../toolbars/common-toolbar";
import Spectrum,{reset as resetSpectrum, resizeChart as resizeSpectrumChart,setData as setSpecData} from "../../../../components/graphic/spectrum/spectrum";
import LevelGraph,{reset as resetLevel, resizeChart as resizeLevelChart,setData as setLevelData}  from "../../../../components/graphic/level/level";
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
 * @return  
 */
export function setData(data){
    //const dateStart=Date.now();
    setSpecData(data);
    //const spec=Date.now();
    //console.log("sepc time cost ",spec-dateStart);
    setLevelData(data);
    //const level=Date.now();
    //console.log("level time cost ",level-spec);
    setIQData(data);
    //const iq=Date.now();
    //console.log("iq time cost ",iq-level);
    setITUData(data);
    //const itu=Date.now();
    //console.log("itu time cost ",itu-iq);
    //const dateEnd=Date.now();
    //console.log("total time cost ",dateEnd-dateStart);
}
export function resetChart(){
    resetSpectrum();
    resetLevel();
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