import React, { Component } from 'react';

import MainNavgationBar from '../../components/main-nav/main-nav';
import './data-manage.css'
class DataManage extends Component {
    render() {
        return (
            <>
           
            <MainNavgationBar/>
            <section className="line_separator_hr"></section>
            <section className="page_container">i'm Data-manage page</section>
           </>
        );
    }
}

export default DataManage;