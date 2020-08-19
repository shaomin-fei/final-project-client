/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 20:58:04
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-18 14:10:10
 */
import StationActionType from "../action-types/action-types";
import ActionParam from "../action-param";
// when use thunk,the param must be plain object,can't be class
export const addStation=(station)=>({type:StationActionType.addStation,data:station});
export const updateStation=(station)=>({type:StationActionType.updateStation,data:station});
export const deleteStation=(id)=>({type:StationActionType.deleteStation,data:id});
export const getTree=(tree)=>({type:StationActionType.getTree,data:tree});//new ActionParam(StationActionType.getTree,tree)

// action for current task
export const currentTaskChange=(currentTask)=>({type:StationActionType.currentTaskChange,data:currentTask});