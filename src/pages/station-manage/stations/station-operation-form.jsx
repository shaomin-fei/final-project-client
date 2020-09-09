import React from "react";
import 'antd/dist/antd.css';
import { CloseOutlined} from "@ant-design/icons";

import "./stations.css";


const StationOperationForm =function(props){

    return (
        <div id="station-operation-form">
            <div className="station-operation-form-head">
                <span>Add Station</span>
                <span>
                    <CloseOutlined onClick={props.closeCallback}/>
                </span>
                
            </div>
            <div className="line_separator_hr"></div>
           
            <div className="station-operation-form-body">
            {props.children}
            </div>
            
        </div>
    );
}
export default StationOperationForm;