/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 22:08:40
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-18 12:18:02
 */
import {combineReducers} from "redux"

import stationReducer from "./station-reducer";
import currentTaskChange from './current-task-change-reducer'

export default combineReducers({
    tree:stationReducer,
    currentTask:currentTaskChange,
});