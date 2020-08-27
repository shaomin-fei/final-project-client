//@ts-check
import React,{useEffect} from "react";
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
Exporting(Highcharts);

const options={
    chart: {
            type: 'line',
            marginRight: 10,
            backgroundColor: "#06183d",
            spacingTop:8,
            spacingBottom:23,
           //borderWidth: 1,
        //borderColor: "red",
           
    },
    title: {
            text: ''
    },
    xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            labels: {
                enabled:true,
                  style:{
                    color: "#ffffff",       
                  }
                },
    },
    yAxis: {
        gridLineWidth: 1,
        min: -40,
        max: 100,
        floor: -40,
      ceiling: 100,
      tickInterval: 20,
        //crosshair: true,
        gridLineColor: "gray",
        gridLineDashStyle: "Dash",
            title: {
                    text: null
            },
            labels: {
                enabled:true,
                  style:{
                    color: "#ffffff",
        
                  }
                },
    },
    tooltip: {
            formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);
            }
    },
    legend: {
            enabled: false
    },
    series: [{
            name: 'level',
            // 显示50个数据，初始值位-40
            //data: Array(50).fill(-40)
            data:[]
    }],
    credits: {
        //去除版权信息
        enabled: false,
      },
      exporting: {
        //  do not show "chart context menu"
        enabled: false,
      },
}
let container=null;
let chart=null;
function setOptions(){
    chart=Highcharts.chart(container,options);
}
const LevelGraph=function(props){
    useEffect(()=>{
        setOptions();
        setTimeout(() => {
                chart.reflow();
        }, 10);
    },[]);
    return (
        <div ref={dv=>container=dv} style={{width:"100%",height:"100%"}}>
        </div>
    );
}
export default LevelGraph;
export function resizeChart(){
        chart&&chart.reflow();
      }