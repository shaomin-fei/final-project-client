//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 21:05:14
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 23:52:46
 */
import StationActionType from "../action-types/action-types"
import { act } from "react-dom/test-utils";
/**
 * @typedef {import("../action-param").default} ActionParam
 * @param {ActionParam} action 
 * @param {object} state
 */
const iniState={
    tree:null,
}
const stationReducer=function(state=null,action){
    switch(action.type){
        case StationActionType.addStation:
            break;
        case StationActionType.updateStation:
            break;
        case StationActionType.deleteStation:
            break;
        case StationActionType.getTree:
            console.log("reducer get tree",action.data);
            return {...action.data};
        default:
            return state;
    }

}
export default stationReducer;