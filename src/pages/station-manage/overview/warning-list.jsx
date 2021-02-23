//@ts-check
import React,{useCallback} from "react";
import "antd/dist/antd.css";
import { CloseOutlined } from "@ant-design/icons";
import { DatePicker, TreeSelect,Button,Table,message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import Axios from "axios";

import  APIConfigEnum from "../../../config/api-config";
import Utils from "../../../common/utils/utils";
import StationTreeSelect from "../../component/station-tree-select/station-tree-select";

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD HH:mm:ss";

const warningLevelTree = [
  {
    title: "All",
    value: "All",
    key: "All",
    children: [
      {
        title: "Fatal",
        value: "Fatal",
        key: "Fatal",
      },
      {
        title: "Serious",
        value: "Serious",
        key: "Serious",
      },
      {
        title: "General",
        value: "General",
        key: "General",
      },
    ],
  },
];

const warningHandleTree = [
  {
    title: "All",
    value: "All",
    key: "All",
    children: [
      {
        title: "Handled",
        value: "Handled",
        key: "Handled",
      },
      {
        title: "Unhandled",
        value: "Unhandled",
        key: "Unhandled",
      },
    ],
  },
];

export class WarningQueryCondition {
  warningLevel = ["Fatal"]; //defaul to query all
  startTime = Utils.dateFormat(
    dateFormat,
    new Date(Date.now() - 24 * 30 * 3600 * 1000)
  )
  endTime = Utils.dateFormat(dateFormat, new Date());
  type = ["Unhandled"]; //query those warnings haven't been handled
  stationsName=[];
  constructor({
    warningLevel = ["Fatal"],
  } = {}) {
    this.warningLevel = warningLevel;
    
    
  }
}

 let currentSelectedStations=[];
 let currentStartTime="";
 let currentStopTime="";
const WarningList = function (props) {
  /**
   * @type {WarningQueryCondition}
   */
  const warningQueryCondition = props.warningQueryCondition;
  const { warningLevel, type } = warningQueryCondition;
 
  const [treeValues, setTreeValue] = useState({
    levelValue: warningLevel ? warningLevel : ["Fatal"],
    typeValue: type?type:["Unhandled"],
    stationsName:[],
    tableData:[]
  });
 
  const handleQueryByCondition=useCallback(
    async (condition,callback)=>{
      try{
        const result= await Axios.get(APIConfigEnum.getEnvWarning,{
          params:condition
        });
        let data=result.data;
        if(!data){
          data=[];
        }
        data=data.map(d=>{
          d.needCancel={
            needCancel:d.needCancel,
            cancelKey:d.key,
            loading:false,
          };
          return d;
        });
        if(callback){
          callback(data);
        }else{
          setTreeValue(t=>({...t,tableData:data,levelValue:condition.warningLevel}) );
        }
      }catch(e){
         message.warn("get warning list error"+e.message);
      }
    }
  ,[]);
  useEffect(() => {
    //when triggered from click map icon
    warningQueryCondition.stationsName=currentSelectedStations;
    warningQueryCondition.startTime=currentStartTime?currentStartTime:warningQueryCondition.startTime;
    warningQueryCondition.endTime=currentStopTime?currentStopTime:warningQueryCondition.endTime;
    //warningQueryCondition.type=treeValues.typeValue;
    handleQueryByCondition(warningQueryCondition);
    
    //console.log("did mound")
  }, [warningQueryCondition,handleQueryByCondition]);
  
  const levelTreeProps = {
    size: "small",
    treeData: warningLevelTree,
    value: treeValues.levelValue,
    onChange: (value) => onChange("warningLevel", value),
    treeCheckable: true,
    maxTagCount: 1,
    maxTagPlaceholder: () => {
      return <label style={
        {color:"black",
        fontSize:"0.5rem",
        //marginLeft:"-3px",
        display:"inline-block",
        width:"10px"}
      }>...</label>;
    },
    //showCheckedStrategy: SHOW_PARENT,
    treeDefaultExpandAll: true,
    placeholder: "Please select",
    style: {
      width: "140px",
    },
  };

  const typeTreeProps = {
    size: "small",
    treeDefaultExpandAll: true,
    treeData: warningHandleTree,
    value: treeValues.typeValue,
    onChange: (value) => onChange("type", value),
    treeCheckable: true,
    
    maxTagCount: 1,
    maxTagPlaceholder: () => {
      return <label style={
        {color:"black",
        fontSize:"0.5rem",
        //marginLeft:"-3px",
        display:"inline-block",
        width:"10px"}
      }>...</label>;
    },
    //showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "160px",
      //backgroundColor:"rgba(5, 23, 61, 0.8)",
      //color:"white",
    },
  };

  const columns=[
     
    {
      title:"Station",
      dataIndex:"Station",
      key:"Station"
  },
  {
      title:"StartTime",
      dataIndex:"StartTime",
      key:"StartTime"
  },
  {
      title:"EndTime",
      dataIndex:"EndTime",
      key:"EndTime"
  },
  {
    title:"Level",
    dataIndex:"warningLevel",
    key:"warningLevel"
},
  {
      title:"Reason",
      dataIndex:"Reason",
      key:"Reason"
  },
  {
      title:"Cancel",
      dataIndex:"needCancel",
      key:"needCancel",
      render:cancelInfo=>(
        cancelInfo.needCancel?<Button loading={cancelInfo.loading} type="primary" onClick={e=>handleCancelWarning(cancelInfo.cancelKey)}>Cancel</Button>:null
      )
  },
  
];

async function handleCancelWarning(cancelKey){
  //show loding circle
  const tabData=treeValues.tableData;
  const canceledData=tabData.find(tb=>{
        return tb.key===cancelKey;
      });
      if(canceledData){
        canceledData.needCancel.loading=true;
      }
      setTreeValue({...treeValues,tableData:[...tabData]});
      ////
  try{
    const response=await Axios.put(APIConfigEnum.cancelEnvironWarning,{
      key:cancelKey
    });
    const data=response.data;
    if(data.success){
      message.info("Operation Success");
      handleQuery();
      props.cancelWarningCallback();
      
      // const tabData=treeValues.tableData;
      // const canceledData=tabData.find(tb=>{
      //   return tb.key===cancelKey;
      // });
      // if(canceledData){
      //   canceledData.needCancel.needCancel=0;
      // }
      // setTreeValue({...treeValues,tableData:[...tabData]});
    }
  }catch(e){
    message.warn(e.message);
  }
  
}
  function onChange(cmd, value) {
    if (cmd === "warningLevel") {
      setTreeValue({ ...treeValues, levelValue: value });
    } else if (cmd === "type") {
      setTreeValue({ ...treeValues, typeValue: value });
    }
  }
  /**
   * @Date: 2020-09-16 09:40:14
   * @Description: 
   * @param {Array<string>} selectedStations
   * @return {void} 
   */
  const stationTreeSelectedChanged=useCallback(
    (selectedStations)=>{
      currentSelectedStations=selectedStations;
      warningQueryCondition.stationsName=selectedStations;
      warningQueryCondition.type=treeValues.typeValue;
    },[warningQueryCondition,treeValues.typeValue]
  );
  function onTimeSelectChange(dates, dateStrings) {
    currentStartTime=dateStrings[0]+" 00:00:00";
    currentStopTime=dateStrings[1]+" 23:59:59";
    warningQueryCondition.startTime=dateStrings[0]+" 00:00:00";
    warningQueryCondition.endTime=dateStrings[1]+" 23:59:59";
    // console.log('From: ', dates[0], ', to: ', dates[1]);
    // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
   function handleQuery(){
    warningQueryCondition.type=treeValues.typeValue;
    warningQueryCondition.warningLevel=treeValues.levelValue;
    warningQueryCondition.stationsName=currentSelectedStations;
    handleQueryByCondition(warningQueryCondition,(data)=>{
      setTreeValue({...treeValues,tableData:data});
    });
    
  }
  
  return (
    <div className="warning_list_container">
      <div className="warning_list_head">
        <span>Warnings</span>
        <span>
          <CloseOutlined onClick={props.closeCallback}></CloseOutlined>
        </span>
      </div>

      <div className="warning_list_query_condition">
        <div>
        <span>
            <label htmlFor="">Type:&nbsp;</label>
            {/* @ts-ignore */}
            <TreeSelect {...typeTreeProps}></TreeSelect>
          </span>
          <span>
            <label htmlFor="">Warning Level:&nbsp;</label>
            {/* @ts-ignore */}
            <TreeSelect {...levelTreeProps}></TreeSelect>
          </span>

          <span>
            <label htmlFor="">Station:&nbsp;</label>
            {/* @ts-ignore */}
           <StationTreeSelect 
           style= {
             {
            width: "170px",
            height: "30px",
          }
        }
           centerInfo={props.centerInfo} 
           stationTreeSelectedChanged={stationTreeSelectedChanged}/>
          </span>
         
        </div>
        <div>
          <span>
            <label>Time:&nbsp;</label>
            <RangePicker
              className="warnning_list_query_date"
              onChange={onTimeSelectChange}
              size="small"
              ranges={{
                Today: [moment(), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              allowClear={false}
              showTime
              defaultValue={[
                moment(
                  warningQueryCondition.startTime,
                  dateFormat
                ),
                moment(warningQueryCondition.endTime, dateFormat),
              ]}
              //suffixIcon={<SufficIcon/>}
              format="YYYY-MM-DD"
              //   bordered={false}
              //   onChange={onChange}
            />
          </span>
          <Button size="middle" 
          type="primary" 
          onClick={handleQuery}
          style={{marginLeft:"10px"}}>Query</Button>
        </div>
      </div>

      <div className="warning_list_results">
      <Table 
      pagination={{
        hideOnSinglePage:true,
        total:treeValues.tableData.length,
        defaultPageSize:3,
        pageSize:3,
      }}
      size="small" 
      className="talbe_detail" columns={columns} dataSource={treeValues.tableData} />
      </div>
    </div>
  );
};
export default WarningList;
