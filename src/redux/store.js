//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 20:52:21
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 22:12:26
 */
import {createStore,applyMiddleware} from 'redux'
import thunk from "redux-thunk"
import combineReducer from "./reducers/combine-reducer"
import {composeWithDevTools} from 'redux-devtools-extension';

const store =createStore(combineReducer,
    composeWithDevTools(applyMiddleware(thunk)));

export default store;