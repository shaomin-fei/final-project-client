//@ts-check
import React from "react";
import { renderToString } from "react-dom/server";
import "antd/dist/antd.css";
import { CloseOutlined, CalendarOutlined } from "@ant-design/icons";
import { DatePicker, TreeSelect,Button,Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import Utils from "../../../common/utils/utils";
const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;

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
  warningLevel = "Fatal"; //defaul to query all
  startTime = Date.now();
  endTime = Date.now() - 24 * 60 * 60;
  handled = false; //query those warnings haven't been handled
  constructor({
    warningLevel = "Fatal",
    startTime = Date.now(),
    endTime = Date.now() - 24 * 60 * 60,
  } = {}) {
    this.warningLevel = warningLevel;
    this.startTime = startTime;
    this.endTime = this.endTime;
  }
}
const dateFormat = "YYYY/MM/DD HH:mm:ss";

  const columns=[
      {
          title:"Index",
          dataIndex:"index",
          key:"index"
      },
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
        title:"Reason",
        dataIndex:"Reason",
        key:"Reason"
    },
    {
        title:"Cancel",
        dataIndex:"Cancel",
        key:"Cancel",
        render:needCancel=>(
            needCancel?<Button type="primary">Cancel</Button>:null
        )
    },
    
  ];
  const listData=[
      {
          key:"1",
          index:1,
          Station:"Virtual-001",
          StartTime:"2020-10-01 11:55:59",
          EndTime:"2020-10-01 12:55:59",
          Reason:"Temperature Exceed",
          Cancel:1
      },
      {
        key:"10",
        index:10,
        Station:"Virtual-001",
        StartTime:"2020-10-01 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:1
    },
    {
        key:"2",
        index:2,
        Station:"Virtual-002",
        StartTime:"2020-10-02 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:0
    },
    {
        key:"3",
        index:3,
        Station:"Virtual-003",
        StartTime:"2020-10-03 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:1
    },
    {
        key:"4",
        index:4,
        Station:"Virtual-004",
        StartTime:"2020-10-04 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:0
    },
    {
        key:"5",
        index:5,
        Station:"Virtual-005",
        StartTime:"2020-10-05 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:1
    },
    {
        key:"6",
        index:6,
        Station:"Virtual-006",
        StartTime:"2020-10-01 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:0
    },
    {
        key:"7",
        index:7,
        Station:"Virtual-007",
        StartTime:"2020-10-07 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:1
    },
    {
        key:"8",
        index:8,
        Station:"Virtual-001",
        StartTime:"2020-10-08 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:0
    },
    {
        key:"9",
        index:9,
        Station:"Virtual-002",
        StartTime:"2020-10-09 11:55:59",
        EndTime:"2020-10-01 12:55:59",
        Reason:"Temperature Exceed",
        Cancel:1
    }
  ];
const WarningList = function (props) {
  /**
   * @type {WarningQueryCondition}
   */
  const warningQueryCondition = props.warningQueryCondition;
  const { warningLevel, handled } = warningQueryCondition;
  const [treeValues, setTreeValue] = useState({
    levelValue: warningLevel ? [warningLevel] : ["Fatal"],
    typeValue: handled ? ["Handled"] : ["Unhandled"],
  });
  useEffect(() => {
    // document.getElementsByClassName("ant-picker-clear")[0].firstChild.innerHTML=
    // renderToString(<CloseOutlined/>);
  }, []);
  const levelTreeProps = {
    size: "small",
    treeData: warningLevelTree,
    value: treeValues.levelValue,
    onChange: (value) => onChange("warningLevel", value),
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    treeDefaultExpandAll: true,
    placeholder: "Please select",
    style: {
      width: "150px",
    },
  };

  const typeTreeProps = {
    size: "small",
    treeDefaultExpandAll: true,
    treeData: warningHandleTree,
    value: treeValues.typeValue,
    onChange: (value) => onChange("type", value),
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "160px",
      //backgroundColor:"rgba(5, 23, 61, 0.8)",
      //color:"white",
    },
  };
  function onChange(cmd, value) {
    if (cmd === "warningLevel") {
      setTreeValue({ ...treeValues, levelValue: value });
    } else if (cmd === "type") {
      setTreeValue({ ...treeValues, typeValue: value });
    }
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
            <TreeSelect {...levelTreeProps}></TreeSelect>
          </span>
         
        </div>
        <div>
          <span>
            <label>Time:&nbsp;</label>
            <RangePicker
              className="warnning_list_query_date"
              size="small"
              ranges={{
                Today: [moment(), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              allowClear={true}
              showTime
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
              //suffixIcon={<SufficIcon/>}
              format="YYYY/MM/DD HH:mm:ss"
              //   bordered={false}
              //   onChange={onChange}
            />
          </span>
          <Button size="middle" type="primary" style={{marginLeft:"10px"}}>Query</Button>
        </div>
      </div>

      <div className="warning_list_results">
      <Table 
      pagination={{
        hideOnSinglePage:true,
        total:10,
        defaultPageSize:3,
        pageSize:3,
      }}
      size="small" 
      className="talbe_detail" columns={columns} dataSource={listData} />
      </div>
    </div>
  );
};
export default WarningList;
