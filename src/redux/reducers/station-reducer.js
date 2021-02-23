/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 21:05:14
 * @LastEditors: shaomin fei
 * @LastEditTime: 2021-02-22 23:00:13
 */
/** @format */

//@ts-check
import StationActionType from "../action-types/action-types";

const stationReducer = function (state = null, action) {
	switch (action.type) {
		case StationActionType.addStation:
			break;
		case StationActionType.updateStation:
			break;
		case StationActionType.deleteStation:
			break;
		case StationActionType.getTree:
			//console.log("reducer get tree",action.data);
			return { ...action.data };
		default:
			return state;
	}
};
export default stationReducer;
