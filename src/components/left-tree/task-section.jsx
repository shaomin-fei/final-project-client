//@ts-check
import React, { Component } from "react";
import {Link} from "react-router-dom"
import "antd/dist/antd.css";
import { List, message } from "antd";

import ColorCircle from "../../pages/realtime-task/circle";
import StatusEnum from "../../common/data/status";

const Item = List.Item;
class TaskItem{
  title="";
  running=false;
  avatar=null;
  selected=false;
  /**
   * @type {import("../../common/data/device").DeviceInfo} 
   */
  device=null;
  canWatch=false;
  canStart=false;
  getRunntaskId(taskName){
    if(!this.device){
      return "";
    }
    if(!this.device.runningTasks||this.device.runningTasks.length===0){
      return "";
    }
    const running=this.device.runningTasks.find(runningTask=>{
      return runningTask.name===taskName;
    });
    if(running){
      return running.id;
    }
    return "";
  }
}
class TaskSection extends Component {
  /**
   * 
   * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} e 
   * @param {TaskItem} item
   * @param {string} operation "watch" "start"
   */
  handleLinkClick=(e,item,operation)=>{
    if(operation==="watch"){
      if(!item.canWatch){
        message.info("no tasks");
        e.preventDefault();
        return;
      }else{
        
        return;
      }
      
    }
    if(operation==="start"){
      if(!item.canStart){
        message.info("cann't run the task");
      e.preventDefault();
      return;
      }else{
        
        return;
      }
    }
    
  }
  render() {
      /**
       * @type {Array<string>} tasks
       * 
       */
    const  tasksProps  = this.props.tasks;
    /**
     * @type {Array<string>} runningTasks
     */
    const runningTasks=this.props.runningTasks;
    const device=this.props.device;
    const tasks=[];
    const selectedTask=this.props.selectedTask;
    
    device&&tasksProps&&tasksProps.forEach(element => {
      const taskItem=new TaskItem();
      taskItem.title=element;
      if(selectedTask&&selectedTask===element){
        taskItem.selected=true;
      }
      taskItem.device=device;
        if(device.status===StatusEnum.SHUTDOWN||device.status===StatusEnum.FAULT){
          taskItem.running=false;
          taskItem.canStart=false;
          taskItem.canWatch=false;
          taskItem.avatar=<ColorCircle color={"rgba(180,180,180,0.7)"}/>;
          tasks.push(taskItem);
        }
        else if(!runningTasks||runningTasks.length===0){
          taskItem.running=false;
          taskItem.avatar=<ColorCircle color={"rgba(0,254,228,0.7)"}/>;
          taskItem.canStart=true;
          taskItem.canWatch=false;
          tasks.push(taskItem);
            
        }else{
            if(runningTasks.find((running)=>{
                return running===element
            })){
              taskItem.running=true;
              taskItem.avatar=<ColorCircle color={"rgba(53,255,0,0.7)"}/>;
              taskItem.canStart=true;
              taskItem.canWatch=true;
              tasks.push(taskItem);
                
            }else{
              taskItem.running=false;
              taskItem.canStart=true;
              taskItem.canWatch=false;
              taskItem.avatar=<ColorCircle color={"rgba(0,254,228,0.7)"}/>;
              tasks.push(taskItem);
            }
        }
    });
    let linkStyleStart={
      color:"wheat", 
      textDecorationLine: "underline"};
      let linkStyleWatch={
        color:"wheat", 
        textDecorationLine: "underline"};
if(device){
  if(device.status===StatusEnum.FAULT||device.status===StatusEnum.SHUTDOWN){
    linkStyleStart.color="#ccc";
    linkStyleWatch.color="#ccc";    
  }else if(device.status===StatusEnum.IDLE){
    linkStyleWatch.color="#ccc"; 
  }
}
   
    return (
      <List className="task_section_list"
        header={"Task List"}
        bordered
        dataSource={tasks}
      
        renderItem={
           /**
         * @Date: 2020-08-24 09:37:25
         * @Description: 
         * @param {TaskItem} item 
         * @return {React.ReactNode} 
         */
          (item) => {
          let strExecute=`/executetask/${item.title}/type=executeTask&&`,strWatch=`/executetask/${item.title}/type=watchTask&&`;
          let info= item.device?`stationid=${item.device.stationId}&&deviceid=${item.device.id}&&tasktype=${item.title}`:"";
          strExecute+=info;
          const runningId=item.getRunntaskId(item.title);
          if(runningId){
            strWatch+=`&&taskid=${runningId}`;
          }
        
          return (
            <Item style={item.selected?{backgroundColor:"rgba(38, 164, 241, 0.5)"}:null}>
                <Item.Meta
                  avatar={item.avatar} 
                 title={item.title} 
                 description="" />
                 <span className="task_operation_span" style={{padding:"0px 5px"}}>
                {/* href 中执行js代码，;表示执行空代码，这样onclick才会响应 */}
                {/* executeTask格式 type=executeTask&&stationid=xx&&deviceid=xxx&&tasktype=xxx */}
                 <Link to={strExecute}  target="_blank" style={linkStyleStart}  onClick={(e)=>this.handleLinkClick(e,item,"start")}> Start</Link>
                 {/* watchTask格式 type=watchTask&&stationid=xx&&deviceid=xxx&&tasktype=xxx&&taskid=xxx */}
                 <Link to={strWatch} target="_blank" style={linkStyleWatch}  onClick={(e)=>this.handleLinkClick(e,item,"watch")}>Watch</Link>
            </span>
              </Item>
              )
          
        }}
      ></List>
    );
  }
}
export default TaskSection;
