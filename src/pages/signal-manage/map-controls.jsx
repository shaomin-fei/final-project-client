//@ts-check
import React,{useEffect} from "react";
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
let stopTime=Utils.dateFormat(dateFormat, new Date())+" 23:59:59";
let startTime=Utils.dateFormat(
    dateFormat,
    new Date(Date.now() - 24 * 30 * 3600 * 1000)
  )+" 00:00:00";
export const QueryByDateFC=function(props){

    const queryCallback= props.queryCallback;
    useEffect(()=>{
        // query when component did mount
        queryCallback(startTime,stopTime);
    },[queryCallback]);
    //const dataRange=useRef();
    function handleQueryBtnClick(){
        props.queryCallback(startTime,stopTime);
    }
    function onChange(dates, dateStrings) {
        startTime=dateStrings[0]+" 00:00:00";
        stopTime=dateStrings[1]+" 23:59:59";
        // console.log('From: ', dates[0], ', to: ', dates[1]);
        // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      }
    return (
        <div id={props.id}>
        <span className="date_picker">
        <RangePicker 
        
        bordered={false}
        onChange={onChange}
        defaultValue={[
            moment(startTime, dateFormat),
            moment(
              stopTime,
              dateFormat
            ),
          ]}
        />
        </span>
        <span className="button_query_by_date">
        <Button  type="primary" shape="circle" icon={<SearchOutlined />}
        onClick={e=>handleQueryBtnClick()}
        />
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