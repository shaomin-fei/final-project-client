/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-18 12:14:29
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-18 14:36:53
 */
/**
 * @type {Map<string,number>}
 */
import StationActionType from "../action-types/action-types"
const initState={
    Auto:0,
    Fixed:0,
    Scan:0,
};

export default function currentTaskChange(state=initState,{type,data}){
    switch(type){
        case StationActionType.currentTaskChange:{
            //console.log("current task reducer",data);
            return {...data};
        }
        default:
            return state;
    }
}