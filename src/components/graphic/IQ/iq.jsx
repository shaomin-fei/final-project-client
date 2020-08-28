//@ts-check
import React,{useEffect} from "react";
import Highcharts from "highcharts";
import Boost from "highcharts/modules/boost";
import Exporting from "highcharts/modules/exporting"; 
import "./iq.css"

import { SpectrumUtils } from "../utils";
import { DataTypeEnum } from "../../../common/data/realtime/parse-data";

Exporting(Highcharts);
Boost(Highcharts);

let chartIQRealtime=null;
let chartIQStar=null;
let containerRealtime=null;
let containerStar=null;
const optionRealtime={
    title: {
        text: "",
      },
      chart: {
        //borderWidth: 1,
        // borderColor: "red",
        zoomType: "xy",
        type: "line",
        backgroundColor: "#06183d",
        animation: false,
        panning: {
          enabled: true,
        },
        panKey: "shift",
        resetZoomButton: {
          theme: {
            // do not show the deafult button
            //resetChartZoom() function can reset to the original
            display: "none",
          },
        },
        events: {
          selection: ZoomXaxis,
        },
      },
      xAxis: {
        type: "linear",
        gridLineWidth: 1,
        gridLineColor: "gray",
        gridLineDashStyle: "Dash",
        // title:{
        //   text:"xx",
        // },
        tickInterval: 10,
        
        labels: {
          enabled:true,
            style:{
              color: "#ffffff",
  
            },
            format: '{value}',
          
        },
      },
      yAxis: {
        title: {
          text: "",
          style: {
            color: "#ffffff",
          },
        },
        gridLineWidth: 1,
       
        //crosshair: true,
        gridLineColor: "gray",
        gridLineDashStyle: "Dash",
        tickInterval: 20,
        labels: {
          style: {
            color: "#ffffff",
          },
        },
      },
      series: [
        {
          id: "idata",
          name: "idata",
          animation: false,
          type: "line",
          color: "green",
          lineWidth: 2.5,
          boostThreshold: 800,
          showInLegend: false,
          //   非boost模式下，立即生成kdtree，
          //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
          //boost模式下，线宽等属性不生效
          kdNow: true,
          data: [],
        },
        {
          id: "qdata",
          name: "qdata",
          visible: true,
          animation: false,
          type: "line",
          color: "red",
          lineWidth: 2.5,
          boostThreshold: 800,
          showInLegend: false,
          //   非boost模式下，立即生成kdtree，
          //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
          //boost模式下，线宽等属性不生效
          kdNow: true,
          data: [],
        },
      
      ],
      credits: {
        //去除版权信息
        enabled: false,
      },
      exporting: {
        //  do not show "chart context menu"
        enabled: false,
      },
      boost: {
        enabled: true,
        //  don't use this,when it's true,we will see a line from left to the right when we zoomed
        //usePreallocated:true,
        //useAlpha:false,
        useGPUTranslations: true,
      },
}
const optionStar={
    chart: {
        animation: false,
         //borderColor: 'red',
         //borderWidth: 1,
        backgroundColor: "transparent",
        type: 'scatter',
        zoomType: '',
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 5,
        // marginBottom: 5,
        ignoreHiddenSeries: false,
        // width:100,
        // height:100
    },
    boost: {
      enabled:true,
         seriesThreshold: 1,
        useGPUTranslations: true,
        usePreallocated: true
    },
    title: {
        text: ''
    },
    credits: {
        enabled: false//不显示highCharts版权信息
    },
    xAxis: {
        visible: true,
        startOnTick: false,
        minPadding: 0,
        endOnTick: false,
        maxPadding: 0
    },
    yAxis: {
        // min:-20000,
        // max:20000,
        visible: false,
        lineWidth: 1,
        startOnTick: false,
        minPadding: 0,
        endOnTick: false,
        maxPadding: 0
    },
    legend: {
        enabled: false,
    },
    series: [{
      id:"iqstar",
      name:"iqstar",
        enableMouseTracking: false,//关闭鼠标跟踪行为 提升性能
        //showCheckbox: true,
        // name: '瞬时值',
        data: [],
        //shadow: true,
        color: '#30fa3e',
        marker: {
          // enabled:false,
           radius: 1
      },
        animation: false
    }],
    tooltip: {
        enabled: false
    },
    exporting: {
        //  do not show "chart context menu"
        enabled: false,
      },
}
function ZoomXaxis(event) {
    console.log("zoomxaxix",event);
    const [min, max] = SpectrumUtils.ZoomXaxies(
      event,
      chartIQRealtime.xAxis[0].tickInterval
    );
    return false;
  }
const IQGraph=function(props){

    useEffect(()=>{
      //debugger
      //@ts-ignore
      if (!Highcharts.Series.prototype.renderCanvas) {
        throw 'Module not loaded';
    }
        chartIQRealtime = Highcharts.chart(
            containerRealtime,
            //@ts-ignore
            optionRealtime,
            () => {
              //chart has loaded
            }
          );

          chartIQStar=Highcharts.chart(
            containerStar,
            //@ts-ignore
            optionStar,
            () => {
              //chart has loaded
            }
          );
          setTimeout(() => {
              resizeChart();
          }, 10);
    },[]);
    return (
        <div className="iq_graph">
            <div className="iq_realtime" ref={dv=>containerRealtime=dv}>

            </div>
            <div className="iq_star" ref={dv=>containerStar=dv}>

            </div>
        </div>
    );
}
export default IQGraph;
export function resizeChart(){

    chartIQRealtime&&chartIQRealtime.reflow();
    chartIQStar&&chartIQStar.reflow();
}
export function setData(data){
  if(data.has(DataTypeEnum.IQ)){
    chartIQRealtime&&chartIQRealtime.get("idata").setData(data.get(DataTypeEnum.IQ).idata);
    chartIQRealtime&&chartIQRealtime.get("qdata").setData(data.get(DataTypeEnum.IQ).qdata);
    let starData=[];
    for(let i=0;i<data.get(DataTypeEnum.IQ).IQCount;i++){
      starData.push([data.get(DataTypeEnum.IQ).idata[i],data.get(DataTypeEnum.IQ).qdata[i]]);
    }
    chartIQStar&&chartIQStar.get("iqstar").setData(starData);
  }
}