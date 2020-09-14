//@ts-check
import React, { useMemo, useReducer, useEffect } from "react";
import "antd/dist/antd.css";
import { Select, TreeSelect, Table } from "antd";

import {
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import CenterInfo from "../../common/data/center";

import SignalOperation,{SignalInfo} from "./signal-operation";

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;


let tabDataSrc=[
    {
        key:"1",
        freq:"101.7",
        type:"Legal",
        Lon:"109.81",
        Lat:"27.31",
        findTime:"2010-01-02 12:05:54",
        description:"1234567890",
        station:["Virtual-001","Virtual-003"],
        edit:{
            key:"1-edit",
            //rowKey:"1",
        freq:"101.7",
        type:"Legal",
        findTime:"2010-01-02 12:05:54",
        description:"1234567890",
        Lon:"109.81",
        Lat:"27.31",
        station:["Virtual-001","Virtual-003"],
        },
        delete:{
            key:"1-delete",
            //rowKey:"1",
        freq:"101.7",
        type:"Legal",
        findTime:"2010-01-02 12:05:54",
        description:"1234567890",
        Lon:"109.81",
        Lat:"27.31",
        station:["Virtual-001","Virtual-003"],
        }
    },
    {
        key:"2",
        freq:"91.7",
        type:"Legal",
        findTime:"2010-05-02 12:05:54",
        description:"xx",
        Lon:"108.81",
        Lat:"28.31",
        station:["Virtual-004","Virtual-006"],
        edit:{
          key:"2-edit",
          //rowKey:"2",
          freq:"91.7",
          type:"Legal",
          findTime:"2010-05-02 12:05:54",
          description:"xx",
          Lon:"108.81",
        Lat:"28.31",
        station:["Virtual-004","Virtual-006"],
        },
        delete:{
          key:"2-delete",
          //rowKey:"2",
          freq:"91.7",
          type:"Legal",
          findTime:"2010-05-02 12:05:54",
          description:"xx",
          Lon:"108.81",
        Lat:"28.31",
        station:["Virtual-004","Virtual-006"],
        }
    }
];
/**
 * @type {CenterInfo}
 */
let stationTrees = null;
/**
 * @type {Array<SignalInfo>}
 */
let signals=[];
class ActionInfo {
  type = "";
  data;
}
const signalOption = [
  <Option key="All" value="All">
    All
  </Option>,
  <Option key="Legal" value="Legal">
    Legal
  </Option>,
  <Option key="Unknown" value="Unknown">
    Unknown
  </Option>,
  <Option key="Illegal" value="Illegal">
    Illegal
  </Option>,
];
const initState = {
  stationTreeChange: [],
  formBigger: false,
  centerInfo:null,
//   选中的tree 行,只能选一个
  selectedRowKeys:[],
  SignalOperationDlg:{
      show:false,
      props:{},
  },
};
function Reducer(preState, action) {
  switch (action.type) {
    case "stationTreeSelcChanged":
      return { ...preState, stationTreeChange: action.data };
    case "zoomin":
      return { ...preState, formBigger: true };
    case "zoomout":
      return { ...preState, formBigger: false };
    case "treeUpdate":
      const stationSelected=preState.stationTreeChange;
      if(stationSelected.length===0&&action.data){
        stationSelected.push(action.data.name);
      }
      return {
        ...preState,
        centerInfo:action.data,
        stationTreeChange:stationSelected,
      };
    case "treeSelectRowChanged":{
        return {...preState,selectedRowKeys:action.data}
    }
    case "addSignal":{
        return {...preState,SignalOperationDlg:{show:true,props:
          {cmd:"add",closeCallback:action.data.closeCallback,centerInfo:preState.centerInfo}}}
    }
    case "updateSignalClick":{
      return {...preState,SignalOperationDlg:{show:true,props:
        {cmd:"update",closeCallback:action.data.closeCallback,
        signalInfo:action.data.signalInfo,centerInfo:preState.centerInfo}}};
    }
    case "closeSignalDlg":{
       return {...preState,SignalOperationDlg:{show:false}};
    }
   
    default:
      return preState;
  }
}

const SignalFormFC = function (props) {
  /**
   * @type {[initState,React.Dispatch<ActionInfo>]}
   */
  const [state, dispatch] = useReducer(Reducer, initState);

  stationTrees = props.tree;
  signals=props.signals;
  useEffect(() => {
    dispatch({ type: "treeUpdate", data: stationTrees });
  }, [stationTrees]);
 if(!signals){
   tabDataSrc=[];
 }else{
   tabDataSrc=[];
   for(let i=0;i<signals.length;i++){
    tabDataSrc[i]={...signals[i],edit:signals[i],delete:signals[i]};
   }
 }
  function onStationTreeSelcChange(value) {
    dispatch({ type: "stationTreeSelcChanged", data: value });
  }

  function changeFormSizeClick(cmd) {
    console.log("changeFormSizeClick");
    if (cmd === "zoomin") {
      //big
      dispatch({ type: cmd, data: null });
    } else if (cmd === "zoomout") {
      //small
      dispatch({ type: cmd, data: null });
    }
  }
  function modifySignal(signal){
    dispatch({type:"updateSignalClick",data:{closeCallback:dlgSignalClose,signalInfo:signal}})
    console.log("modify",signal);
  }
  function deleteSignal(signal){
    console.log("delete",signal);
  }
  function addSignal(){
      dispatch({type:"addSignal",data:{closeCallback:dlgSignalClose}});
  }
  function dlgSignalClose(){
    dispatch({type:"closeSignalDlg",data:null});
  }
  function selectRow(record){
    //only one row can be selected at the same time.
    const selectedRowKeys = [...state.selectedRowKeys];
    selectedRowKeys.splice(0,selectedRowKeys.length);
    selectedRowKeys.push(record.key);
    // if (selectedRowKeys.indexOf(record.key) >= 0) {
    //   selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    // } else {
    //   selectedRowKeys.push(record.key);
    // }
    dispatch({type:"treeSelectRowChanged",data:selectedRowKeys });
    props.signalChooseCallback(record);
  }
  function onSelectedRowKeysChange(selectedRowKeys){
    //only one row can be selected at the same time.
  dispatch({ type: "treeSelectRowChanged", data: selectedRowKeys.length>0?selectedRowKeys[0]:[] });
}
  const tabCol = [
    {
        title:"Frequency(MHz)",
        dataIndex: 'freq',
         width:"140px",
        key: 'freq',
    },
    {
        title:"Type",
        dataIndex: 'type',
        key: 'type',
        ellipsis:true,
    },
    {
        title:"FindTime",
        dataIndex: 'findTime',
        key: 'findTime',
        // width:"85px",
        ellipsis:true,
    },
    {
        title:"Description",
        dataIndex: 'description',
        key: 'description',
        // width:"100px",
        ellipsis:true,

    },
    {
        title:"Edit",
        dataIndex: 'edit',
        key: 'edit',
        render:(rowData)=>{
            return <EditOutlined onClick={e=>modifySignal(rowData)}/>
        }
    },
    {
        title:"Delete",
        dataIndex: 'delete',
        key: 'delete',
        render:(rowData)=>{
            return <DeleteOutlined onClick={e=>deleteSignal(rowData)}/>
        }
    },

];
const { selectedRowKeys } = state;
const rowSelection = {
  selectedRowKeys,
  onChange: onSelectedRowKeysChange
};
  const treeData = useMemo(() => {
    console.log("use memo call");
    if (
      stationTrees &&
      stationTrees.stations &&
      stationTrees.stations.length > 0
    ) {
      const data = [
        {
          title: stationTrees.name,
          value: stationTrees.name,
          key: stationTrees.name,
          children: stationTrees.stations.map((sta) => {
            return {
              title: sta.name,
              key: sta.name,
              value: sta.name,
            };
          }),
        },
      ];
      return data;
    } else {
      return null;
    }
  }, [stationTrees]);
  const tProps = {
    treeData,
    size: "small",
    bordered: "false",
    value: state.stationTreeChange,
    onChange: onStationTreeSelcChange,
    treeCheckable: true,
    maxTagCount: 1,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    maxTagPlaceholder: () => {
      return <label>...</label>;
    },
    style: {
      width: "180px",
      height: "30px",
    },
  };
  return (
    <div
      id={props.id}
      className={
        state.formBigger
          ? "control_signal_form_bigger"
          : "control_signal_form_normal"
      }
    >
      <div className="signal_form_header">
        <span>Type&nbsp;</span>
        <span>
          <Select
            bordered={false}
            style={{
              width: "100px",
              textOverflow: "ellipsis",
              height: "30px",
              color: "white",
            }}
            placeholder="Please select"
            
            defaultValue="All"
            // onChange={handleChange}
          >
            {signalOption}
          </Select>
        </span>
        <span>Station&nbsp;</span>
        <span>
          {/* @ts-ignore */}
          <TreeSelect {...tProps} />
        </span>
        <span className="zoom_in_form_button">
          {!state.formBigger ? (
            <ExportOutlined onClick={(e) => changeFormSizeClick("zoomin")} />
          ) : (
            <ImportOutlined onClick={(e) => changeFormSizeClick("zoomout")} />
          )}
        </span>

        <span className="add_signal_button">
          <PlusOutlined onClick={addSignal}/>
        </span>
      </div>
      <div className="signal_form_content">
          <Table size="small" 
          bordered={false} 
          columns={tabCol} 
          rowSelection={rowSelection}
          onRow={
              (record,index)=>({
                onClick: () => {
                    selectRow(record);
                  },
              })
          }
          dataSource={tabDataSrc}>

          </Table>
      </div>
      <div className="signal_form_footer"></div>
      {state.SignalOperationDlg.show?<SignalOperation {...state.SignalOperationDlg.props}/>:null}
    </div>
  );
};
export default SignalFormFC;
