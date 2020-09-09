//@ts-check
import React, { useRef, useEffect, useReducer } from "react";
import { Button } from "antd";
import "antd/dist/antd.css";

export class StationBodyInfo {
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
   * @type {Array<string>}
   */
  devicesUrl = [];
}
/**
 * @type {HTMLTableSectionElement}
 */
let deviceLstTbBody=null;
function reducer(state, action) {
  switch (action.type) {
    case "add": {
      return action.data;
    }
    case "update": {
      return action.data;
    }
    case "userInput": {
      return { ...state, [action.inputName]: action.inputValue };
    }
    case "addDevice":
      return { ...state, devicesUrl: [...state.devicesUrl, action.data] };
    case "inputDeviceUrl": {
      const { devicesUrl } = state;
      devicesUrl[action.index] = action.inputValue;
      return { ...state, devicesUrl };
    }
    default:
      return state;
  }
}

const StationOperationBody = function (props) {
  //const [station,setStationInfo]=useState(new StationBodyInfo());
  const [station, dispatch] = useReducer(reducer, new StationBodyInfo());

  const inputName = useRef();

  useEffect(() => {
    //@ts-ignore
    inputName.current && inputName.current.focus();
    /**
     * @type {StationBodyInfo}
     */

    const stationInfo = props.stationInfo;
    if (stationInfo) {
      //@ts-ignore
      dispatch({ type: stationInfo.cmd, data: stationInfo });
    }
  }, []);
  function handleInput(cmd, e) {
    //@ts-ignore
    dispatch({ type: "userInput", inputName: cmd, inputValue: e.target.value });
  }
  function handleDeviceUrl(cmd, index, e) {
    //@ts-ignore
    dispatch({ type: "inputDeviceUrl", index, inputValue: e.target.value });
  }
  function addEmptyDevice(e) {
    //@ts-ignore
    dispatch({ type: "addDevice", data: "" });
    setTimeout(() => {
        deviceLstTbBody.scrollTo(0,deviceLstTbBody.scrollHeight);
    }, 30);
    
  }
  return (
    <div className="station_base_info_container">
      <div >
        <label
          htmlFor=""
          style={{ color: "white", marginLeft: "5px", marginTop: "5px" }}
        >
          Base Information
        </label>
        <Button type="primary" size="small" 
         style={{ float: "right", marginRight: "5px", marginTop: "5px" }}
        >Save</Button>
      </div>
      <table className="station_base_info">
        <tbody>
          <tr>
            <td>Center</td>
            <td>
              <select>
                {station.center.map((cen, index) => {
                  return (
                    <option
                      selected={index === 0 ? true : false}
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
              <input type="text" ref={inputName} />
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
                  <input style={{marginTop:"4px"}} type="checkbox" />
                  <label style={{ marginLeft: "5px" }} htmlFor="">
                    Index
                  </label>
                </td>
                <td>Device URL</td>
              </tr>
            </thead>
            <tbody className="table_device_list" ref={tb=>deviceLstTbBody=tb}>
              {station.devicesUrl.map((device, index) => {
                return (
                  <tr>
                    <td>
                      <input type="checkbox" />
                      <label style={{ marginLeft: "5px" }} htmlFor="">
                        {index + 1}
                      </label>
                    </td>
                    <td>
                      <input
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
    </div>
  );
};
export default StationOperationBody;
