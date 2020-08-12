import React,{Component} from 'react';
import ReactDom from "react-dom";

import MainPageStyleBox from "../../../../components/mainpage-style-box/mainpage-style-box"
import SignalChart from './signal-chart'
import "./signal.css"
export default class Signal extends Component{
    componentDidMount(){
        ReactDom.render(
            (<SignalChart/>),
        document.getElementById("signal_content"));
    }
    render(){
        return (
            <MainPageStyleBox width="100%" height="calc(60% - 10px)" title="Signal Warning" 
            mountDivId="signal_content" mountDivHeight="calc(100% - 50px)"/>
        );
    }
    
}

