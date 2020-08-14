import React, { Component } from 'react';

import MainNavgationBar from '../../components/main-nav/main-nav';
import './station-manage.css'
class StationManage extends Component {
    render() {
        return (
            <>
           
            <MainNavgationBar/>
            <section className="line_separator_hr"></section>
            <section className="page_container">i'm station-manage page</section>
           </>
        );
    }
}

export default StationManage;