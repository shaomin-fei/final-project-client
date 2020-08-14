import React, { Component } from 'react';

import MainNavgationBar from '../../components/main-nav/main-nav';
import './signal-manage.css'

class SignalManage extends Component {
    render() {
        return (
            <>
           
            <MainNavgationBar/>
            <section className="line_separator_hr"></section>
            <section className="page_container">i'm Signal-manage page</section>
           </>
        
        );
    }
}

export default SignalManage;