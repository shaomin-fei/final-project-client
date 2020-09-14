import React from "react";

import StorageChart from "../component/storage-radar-graphic/storage-chart";
const StorageOverview=function(props){
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
                            <td>350G/1200G</td>
                        </tr>
                        <tr>
                            <td>IQ</td>
                            <td>60G/100G</td>
                        </tr>
                        <tr>
                            <td>IQ</td>
                            <td>60G/100G</td>
                        </tr>
                        <tr>
                            <td>IQ</td>
                            <td>60G/100G</td>
                        </tr>
                        <tr>
                            <td>IQ</td>
                            <td>60G/100G</td>
                        </tr>
                        <tr>
                            <td>IQ</td>
                            <td>60G/100G</td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
        </>
    );
}
export default StorageOverview;