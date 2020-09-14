//@ts-check
import React,{useEffect} from "react";

import "./data-manage.css";

const echarts=require("echarts");
/**
 * @type {echarts.ECharts}
 */
let chart=null;
let chartContainer=null;
const option = {
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            // 假设此轴的 type 为 'time'。
            console.log("formatter ",params)
            return `${params[0].name}:${params[0].value}G`
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            axisLine:{
                lineStyle:{
                    color:"white",
                }
            },
            data: ['Virtual-001', 'Virtual-002', 'Virtual-003', 
            'Virtual-004', 'Virtual-005', 'Virtual-006', 'Virtual-007'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name:"(G)",
            axisLabel:{
                showMinLabel:false,
            },
            axisLine:{
                lineStyle:{
                    color:"white",
                }
            },
            splitLine:{
                lineStyle:{
                    type:"dashed",
                }
            },
        }
    ],
    series: [
        {
            name: 'Station Data Storage Information',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
        }
    ]
};

const StationStorageInfo=function(props){

    useEffect(()=>{
        chart=echarts.init(chartContainer);
        //@ts-ignore
        chart.setOption(option);
        window.addEventListener("resize",resizeChart);
        resizeChart();
        return ()=>{
            window.removeEventListener("resize",resizeChart)
        }

    },[]);
    function resizeChart(){
        chart&&chart.resize();
    }
    return (
        <>
        <div className="head_box">
            <span>Storage Informaton Of Each Station</span>
        </div>
        <div className="station_storage_chart_box" ref={dv=>chartContainer=dv}>

        </div>
        </>
    );
}
export default StationStorageInfo;