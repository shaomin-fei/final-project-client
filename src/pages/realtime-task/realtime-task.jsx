//@ts-check

import React, { Component } from 'react';

import './realtime-task.css';
import MainNavgationBar from '../../components/main-nav/main-nav';

class RealtimeTask extends Component {
    render() {
        return (
            <>
           
            <MainNavgationBar/>
            <section className="line_separator_hr"></section>
            <section className="realtime_container">i'm realtime task page</section>
           </>
        );
    }
}

export default RealtimeTask;