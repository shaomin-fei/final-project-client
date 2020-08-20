/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 22:08:40
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-19 23:18:20
 */
import {combineReducers} from "redux"

import stationReducer from "./station-reducer";
import currentTaskChange from './current-task-change-reducer'
import getStorageInfo from "./storage-info-reducer"

export default combineReducers({
    tree:stationReducer,
    currentTask:currentTaskChange,
    storageInfo:getStorageInfo,
});