//@ts-check
import React,{useEffect} from "react";

import "./data-manage.css";

class DiskUedInfo{
    time="";
    volume=0;
}
const echarts=require("echarts");
/**
 * @type {echarts.ECharts}
 */
let chart=null;
let chartContainer=null;
const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine:{
            lineStyle:{
                color:"white",
            }
        },
        data: ['2020-01', '2020-02', '2020-03', '2020-04', 
        '2020-05', '2020-08', '2020-07','2020-08','2020-09']
    },
    yAxis: {
        type: 'value',
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
        }
    },
    series: [{
        data: [50, 150, 265, 300, 345, 600, 620,700,1000],
        type: 'line',
        itemStyle: {
            //color: 'rgb(255, 70, 131)'
            color:'#3398DB',
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                // color: 'rgb(255, 158, 68)'
                color:"#B7CDDB",
            }, {
                offset: 1,
                // color: 'rgb(255, 70, 131)'
                color:"#3398DB",
            }])
        },
    }]
};

const DiskUsedTrend=function(props){

    /**
     * @type {Array<DiskUedInfo>}
     */
    let diskTrendData=props.diskTrendData;
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
    useEffect(()=>{
        let times=[];
        let volume=[];
        if(diskTrendData){
            times= diskTrendData.map(trend=>{
                return trend.time;
            });
            volume= diskTrendData.map(trend=>{
                return trend.volume;
            });
        }
        chart.setOption({
            xAxis:{
                data:times,  
            },
            series:[
                {
                    data:volume
                }
            ]
        });
    },[diskTrendData]);
    function resizeChart(){
        chart&&chart.resize();
    }
    return (
        <>
         <div className="head_box">
            <span>Disk Use Trend</span>
        </div>
        <div className="disk_chart_box" ref={dv=>chartContainer=dv}>

        </div>
        </>
    );
}
export default DiskUsedTrend;