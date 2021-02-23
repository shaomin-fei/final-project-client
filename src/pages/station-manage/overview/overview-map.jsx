/** @format */

import React from "react";
import Axios from "axios";

import APIConfigEnum from "../../../config/api-config";

import MapWithStationStatus from "../../component/map-with-station-status/map-with-station-status";
import { LonLat } from "../../../components/map/datas";

import {
	NetLegend,
	StatusInfoControl,
	WarnningControl,
	WarningControlComponent,
} from "./map-controls";
import {
	initStaticCount,
	staticCount,
} from "../../../common/utils/station-status-static";

import StationInfoBox from "./station-info-box";
import { DeviceStatusEnum } from "../../../common/data/device";
import StatusLog from "./status-log";
import WarningList, { WarningQueryCondition } from "./warning-list";
import { message } from "antd";

function getColorByNetSpeed(speed) {
	if (speed <= 0) {
		return "grey";
	}
	if (speed < 100) {
		return "red";
	}
	if (speed < 200) {
		return "orange";
	}
	return "green";
}

export default class OverviewMap extends MapWithStationStatus {
	constructor(props) {
		super(props, {
			isShowLog: false,
			showLogStation: null,
			isShowWarning: false,
			warningQueryCondition: null,
			staticByWarningLevel: null,
		});
		/**
		 * @type {Map<string,VectorLayer>}
		 * key is station id
		 */
		this.mapLineVecLayer = new Map();

		this.statusControl = null;
		// this.dlgCompnent=<StationInfoBox
		// closeCallback={this.dlgCloseCallback}

		// />
		this.dlgCompnent = null;

		this.statusLog = null;

		this.warningControlContainer = null;
	}
	componentDidMount() {
		super.componentDidMount();
		this.getEnvStaticByLevel();
	}
	/**
	 * convert data to the form that tree can show
	 * @param {CenterInfo} center
	 */
	treeUpdate(message, center) {
		super.treeUpdate(message, center);
		if (this.state.isShowLog) {
			const station = this.state.showLogStation;
			if (center.stations && center.stations.length > 0) {
				const temp = center.stations.find((sta) => {
					return sta.id === station.id;
				});
				if (temp) {
					this.setState({ showLogStation: temp });
				}
			}
		}
	}
	showStations(tree, showCenter = false) {
		super.showStations(tree, true);
		this.connectCenterAndStation(tree);
		this.addAllControls();
		this.mapStatusStatic = initStaticCount(this.mapStatusStatic);
		this.mapStatusStatic = staticCount(tree);

		this.statusControl &&
			this.statusControl.setStatus(this.mapStatusStatic);

		//add center
	}
	/**
	 * convert data to the form that tree can show
	 * @param {CenterInfo} tree
	 */
	connectCenterAndStation(tree) {
		const centerPos = new LonLat(tree.lon, tree.lat);
		tree.stations &&
			tree.stations.length > 0 &&
			tree.stations.forEach((sta) => {
				const des = new LonLat(sta.lon, sta.lat);
				const color = getColorByNetSpeed(sta.netSpeed);
				this.mapLineVecLayer.set(
					sta.id,
					this.centerMap.addLine(centerPos, des, 3, color)
				);
			});
	}
	addAllControls() {
		const controls = [];
		const netLegent = new NetLegend({
			element: this.getMapElement(),
		});
		controls.push(netLegent);

		const statusControl = new StatusInfoControl({
			element: this.getMapElement(),
		});
		this.statusControl = statusControl;
		controls.push(statusControl);

		const warnningControl = new WarnningControl({
			element: this.warningControlContainer.container,
		});
		controls.push(warnningControl);
		this.addControls(controls);
	}
	getExtralControls() {
		return (
			<WarningControlComponent
				ref={(dv) => (this.warningControlContainer = dv)}
				staticByWarningLevel={this.state.staticByWarningLevel}
				handleWarningClick={this.handleWarningClick}
			/>
		);
	}
	/**
	 * @Date: 2020-09-01 22:26:55
	 * @Description:
	 * @param {OverlayInfo} staOverlay
	 * @return
	 */
	handleStationClick(e, staOverlay) {
		/**
		 * @type {CenterInfo}
		 */

		super.handleStationClick(e, staOverlay);
		//   document.getElementById(IdGroup.closeId).onclick=e=>{
		//       this.centerMap.removeOverLay(IdGroup.closeId);
		//   }
		//   document.getElementById(IdGroup.logId).onclick=e=>{this.showLogInfo(staOverlay.tag.station)};
		//   document.getElementById(IdGroup.powerId).onclick=e=>{this.powerOperation(staOverlay.tag.station)}
	}
	/**
	 *
	 * @param {Station} station
	 */
	showLogInfo = (station) => {
		//console.log("showloginfo",station);
		this.setState({
			...this.state,
			isShowLog: true,
			showLogStation: station,
		});
		this.dlgCloseCallback(station);
	};
	cancelWarningCallback = () => {
		this.getEnvStaticByLevel();
	};
	async getEnvStaticByLevel() {
		try {
			const response = await Axios(APIConfigEnum.getEnvStaticByLevel);
			const data = response.data;
			this.setState({ staticByWarningLevel: data });
		} catch (e) {
			message.warn(e.message);
		}
	}
	/**
	 *
	 * @param {Station} station
	 */
	async powerOperation(station, callback) {
		//console.log("powerOperation",station);
		try {
			const res = await Axios.put(APIConfigEnum.putPowerOperation, {
				stationid: station.id,
				value: station.status === DeviceStatusEnum.SHUTDOWN ? "on" : "off",
			});
			if (res.data === "ok") {
				message.info("success");
			} else {
				message.error(res.data);
			}
		} catch (err) {
			message.error(err.message);
		} finally {
			callback();
		}
	}

	/**
	 *
	 */
	createDlg = (station) => {
		return (
			<StationInfoBox
				currentStation={station}
				closeCallback={this.dlgCloseCallback}
				showLogCallback={this.showLogInfo}
				powerCalback={this.powerOperation}
			/>
		);
	};
	handleWarningClick = (cmd) => {
		this.setState({
			...this.state,
			isShowWarning: true,
			warningQueryCondition: new WarningQueryCondition({
				warningLevel: cmd,
			}),
		});
	};
	render() {
		//console.log("mat station render");

		return (
			<>
				{super.render()}
				{this.state.isShowLog ? (
					<StatusLog
						showLogStation={this.state.showLogStation}
						closeCallback={(e) =>
							this.setState({ ...this.state, isShowLog: false })
						}
					/>
				) : null}

				{this.state.isShowWarning ? (
					<WarningList
						warningQueryCondition={this.state.warningQueryCondition}
						centerInfo={this.centerInfo}
						closeCallback={() =>
							this.setState({ ...this.state, isShowWarning: false })
						}
						cancelWarningCallback={this.cancelWarningCallback}
					/>
				) : null}
			</>
		);
	}
}
