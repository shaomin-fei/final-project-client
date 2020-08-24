//@ts-check
import React, { Component } from "react";
import { Layout, Tree, Input } from "antd";
import pubsub from "pubsub-js";
import "antd/dist/antd.css";

import StatusEnum from "../../../common/data/status";
import CmdDefineEnum from "../../../workers/cmd-define";
import { getCurrentTree } from "../../../workers/workers-manage";
import CenterInfo from "../../../common/data/center";
import TaskSection from "./task-section"
import "../realtime-task.css";
import "./left-tree.css";
import { DeviceInfo } from "../../../common/data/device";

import ColorCircle from "../circle";

import centerIcon from "../../../imgs/station/省中心.png";

const { Search } = Input;

class TreeNodeData {
  key = "";
  title = "";
  /**
   * @type {Array<TreeNodeData>}
   */
  children = [];
  disabled = false;
  selectable = true;
  status=StatusEnum.IDLE;
  icon=null;
  tag=null;

}

class LeftTree extends Component {
  state = {
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: true,
    treeData:[],
    tasks:[],
    runningTasks:[],
    currentDevice:null,
    //currentStation:null
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  getKeys(data,expandKeys,searchInfo){
    if(data.title.indexOf(searchInfo)!=-1){
      expandKeys.push(data.key);
    }
    if(data.children&&data.children.length>0){
      data.children.forEach(dt=>{
        this.getKeys(dt,expandKeys,searchInfo);
       
      })
    }
  }
  onChange = (e) => {
    const { value } = e.target;
    let expandedKeys=[];
    this.state.treeData&&this.state.treeData.forEach(tree=>{
      this.getKeys(tree,expandedKeys,value);
    });
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  componentDidMount() {
    const tree = getCurrentTree();
    tree && this.handleTree(tree);
    //subscribe
    this.subscribeToken= pubsub.subscribe(CmdDefineEnum.cmdGetTree, (message,center) => {
      this.handleTree(center);
    });
  }
  componentWillUnmount(){
    pubsub.unsubscribe(this.subscribeToken);
  }

  onSelect=(selectedKeys, info)=>{
    /**
     * @type {Array<string>}
     */
    console.log("onselect",info)
    if(!info.node.children||info.node.children.length===0){
      //slect device ,then we need to show task below
      /**
       * @type {DeviceInfo}
       */
      const tag=info.node.tag;
      const tasks=tag.abilities.map(task=>{
        return task.name;
      })
      const runningTasks=tag.runningTasks&&tag.runningTasks.map(run=>{
        return run.name;
      })
      this.setState({tasks,runningTasks,currentDevice:tag});
      //show task below
    }else{
      // folder or unfolder
      this.expandOrUnexpandNode(info);
    }
    
  }
  expandOrUnexpandNode=(info)=>{
    const expandedKeys=this.state.expandedKeys;
    let index=-1;
    for(let i=0;i<expandedKeys.length;i++){
      if(expandedKeys[i]===info.node.key){
        index=i;
        break;
      }
    }
    if(index!=-1){
      //收起
      expandedKeys.splice(index,1);
    }else{
      //this.getKeys(info);
      expandedKeys.push(info.node.key);
    }
    this.setState({expandedKeys:[...expandedKeys], autoExpandParent: index===-1?true:false,});
  }

  getIconByStatus=(status)=>{
    if(status===StatusEnum.IDLE){
      return (<ColorCircle color={"rgba(0,254,228,0.7)"}></ColorCircle>)
    }else if(status===StatusEnum.WORKING){
      return (<ColorCircle color={"rgba(53,255,0,0.7)"}></ColorCircle>)
    }
  else if(status===StatusEnum.FAULT){
    return (<ColorCircle color={"rgba(255,0,0,0.7)"}></ColorCircle>)
  }
else if(status===StatusEnum.SHUTDOWN){
  return (<ColorCircle color={"rgba(180,180,180,0.7)"}></ColorCircle>)
}
  }
  /**
   * convert data to the form that tree can show
   * @param {CenterInfo} tree
   */
  handleTree = (tree) => {
    /**
     * @type {Array<TreeNodeData>}
     */
    if(!tree){
      return;
    }
    const treeData=[];
    //展开所有的节点defaultExpandAll 属性在异步加载数据时无效，因为数据来时，加载已经完成,default 开头的属性只能在加载时有效
    const expandKeys=[];
    const center=new TreeNodeData();
    center.key=tree.id;
    center.title=tree.name;
    center.icon=<img src={centerIcon} style={{width:"24px",height:"24px"}}/>;
    //center.selectable=false;
    expandKeys.push(center.key);
    tree.stations&&tree.stations.forEach(tr=>{
      const station=new TreeNodeData();
      station.key=tr.id;
      expandKeys.push(station.key);
      station.title=tr.name;
      station.status=tr.status;
      station.tag=tr;
      station.icon=this.getIconByStatus(station.status);
      //station.selectable=false;
      tr.devices&&tr.devices.forEach(dev=>{
        const deviceNode=new TreeNodeData();
        deviceNode.key=dev.id;
        expandKeys.push(deviceNode.key);
        deviceNode.title=dev.name;
        deviceNode.status=dev.status;
        deviceNode.tag=dev;
        deviceNode.icon=this.getIconByStatus(deviceNode.status);
        station.children.push(deviceNode);
      });
      center.children.push(station);
    });
    treeData.push(center);
    this.setState({treeData:treeData,expandedKeys:expandKeys});
  };
  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const {treeData}=this.state;
    
    return (
      <div className="left_tree_container">
        <div className="left_tree_section">
          <Search
            style={{ marginBottom: 8 }}
            placeholder="Search"
            onChange={this.onChange}
            enterButton
          />
          <Tree
            showIcon
            style={{ backgroundColor: "transparent" }}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            showLine={false}
            defaultExpandAll={true}
            onSelect={this.onSelect}
            treeData={treeData}
             //treeData={loop(treeData)}
          />
        </div>
        <div className="line_separator_hr"></div>
        <div className="left_task_section">
          <TaskSection tasks={this.state.tasks} 
          runningTasks={this.state.runningTasks}
          device={this.state.currentDevice}
          />
        </div>
      </div>
    );
  }
}

export default LeftTree;
