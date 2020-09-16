import React,{useEffect} from "react";
import {connect} from "react-redux"

import {getStorageInfoAsync} from "../../redux/actions/StationAction"
import StorageChart from "../component/storage-radar-graphic/storage-chart";
const StorageOverview=function(props){
    const storageInfo=props.storageInfo;
    useEffect(()=>{
        getStorageInfoAsync("/getStorageInfo");
    },[]);
    const spectrumUsed=storageInfo?0.01*storageInfo.Spectrum.max*storageInfo.Spectrum.percent:0;
    const iqUsed=storageInfo?0.01*storageInfo.IQ.max*storageInfo.IQ.percent:0;
    const audioUsed=storageInfo?0.01*storageInfo.Audio.max*storageInfo.Audio.percent:0;
    const levelUsed=storageInfo?0.01*storageInfo.Level.max*storageInfo.Level.percent:0;
    const ituUsed=storageInfo?0.01*storageInfo.ITU.max*storageInfo.ITU.percent:0;
    const othersUsed=storageInfo?0.01*storageInfo.Others.max*storageInfo.Others.percent:0;
    return (
        <>
        <div className="head_box">
            <span>Storage Overview</span>
        </div>
        <div className="chart_box">
            <div className="chart_radar_box">
                <StorageChart radius={100}></StorageChart>
            </div>
            <div className="disk_info_box">
                
                <table>
                    <thead>
                        <tr>
                            <td colSpan={2}>Disk Information</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total</td>
                            <td>{storageInfo?`${storageInfo.remainG}/${storageInfo.totalG}`:"350G/1200G"}</td>
                        </tr>
                        <tr>
                            <td>Spectrum</td>
                            <td>{storageInfo?`${spectrumUsed}/${storageInfo.Spectrum.max}`:"60G/100G"}</td>
                        </tr>

                        <tr>
                            <td>IQ</td>
                            <td>{storageInfo?`${iqUsed}/${storageInfo.IQ.max}`:"60G/100G"}</td>
                        </tr>
                       
                        <tr>
                            <td>Audio</td>
                            <td>{storageInfo?`${audioUsed}/${storageInfo.Audio.max}`:"60G/100G"}</td>
                        </tr>
                        <tr>
                            <td>Level</td>
                            <td>{storageInfo?`${levelUsed}/${storageInfo.Level.max}`:"60G/100G"}</td>
                        </tr>
                        <tr>
                            <td>ITU</td>
                            <td>{storageInfo?`${ituUsed}/${storageInfo.ITU.max}`:"60G/100G"}</td>
                        </tr>

                        <tr>
                            <td>Others</td>
                            <td>{storageInfo?`${othersUsed}/${storageInfo.Others.max}`:"60G/100G"}</td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
        </>
    );
}
const mapStateToProps=(state,ownProps)=>{
    return {storageInfo:state.storageInfo};
  }
export default connect(
    mapStateToProps,
    {getStorageInfoAsync}
)(StorageOverview);