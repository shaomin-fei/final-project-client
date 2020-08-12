import React, { Component } from 'react';
import ReactDOM from "react-dom"

import MainPageStyleBox from "../../../../components/mainpage-style-box/mainpage-style-box"
import StorageChart from "./storage-chart"
import "./storage.css"

export default class Storage extends Component{


    componentDidMount(){
        ReactDOM.render(
            (
            <StorageChart>
            </StorageChart>
            ),
        document.getElementById("storage_content"));
    }
    render(){
        return (
            <MainPageStyleBox width="100%" height="40%" title="Storage" mountDivId="storage_content" mountDivHeight="calc(100% - 43px)"/>
        );
    }
}


