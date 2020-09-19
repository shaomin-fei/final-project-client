//@ts-check
import React, {useEffect, useReducer,useRef,useState } from "react";
import { Button, message,Modal } from "antd";
import "antd/dist/antd.css";
import Axios from "axios";

import APIConfigEnum from "../../../config/api-config";

export class DeviceListInfo{
  url="";
  checked=false;
}
export class StationBodyInfo {
  id="";
  cmd = "add";
  /**
   * @type {Array<string>}
   */
  center = [];
  name = "";
  lon = 0;
  lat = 0;
  url = "http://localhost:3005";
  /**
   * @type {Array<DeviceListInfo>}
   */
  devicesUrl = [];
}



function reducer(prestate, action) {
  switch (action.type) {
    case "add": {
      return action.data;
    }
    case "update": {
      return action.data;
    }
    case "userInput": {
      return { ...prestate, [action.inputName]: action.inputValue };
    }
    case "addDevice":
      return { ...prestate, devicesUrl: [...prestate.devicesUrl, action.data] };
    case "inputDeviceUrl": {
      const { devicesUrl } = prestate;
      devicesUrl[action.index] = action.inputValue;
      return { ...prestate, devicesUrl };
    }
    case "checkedDeviceChange":{
      return {...prestate,devicesUrl:action.data}
    }
    case "deleteDevices":{
      return {...prestate,devicesUrl:action.data};
    }
   
    default:
      return prestate;
  }
}
let deviceLstTbBody=null;
let updateStation=null;
const StationOperationBody = function (props) {
  //const [station,setStationInfo]=useState(new StationBodyInfo());

  const headCheckBox=useRef();
  const [dlgShow,setDlgShow]=useState(false);
  /**
   * @type {[StationBodyInfo, React.Dispatch<object>]}
   */
  const [station, dispatch] = useReducer(reducer, props.stationInfo);
  /**
     * @type {StationBodyInfo}
     */

    const stationInfo = props.stationInfo;
    updateStation=stationInfo;

    //第一次加载和选中站变化时候调用
  useEffect(() => {
    //@ts-ignore
    ///inputName.current && inputName.current.focus();
    /**
     * @type {StationBodyInfo}
     */

    const stationInfo = props.stationInfo;
    if (stationInfo) {
      //@ts-ignore
      dispatch({ type: stationInfo.cmd, data: stationInfo });
    }
    console.log("did mount effect");
  }, [updateStation]);
  //仅当添加或删除站的设备完成后调用
  useEffect(()=>{
    if(station.devicesUrl.length===0){
      return;
    }
    //console.log("scroll effect");
    deviceLstTbBody.scrollTo(0,deviceLstTbBody.scrollHeight);
  },[station.devicesUrl]);
  function handleInput(cmd, e) {
    //@ts-ignore
    dispatch({ type: "userInput", inputName: cmd, inputValue: e.target.value });
  }
  function handleDeviceUrl(cmd, index, e) {
   
    const devLstInfo=new DeviceListInfo();
    devLstInfo.url=e.target.value;
    devLstInfo.checked=false;
     //@ts-ignore
    dispatch({ type: "inputDeviceUrl", index, inputValue: devLstInfo });
  }
  function addEmptyDevice(e) {
    const dev=new DeviceListInfo();
    dev.url="http://localhost:4000";
    //@ts-ignore
    dispatch({ type: "addDevice", data: dev });
    
  }
  /**
   * @Date: 2020-09-09 09:26:12
   * @Description: 
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @return {void} 
   */
  function headIndexChanged(e){
      //console.log("change",e);
      /**
       * @type {Array<DeviceListInfo>}
       */
      const devices=station.devicesUrl;
      
      devices.forEach(dev=>{
        dev.checked=e.target.checked;
       
      });
     
      //@ts-ignore
      dispatch({type:"checkedDeviceChange",data:devices});
  }
  function checkBoxChange(index,e){
    const devices=station.devicesUrl;
    devices[index].checked=e.target.checked;
    let checkedCount=0;
    devices.forEach(dev=>{
      if(dev.checked){
        checkedCount++;
      }
    });
    if(checkedCount===0){
      const current=headCheckBox.current;
      current.checked=false;
    }else if(checkedCount===devices.length){
      const current=headCheckBox.current;
      current.checked=true;
    }
    dispatch({type:"checkedDeviceChange",data:devices});
  }
  function deleteDevices(){
    const devices=station.devicesUrl;
    for(let i=devices.length-1;i>=0;i--){
      if(devices[i].checked){
        devices.splice(i,1);
      }
    }
    
    if(devices.length===0){
      /**
       * @type {HTMLInputElement}
       */
      const current=headCheckBox.current;
      current.checked=false;
    }
    dispatch({type:"deleteDevices",data:devices});
  }
  function hideModal(isOk){
    setDlgShow(false);
    if(isOk){
      deleteStation();

    }
  }
  async function deleteStation(){
    const response=await Axios.delete(APIConfigEnum.deleteStation,{
      params:{
        key:station.id
      }
    });
    if(response.data.success){
      message.info("Delete Success");
      props.closeCallback();
    }else{
      message.warn("Delete Failed "+response.data.errorInfo);
    }
  }
  function handleSave(){
    if(!station.name){
      message.info("Please Input Station Name");
      return;
    }
    if(!station.lat){
      message.info("Please Input Lat");
      return;
    }
    if(!station.lon){
      message.info("Please Input Lon");
      return;
    } if(!station.url){
      message.info("Please Input url");
      return;
    }
    if(!station.devicesUrl||station.devicesUrl.length===0){
      message.info("Please Input devicesUrl");
      return;
    }
    saveStation();
  }
  async function saveStation(){
    if(station.cmd==="add"){
      const response=await Axios.post(APIConfigEnum.addStation,station);
      if(response.data.success){
        message.info("Add Success");
      }else{
        message.warn("Add Failed "+response.data.errorInfo);
      }
    }else if(station.cmd==="update"){
      const response=await Axios.put(APIConfigEnum.updateStation,station);
      if(response.data.success){
        message.info("Update Success");
      }else{
        message.warn("Update Failed "+response.data.errorInfo);
      }
    }
  }
  function handleDeleteStation(){
    setDlgShow(true);
  }
  //console.log("render",station);
  return (
    <div className="station_base_info_container">
      <div >
        <label
          htmlFor=""
          style={{ color: "white", marginLeft: "5px", marginTop: "5px" }}
        >
          Base Information
        </label>
        {
        station.cmd==="update"?
        <Button type="primary" size="small" 
         style={{ float: "right", marginRight: "5px", marginTop: "5px" }}
         onClick={handleDeleteStation}
        >Delete</Button>:
        null
        }
        
        <Button type="primary" size="small" 
        onClick={handleSave}
         style={
           { 
             float: "right", 
             marginRight: "5px", 
             marginTop: "5px" 
            }
          }
        >Save</Button>
      </div>
      <table className="station_base_info">
        <tbody>
          <tr>
            <td>Center</td>
            <td>
              <select defaultValue={0}>
                {station.center.map((cen, index) => {
                  return (
                    <option
                      //selected={index === 0 ? true : false}
                      key={index}
                      value={cen}
                    >
                      {cen}
                    </option>
                  );
                })}
              </select>
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td>
              <input type="text" autoFocus value={station.name||""} onChange={e=>handleInput("name",e)}/>
            </td>
          </tr>
          <tr>
            <td>Lon</td>
            <td>
              <input
                value={station.lon || ""}
                onChange={(e) => handleInput("lon", e)}
                type="text"
              />
            </td>
          </tr>
          <tr>
            <td>Lat</td>
            <td>
              <input
                value={station.lat || ""}
                onChange={(e) => handleInput("lat", e)}
                type="text"
              />
            </td>
          </tr>
          <tr>
            <td>URL</td>
            <td>
              <input
                value={station.url || ""}
                onChange={(e) => handleInput("url", e)}
                type="text"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="seperator_baseinfo_list"></div>
      <div className="devices_list">
        <div>
          <label
            htmlFor=""
            style={{ color: "white", marginLeft: "5px", marginTop: "5px" }}
          >
            Device List
          </label>
          <Button
            type="primary"
            size="small"
            onClick={deleteDevices}
            style={{ float: "right", marginRight: "5px", marginTop: "5px" }}
          >
            Delete
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={addEmptyDevice}
            style={{ float: "right", marginRight: "5px", marginTop: "5px" }}
          >
            Add
          </Button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <td style={{textAlign:"center"}}>
                  <input style={{marginTop:"4px"}} type="checkbox" 
                  ref={headCheckBox}
                  onChange={e=>{e.persist();headIndexChanged(e)}}/>
                  <label style={{ marginLeft: "5px" }} htmlFor="">
                    Index
                  </label>
                </td>
                <td>Device URL</td>
              </tr>
            </thead>
            <tbody className="table_device_list" 
           
            ref={tb=>deviceLstTbBody=tb}>
              {station.devicesUrl.map((device, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" checked={device.checked} onChange={e=>checkBoxChange(index,e)}/>
                      <label style={{ marginLeft: "5px" }} htmlFor="">
                        {index + 1}
                      </label>
                    </td>
                    <td>
                      <input className="device_input"
                        type="text"
                        value={device.url}
                        onChange={(e) =>
                          handleDeviceUrl("inputDeviceUrl", index, e)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
          title="Modal"
          visible={dlgShow}
          onOk={e=>hideModal(true)}
          onCancel={e=>hideModal(false)}
          okText="Confirm"
          cancelText="Cancel"
          width="400px"
        >
          <p>Are you sure you want to delete this item?</p>
          
        </Modal>
    </div>
  );
};
export default StationOperationBody;
