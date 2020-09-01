//@ts-check
import React, { useEffect } from "react";

import { SpectrumUtils } from "../utils";
import Waterfall from "../waterfall/waterfall";

// import Highcharts from "../../../thirdparty/Highcharts-8.1.2/code/highcharts.src.js";
// import highchartsHeatmap from "../../../thirdparty/Highcharts-8.1.2/code/modules/heatmap.src.js";
// import Boost from "../../../thirdparty/Highcharts-8.1.2/code/modules/boost.src.js";
// import Exporting from "../../../thirdparty/Highcharts-8.1.2/code/modules/exporting.src.js";

import Highcharts from "highcharts";

import highchartsHeatmap from "highcharts/modules/heatmap";

import Boost from "highcharts/modules/boost";
import Exporting from "highcharts/modules/exporting";
import {DataTypeEnum} from "../../../common/data/realtime/parse-data"

import "./spectrum.css";
import { SpectrumData } from "../../../common/data/realtime/Spectrum";
import play from "../../../imgs/icon/sgl/start.png";
import pause from "../../../imgs/icon/sgl/pause.png";

// Initialize exporting module.
Exporting(Highcharts);
highchartsHeatmap(Highcharts);
Boost(Highcharts);
//dark_unica(Highcharts);

// 使主题配置生效
//@ts-ignore

/**
 * @type {HTMLElement}
 */

let container = null;
/**
 * @type {Highcharts}
 */
let chart = null;
let chartHeatMap=null;

let measureCount = 0;
let isPlaying=false;

const iniChart = {
  xTitle: "MHz",
  yTitle: "dBuv",
  yMax: 100,
  yMin: -40,
  freqMHz: 88,
  freqStepMHz: 0.025,
};
/**
 * @type {Highcharts.Options}
 */
let options = null;
//@param {Highcharts.ChartSelectionContextObject} event
//@return: {boolean}
function ZoomXaxis(event) {
  console.log("zoomxaxix",event);
  if(chart.xAxis.length===0){
    return false;
  }
  if(!event.xAxis||event.xAxis.length===0){
    return false;
  }
  const [min, max] = SpectrumUtils.ZoomXaxies(
    event,
    //@ts-ignore
    chart.xAxis[0].tickInterval
  );
  chartHeatMap && chartHeatMap.ChangeExtremes(min, max);
  return false;
}
function waterFallXaxisZoomedCallback(min, max){
  //@ts-ignore
    chart.xAxis[0].setExtremes(min, max);
  };
function setOptions(props) {
  if (props.specAttr) {
    const { xTitle, yTitle, yMin, yMax, yData } = props.specAttr;
    iniChart.xTitle = xTitle || iniChart.xTitle;
    iniChart.yTitle = yTitle || iniChart.yTitle;
    iniChart.yMin = yMin || iniChart.yMin;
    iniChart.yMax = yMax || iniChart.yMax;
  }

  options = {
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
        formatter: function () {
          //console.log("this value",this.value);
          let temp ="";
          if(!this.chart.XRangeMHz.isCenter){
            temp= this.chart.XRangeMHz.startMHz +
            //@ts-ignore
            this.chart.XRangeMHz.stepMHz * this.value;
          }else{
            temp=(this.chart.XRangeMHz.startMHz-0.5*this.chart.XRangeMHz.stepMHz)+ 
            (this.chart.XRangeMHz.stepMHz/this.chart.XRangeMHz.yDataLen) * this.value;
          }
          //@ts-ignore
           
          const strTemp = temp.toFixed(3);
          const tempInit = parseInt(strTemp);
          const tempFloat = parseFloat(strTemp);
          if (Math.abs(tempInit - tempFloat) < 0.000001) {
            return tempInit.toString();
          }
          //console.log("x fromater",tempFloat,tempInit);
          return tempFloat.toString();
        },
      },
    },
    yAxis: {
      title: {
        text: iniChart.yTitle,
        style: {
          color: "#ffffff",
        },
      },
      gridLineWidth: 1,
      min: iniChart.yMin,
      max: iniChart.yMax,
      //crosshair: true,
      gridLineColor: "gray",
      gridLineDashStyle: "Dash",
      tickInterval: 20,
      floor: iniChart.yMin,
      ceiling: iniChart.yMax,
      labels: {
        style: {
          color: "#ffffff",
        },
      },
    },
    series: [
      {
        id: "real-line",
        name: "real-line",
        animation: false,
        type: "line",
        color: "green",
        lineWidth: 2.5,
        boostThreshold: 100,
        showInLegend: false,
        //   非boost模式下，立即生成kdtree，
        //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
        //boost模式下，线宽等属性不生效
        //@ts-ignore
        kdNow: true,
        data: [],
      },
      {
        id: "max-line",
        name: "max-line",
        visible: false,
        animation: false,
        type: "line",
        color: "red",
        lineWidth: 2.5,
        boostThreshold: 100,
        showInLegend: false,
        //   非boost模式下，立即生成kdtree，
        //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
        //boost模式下，线宽等属性不生效
        //@ts-ignore
        kdNow: true,
        data: [],
      },
      {
        visible: false,
        id: "aveage-line",
        name: "aveage-line",
        animation: false,
        type: "line",
        color: "yellow",
        lineWidth: 2.5,
        boostThreshold: 100,
        showInLegend: false,
        //   非boost模式下，立即生成kdtree，
        //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
        //boost模式下，线宽等属性不生效
        //@ts-ignore
        kdNow: true,
        data: [],
      },
      {
        visible: false,
        id: "min-line",
        name: "min-line",
        animation: false,
        type: "line",
        color: "pink",
        lineWidth: 2.5,
        boostThreshold: 100,
        showInLegend: false,
        //   非boost模式下，立即生成kdtree，
        //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
        //boost模式下，线宽等属性不生效
        //@ts-ignore
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
  };
//@ts-ignore
  chart = Highcharts.chart(
    container,
    //@ts-ignore
    options,
    () => {
      //chart has loaded
    }
  );

  //@ts-ignore
  chart.XRangeMHz = {
    startMHz: 88,
    stepMHz: 0.025,
    isCenter: false,
    yDataLen: 0,
  };
}
function playGraphic(){
if(isPlaying){
  stopTask();
}else {
  startTask();
}
}
/**
 * @Date: 2020-08-31 22:16:57
 * @Description: 
 * @param {string} cmd
 * @param {boolean} state 
 * @return 
 */
