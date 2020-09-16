//@ts-check
import React, { Component } from "react";
import {message} from "antd";
import "antd/dist/antd.css";
import Axios from "axios";

import APIConfigEnum from "../../config/api-config";
//import {getStorageInfoAsync} from "../../redux/actions/StationAction"
import MainNavgationBar from "../../components/main-nav/main-nav";
import StorageOverview from "./storage-overview";
import FileToDownload from "./file-to-download";
import DiskUsedTrend from "./disk-used-trend";
import StationStorageInfo from "./station-storage-info";
import "./data-manage.css";
class DataManage extends Component {
    state={
        diskTrendData:null,
        storageData:null,
        folderData:null
    }
  componentDidMount() {
      this.getDiskUsedTrend();
      //this.getFileList();
      this.getStationStorageInfo();
  }
  async getDiskUsedTrend() {
    try {
      const response = await Axios.get(APIConfigEnum.getDiskUsedTrend);
      const data = response.data;
      this.setState({diskTrendData:data});
    } catch (e) {
        message.error(e.message);
    }
  }
  async getStationStorageInfo() {
    try {
        const response = await Axios.get(APIConfigEnum.getStorageOfEachStation);
        const data = response.data;
        this.setState({storageData:data});
      } catch (e) {
          message.error(e.message);
      }
  }
   getFileList=async (path)=> {
    try {
        const response = await Axios.get(APIConfigEnum.getFoloderInfo,{
            params:{
                queryPath:path
            }
        });
        const data = response.data;
        this.setState({folderData:data});
      } catch (e) {
          message.error(e.message);
      }
  }
  render() {
    return (
      <>
        <MainNavgationBar />
        <section className="line_separator_hr"></section>
        <section className="data_manage_page_container">
          <section className="page_top">
            <section className="page_top_left">
              <StorageOverview />
            </section>

            <section className="page_top_right">
              <FileToDownload getFilesCallback={this.getFileList} folderData={this.state.folderData}/>
            </section>
          </section>
          <section className="page_bottom">
            <section className="page_bottom_left">
              <DiskUsedTrend  diskTrendData={this.state.diskTrendData}/>
            </section>
            <section className="page_bottom_right">
              <StationStorageInfo storageData={this.state.storageData}/>
            </section>
          </section>
        </section>
      </>
    );
  }
}

export default DataManage;
