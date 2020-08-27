import React from "react";

import CommonToolbar from "../../toolbars/common-toolbar";
import Spectrum,{resizeChart as resizeSpectrumChart} from "../../../../components/graphic/spectrum/spectrum";
import LevelGraph,{resizeChart as resizeLevelChart}  from "../../../../components/graphic/level/level";
import IQGraph,{resizeChart as resizeIQChart} from "../../../../components/graphic/IQ/iq";
import ITUGraph from "../../../../components/graphic/itu/itu";
import "./realtime-content.css"

export function resizeChart(){

    resizeSpectrumChart();
    resizeLevelChart();
    resizeIQChart();

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