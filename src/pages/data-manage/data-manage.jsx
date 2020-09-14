import React, { Component } from 'react';

import MainNavgationBar from '../../components/main-nav/main-nav';
import StorageOverview from "./storage-overview";
import FileToDownload from "./file-to-download";
import DiskUsedTrend from "./disk-used-trend";
import StationStorageInfo from "./station-storage-info";
import './data-manage.css'
class DataManage extends Component {
    render() {
        return (
            <>
           
            <MainNavgationBar/>
            <section className="line_separator_hr"></section>
            <section className="data_manage_page_container">
                <section className='page_top'>
                <section className="page_top_left">
                    <StorageOverview/>
                </section>

                <section className="page_top_right">
                    <FileToDownload/>
                </section>
                </section>
                <section className="page_bottom">
                <section className="page_bottom_left">
                    <DiskUsedTrend/>
                    </section>
                <section className="page_bottom_right">
                    <StationStorageInfo/>
                </section>
                </section>
            </section>
           </>
        );
    }
}

export default DataManage;