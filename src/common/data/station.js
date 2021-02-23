
/**
 * /*
 *
 * @format
 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-15 11:17:58
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-25 23:21:40
 */

import { DeviceStatusEnum } from "./device";
class Station {
	id = "";
	name = "";
	lon = 0;
	lat = 0;
	url = "";
	alwaysNotShowCircle = false;
	selected = false;
	devicesUrl = [];
	status = DeviceStatusEnum.WORKING;
	/**
	 * net band from center to station,MB/s
	 */
	netband = 10;
	/**
	 * realtime speed from station to center,usually test five times and calculate the average.,KB/s
	 */
	netSpeed = 500;
	/**
	 * websocket address
	 */
	url = "";
	/**
	 *@type {Array<DeviceInfo>}
	 *
	 */
	devices = [];
}

export default Station;