function showLineChange(cmd,state){

  if(!chart){
    return;
  }
  if(cmd==="showMax"){
      chart.get("max-line").setVisible(state,true);
      
  }else if(cmd==="showMin"){
    chart.get("min-line").setVisible(state,true);
  }else if(cmd==="showAvg"){
    chart.get("aveage-line").setVisible(state,true);
  }else if(cmd==="showReal"){
    chart.get("real-line").setVisible(state,true);
  }
}
function addToolbar(){
  const html=`<span id=spectrum_toolbar><img id=play_spectrum_graphic src=${play} width=20px height=20px ></img>
  <span id=show_max>
  <label >Max</label>
  <input id=checkbox_show_max type=checkbox></input>
  </span>
  <span id=show_min >
  <label>Min</label>
  <input id=checkbox_show_min type=checkbox></input>
  </span>
  <span id=show_avg>
  <label>Average</label>
  <input id=checkbox_show_avg type=checkbox></input>
  </span>
  <span id=show_real >
  <label>Real</label>
  <input id=checkbox_show_real type=checkbox>Real</input>
  </span>
  </span>`;
  //@ts-ignore
  chart.renderer.label(html,80,10,null, null, null, true, false, "").add();
  document.getElementById("play_spectrum_graphic").onclick=playGraphic;
  document.getElementById("checkbox_show_max").onchange=e=>{
    showLineChange("showMax",e.target.checked);
  }

  
  document.getElementById("checkbox_show_min").onchange=
  e=>{
   
    showLineChange("showMin",e.target.checked);
  }

  document.getElementById("checkbox_show_avg").onchange=e=>{
    showLineChange("showAvg",e.target.checked);
  }

  document.getElementById("checkbox_show_real").setAttribute("checked",true);
  document.getElementById("checkbox_show_real").onchange=e=>{
    showLineChange("showReal",e.target.checked);
  }
}

function addMeasureCount() {
  const html =
    "<div id=measureDiv>Measure Count:<span id=measureCount></span></div>";
  addLable(html, 400, 15);
}
//添加图表lable
function addLable(html, left, top, classname) {
  //@ts-ignore
  return chart.renderer
    .label(html, left, top, null, null, null, true, false, classname)
    .css({
      color: "white",
      // fontSize: "14px",
      fontWeight: "bold",
    })
    .add();
}
/**
 * 
 * @param {SpectrumData} data 
 */
