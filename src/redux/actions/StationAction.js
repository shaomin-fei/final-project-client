/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 20:58:04
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-24 10:01:52
 */
import { notification } from 'antd';
import "antd/dist/antd.css";

import StationActionType from "../action-types/action-types";
import ActionParam from "../action-param";
import Axios from "axios";
// when use thunk,the param must be plain object,can't be class
export const addStation=(station)=>({type:StationActionType.addStation,data:station});
export const updateStation=(station)=>({type:StationActionType.updateStation,data:station});
export const deleteStation=(id)=>({type:StationActionType.deleteStation,data:id});
export const getTree=(tree)=>({type:StationActionType.getTree,data:tree});//new ActionParam(StationActionType.getTree,tree)

// action for current task
export const currentTaskChange=(currentTask)=>({type:StationActionType.currentTaskChange,data:currentTask});
//action for get storage info
export const getStorageInfo=(storageInfo)=>({type:StationActionType.getStorageInfo,data:storageInfo});

export const getStorageInfoAsync=(url)=>{
    return async dispatch=>{
        try{
            const res=await Axios.get(url);
            const data=res.data;
            dispatch(getStorageInfo(data));
        }catch(e){
            console.log("getStorageInfoAsync error",e);
            //dispatch(getStorageInfo("get storage info error"));
              notification.open({
            message: 'Error',
            description:
            "getStorageInfoAsync error",
              duration:0,
            onClick: () => {
              //console.log('Notification Clicked!');
            },
          });
        ;
        }
        finally{

        }
       
    }
}