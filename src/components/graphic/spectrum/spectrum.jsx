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

import "./spectrum.css";

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

const measureCount = 0;

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
  const [min, max] = SpectrumUtils.ZoomXaxies(
    event,
    chart.xAxis[0].tickInterval
  );
  chartHeatMap && chartHeatMap.ChangeExtremes(min, max);
  return false;
}
function waterFallXaxisZoomedCallback(min, max){
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

          },format: '{value} km',
        formatter: function () {
          console.log("this value",this.value);
          let temp =
            this.chart.XRangeMHz.startMHz +
            this.chart.XRangeMHz.stepMHz * this.value;
          const strTemp = temp.toFixed(3);
          const tempInit = parseInt(strTemp);
          const tempFloat = parseFloat(strTemp);
          if (Math.abs(tempInit - tempFloat) < 0.000001) {
            return tempInit.toString();
          }
          console.log("x fromater",tempFloat,tempInit);
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
        boostThreshold: 2000,
        showInLegend: false,
        //   非boost模式下，立即生成kdtree，
        //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
        //boost模式下，线宽等属性不生效
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
        boostThreshold: 2000,
        showInLegend: false,
        //   非boost模式下，立即生成kdtree，
        //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
        //boost模式下，线宽等属性不生效
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
        boostThreshold: 2000,
        showInLegend: false,
        //   非boost模式下，立即生成kdtree，
        //否则鼠标吸附会有延迟，甚至不显示，因为默认是异步生成 kdtree,鼠标晃动结束，可能tree还没有生成成功
        //boost模式下，线宽等属性不生效
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
        boostThreshold: 2000,
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
  };
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
function addMeasureCount() {
  const html =
    "<div id=measureDiv>Measure Count:<span id=measureCount></span></div>";
  addLable(html, 200, 10);
}
//添加图表lable
function addLable(html, left, top, classname) {
  return chart.renderer
    .label(html, left, top, null, null, null, true, false, classname)
    .css({
      color: "white",
      fontSize: "14px",
      fontWeight: "bold",
    })
    .add();
}
function updateX(props) {
    let update = true;
  if (props.specAttr) {
    const { yData, freqMHz, freqStepMHz, isCenterFrq } = props.specAttr;
    if (chart) {
      
      if (
        chart.XRangeMHz.startMHz === freqMHz &&
        chart.XRangeMHz.stepMHz === freqStepMHz &&
        chart.XRangeMHz.isCenter === (isCenterFrq ? true : false) &&
        chart.XRangeMHz.yDataLen === yData?.length
      ) {
        //console.log("updatex  ");
        update = false;
      }
      chart.XRangeMHz.startMHz = freqMHz || chart.XRangeMHz.startMHz;
      chart.XRangeMHz.stepMHz = freqStepMHz || chart.XRangeMHz.stepMHz;
      chart.XRangeMHz.isCenter = isCenterFrq || chart.XRangeMHz.isCenter;
      chart.XRangeMHz.yDataLen = yData?.length;
    }
  }
  if (update&&chart) {
    chart.xAxis[0].update({
      tickPositioner: function () {
        console.log("auto",this.tickPositions);
        //let position = [88, 90, 92, 94,96,98,100,102, 104,106];
        let position = [88, 92, 96, 100, 104, 108];
        if (!chart.XRangeMHz) {
          console.log("xposition",position);
          return position;
        }
        const { yDataLen } = chart.XRangeMHz;
        if (!yDataLen) {
          position=[0,1,2,3,4,5,6,7,8,9]
          console.log("xposition",position);
          return position;
        }
        let interval = (yDataLen - 1) / 10;
        //返回频率在点里面的索引
        let result = [];
        for (let i = 0; i < 10; i++) {
          //const temp=parseFloat((i*interval).toFixed(3));
          result.push(i * interval);
        }
        console.log("xposition",result);
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
    setTimeout(()=>{
        // 延迟后在reflow，估计有动画啥的，如果不延迟，估计容器尺寸还没有完全更改
        chart&&chart.reflow();
    },10);
    
    //chart&&chart.setSize(container.clientWidth,container.clientHeight);
    
  }, [spectrumHeight]);

  const showWaterfall=false;

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
  chart&&chart.reflow();
  chartHeatMap&&chartHeatMap.reflow();
}
