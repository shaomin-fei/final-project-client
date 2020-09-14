import React, { Component } from 'react';

import MapWithStationStatus from "../component/map-with-station-status/map-with-station-status";
import MainNavgationBar from '../../components/main-nav/main-nav';
import MapSignalManage from "./map-signal-manage";

import './signal-manage.css'

class SignalManage extends Component {
    render() {
        return (
            <>
           
            <MainNavgationBar/>
            <section className="line_separator_hr"></section>
            <section className="page_container">
                <MapSignalManage/>

            </section>
           </>
        
        );
    }
}

export default SignalManage;