function updateX(data) {
    let update = true;
  if (data) {
    const  yData=data.data;
     let freqMHz=data.centerFreqHz*0.000001;
     let freqStepMHz=data.span*0.000001;
     if(data.type===0){
      freqMHz=data.startFreqHz*0.000001;
      freqStepMHz=data.step*0.000001;
     }
      const isCenterFrq  = data.type;
    if (chart) {
      
      if (
        //@ts-ignore
        chart.XRangeMHz.startMHz === freqMHz &&
       //@ts-ignore
        chart.XRangeMHz.stepMHz === freqStepMHz &&
        //@ts-ignore
        chart.XRangeMHz.isCenter === (isCenterFrq ? true : false) &&
       //@ts-ignore
        chart.XRangeMHz.yDataLen === yData?.length
      ) {
        //console.log("updatex  ");
        update = false;
      }
      //@ts-ignore
      chart.XRangeMHz.startMHz = freqMHz || chart.XRangeMHz.startMHz;
      //@ts-ignore
      chart.XRangeMHz.stepMHz = freqStepMHz || chart.XRangeMHz.stepMHz;
      //@ts-ignore
      chart.XRangeMHz.isCenter = isCenterFrq || chart.XRangeMHz.isCenter;
      //@ts-ignore
      chart.XRangeMHz.yDataLen = yData?.length;
    }
  }
  if (update&&chart) {
    //@ts-ignore
    chart.xAxis[0].update({
      tickPositioner: function () {
        //console.log("auto",this.tickPositions);
        //let position = [88, 90, 92, 94,96,98,100,102, 104,106];
        let position = [88, 92, 96, 100, 104, 108];
        //@ts-ignore
        if (!chart.XRangeMHz) {
          //console.log("xposition",position);
          return position;
        }
        //@ts-ignore
        const { yDataLen } = chart.XRangeMHz;
        if (!yDataLen) {
          position=[0,1,2,3,4,5,6,7,8,9]
          //console.log("xposition",position);
          return position;
        }
        let interval = (yDataLen - 1) / 10;
        //返回频率在点里面的索引
        let result = [];
        for (let i = 0; i < 10; i++) {
          //const temp=parseFloat((i*interval).toFixed(3));
          result.push(i * interval);
        }
        //console.log("xposition",result);
        return result;
      },
    });
  }
}
let spectrumHeight="60%";

const Spectrum = function (props) {
  useEffect(() => {
    setOptions(props);
    addMeasureCount();
    addToolbar();
    setTimeout(()=>{
        // 延迟后在reflow，估计有动画啥的，如果不延迟，估计容器尺寸还没有完全更改
        //@ts-ignore
        chart&&chart.reflow();
    },10);
    
    //chart&&chart.setSize(container.clientWidth,container.clientHeight);
    
  }, [spectrumHeight]);

  const showWaterfall=true;

  spectrumHeight="100%";
  if(showWaterfall){
      spectrumHeight="60%";
  }
  updateX(props);
  return (
    <>
      <div className="spectrum_graphic" style={{height:spectrumHeight}}
       ref={(dv) => (container = dv)}></div>
       {
       showWaterfall?<Waterfall display={showWaterfall?"block":"none"}
          waterFallXaxisZoomedCallback={waterFallXaxisZoomedCallback}
          ref={(wf) => (chartHeatMap = wf)}
        ></Waterfall>:
        null}
      
    </>
  );
};
export default Spectrum;
export function resizeChart(){
  //@ts-ignore
  chart&&chart.reflow();
  chartHeatMap&&chartHeatMap.resizeChart();
}
/**
 * 
 * @param {Map<string,SpectrumData>} data 
 */
export function setData(data){
  if(!chart){
    return;
  }
  if(!isPlaying){
    return;
  }
  let real,max,min,avg;
  //debugger
  if(data.has(DataTypeEnum.Spectrum)){
    real=data.get(DataTypeEnum.Spectrum);
    real.centerFreqHz=Number(real.centerFreqHz);
    updateX(real);
    //@ts-ignore
    if(chart.get("real-line").visible){
      chart.get("real-line").setData(real.data);
    }
   
  }
  if(data.has(DataTypeEnum.MaxSpectrum)){
    max=data.get(DataTypeEnum.MaxSpectrum);
    max.centerFreqHz=Number(real.centerFreqHz);
     //@ts-ignore
     if(chart.get("max-line").visible){
      chart.get("max-line").setData(max.data);
     }
    
  }
  if(data.has(DataTypeEnum.MinSpectrum)){
    min=data.get(DataTypeEnum.MinSpectrum);
    min.centerFreqHz=Number(real.centerFreqHz);
     //@ts-ignore
     if(chart.get("min-line").visible){
      chart.get("min-line").setData(min.data);
     }
    
  }
  if(data.has(DataTypeEnum.AvgSpectrum)){
    avg=data.get(DataTypeEnum.AvgSpectrum);
    avg.centerFreqHz=Number(real.centerFreqHz);
     //@ts-ignore
     if(chart.get("aveage-line").visible){
      chart.get("aveage-line").setData(avg.data);
     }
    
  }
  chartHeatMap&&chartHeatMap.setData(real.data,true);
  measureCount++;
  document.getElementById("measureCount").innerHTML=measureCount.toString();
}
export function reset(){
  measureCount=0;
}

export function startTask(){
 isPlaying=true;
 document.getElementById("play_spectrum_graphic").setAttribute("src",pause);
}
export function stopTask(){
  isPlaying=false;
  document.getElementById("play_spectrum_graphic").setAttribute("src",play);
}