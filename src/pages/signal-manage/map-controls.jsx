//@ts-check
import React from "react";
import Control from 'ol/control/Control';
import 'antd/dist/antd.css';
import { DatePicker,Button } from 'antd';
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';

import Utils from "../../common/utils/utils";
const { RangePicker } = DatePicker;

export class QueryByDateControl extends Control{
    constructor(opt_options){
        super(opt_options);
        /**
         * @type {HTMLElement}
         */
        this.element=opt_options.element;
    }
}
export class WarningLegendControl extends Control{
    constructor(opt_options){
        super(opt_options);
        /**
         * @type {HTMLElement}
         */
        this.element=opt_options.element;
    }
}
export class SignalFormControl extends Control{
    constructor(opt_options){
        super(opt_options);
        /**
         * @type {HTMLElement}
         */
        this.element=opt_options.element;
    }
}
const dateFormat = "YYYY/MM/DD";
export const QueryByDateFC=function(props){

    return (
        <div id={props.id}>
        <span className="date_picker">
        <RangePicker 
        
        bordered={false}
        defaultValue={[
            moment(Utils.dateFormat(dateFormat, new Date()), dateFormat),
            moment(
              Utils.dateFormat(
                dateFormat,
                new Date(Date.now() - 24 * 7 * 3600 * 1000)
              ),
              dateFormat
            ),
          ]}
        />
        </span>
        <span className="button_query_by_date">
        <Button  type="primary" shape="circle" icon={<SearchOutlined />}/>
        </span>
        </div>
        
    );
}
export const WarningLegendFC=function(props){
    return (
        <div id={props.id}>
        <div>
            <span></span>
            <span>Legal</span>
        </div>
        <div>
            <span></span>
            <span>Unknown</span>
        </div>
        <div>
            <span></span>
            <span>Illegal</span>
        </div>
        </div>
    );
}