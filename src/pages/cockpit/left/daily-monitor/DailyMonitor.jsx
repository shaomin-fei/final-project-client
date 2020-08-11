/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 09:59:16
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-07 21:47:18
 */
import React from 'react';

import './daily-monitor.css'
const DailyMonitor=function(props){
    return (
        <section className="daily_task_container">
            <div className="daily_task_title">
                <div className="left_img"></div>
                <div className="title font_info">Running Task</div>
                <div className="right_img"></div>
            </div>
            <div className="line_separator"></div>
            
            <div className="running_task_group"> 
           
            <div className="font_info">Auto
            <div className="task_count">0</div>
            </div>
            <div className="vertical_seprator"></div>
            <div className="font_info">Fixed
            <div className="task_count">0</div>
            </div>
            <div className="vertical_seprator"></div>
            <div className="font_info">Scan
            <div className="task_count">0</div>
            </div>
            </div>
            
            <div className="line_separator"></div>
            {/* <div className="total_task_history ">
                <div>History</div>
                <a>7 records</a>
                </div> */}
            <div className="corner_left_top"></div>
            <div className="corner_left_bottom"></div>
            <div className="corner_right_bottom"></div>
            <div className="corner_right_top"></div>
        </section>
    );
}

export default DailyMonitor;