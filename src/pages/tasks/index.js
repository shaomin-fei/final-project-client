//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-24 09:08:24
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-24 11:20:40
 */
import React from "react";
import {Route,Switch} from "react-router-dom"

import FixedTask from "./fixed/fixed";
import NotFount from "../../pages/not-found/not-found";


const ExecuteRealtimeTaskIndex=function(props){

    console.log("ExecuteRealtimeTaskIndex",props);
    //const {executeTask}=props.match.params;
    //const taskInfo=ExecuteTask.create(executeTask);
    //const path="/executetask/"+taskInfo.tasktype+"/"+executeTask;
    //const path="/"+taskInfo.tasktype+"/"+executeTask;
    //props.history.replace(path);
    return (
        <>
           <Switch>
               <Route path="/executetask/FIXFQ/:executeInfo" component={FixedTask}></Route>

               <Route component={NotFount}></Route>
           </Switch>
            </>
    );
}

export default ExecuteRealtimeTaskIndex;