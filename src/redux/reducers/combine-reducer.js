/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 22:08:40
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 23:56:17
 */
import {combineReducers} from "redux"

import stationReducer from "./station-reducer";

export default combineReducers({
    tree:stationReducer,
});