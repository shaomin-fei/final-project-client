//@ts-check
import React, { Component } from "react";
import {Link} from "react-router-dom"
import "antd/dist/antd.css";
import { List, message } from "antd";

import ColorCircle from "../circle";
import StatusEnum from "../../../common/data/status";

const Item = List.Item;
class TaskItem{
  title="";
  running=false;
  avatar=null;
  device=null;
  canWatch=false;
  canStart=false;
}
class TaskSection extends Component {
  /**
   * 
   * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} e 
   * @param {TaskItem} item
   * @param {string} operation "watch" "start"
   */
  handleLinkClick=(e,item,operation)=>{
    console.log(e);
    if(operation==="watch"){
      if(!item.canWatch){
        message.info("no tasks");
        e.preventDefault();
        return;
      }else{
        //todo link to url
        return;
      }
      
    }
    if(operation==="start"){
      if(!item.canStart){
        message.info("cann't run the task");
      e.preventDefault();
      return;
      }else{
        //todo link to url
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
    
    device&&tasksProps&&tasksProps.forEach(element => {
      const taskItem=new TaskItem();
      taskItem.title=element;
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
        renderItem={(item) => {
            return (
            <Item>
                <Item.Meta
                  avatar={item.avatar} 
                 title={item.title} 
                 description="" />
                 <span className="task_operation_span" style={{padding:"0px 5px"}}>
                {/* href 中执行js代码，;表示执行空代码，这样onclick才会响应 */}
                 <Link to="/cockpit" target="_blank" style={linkStyleStart}  onClick={(e)=>this.handleLinkClick(e,item,"start")}> Start</Link>
                 <Link to="/cockpit" target="_blank" style={linkStyleWatch}  onClick={(e)=>this.handleLinkClick(e,item,"watch")}>Watch</Link>
            </span>
              </Item>
              )
          
        }}
      ></List>
    );
  }
}
export default TaskSection;
