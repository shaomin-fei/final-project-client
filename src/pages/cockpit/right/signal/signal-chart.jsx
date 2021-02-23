import React, { Component } from "react";
import pubsub from "pubsub-js";

import { getSingalByReason } from "../../../../workers/workers-manage";
import CmdDefineEnum from "../../../../workers/cmd-define";
 


const echarts = require("echarts");

export default class SignalChart extends Component {
  chart = null;
  option = null;
  interValFlash = null;
  /**
   * @type {SignalStaticByReason}
   */
  //signals=null;

  barName = {
    powerIssue: "Power Issue",
    timeIssue: "Time Issue",
    newSignal: "New Signal",
  };
  showData = [
    {
      name: this.barName.powerIssue,
      value: 5,
      selected: true,
      signals:null,
      itemStyle: {
        borderColor: "rgba(237,255,21,0.6)",
      },
    },
    {
      name: this.barName.timeIssue,
      value: 10,
      signals:null,
      selected: false,
    },
    {
      name: this.barName.newSignal,
      value: 8,
      signals:null,
      selected: false,
    },
  ];

  componentDidMount() {
    this.createChart();
    /**
     * @type {SignalStaticByReason}
     */
    const signal=getSingalByReason();
    this.setChartData(signal);
    if(signal){
      this.triggerSelected();
    }
    this.pubToken=pubsub.subscribe(CmdDefineEnum.cmdGetSignalByReason,this.signalStaticByReason);
  }
  componentWillUnmount() {
    //clearInterval(this.interValFlash);
    window.removeEventListener("resize", this.resizeChart);
    this.pubToken&&pubsub.unsubscribe(this.pubToken);
  }
  signalStaticByReason=(msg,data)=>{
    //console.log("receive signalStaticByReason",data);
    this.setChartData(data);
    this.triggerSelected();
  }
  triggerSelected=()=>{
    const transferData=[];
   this.showData.forEach(data=>{
     if(data.selected&&data.signals){
       transferData.push(...data.signals);
     }
   });
    pubsub.publish(CmdDefineEnum.cmdSignalByReasonChoosed,transferData);
  }
  /**
   * @Date: 2020-08-18 23:29:01
   * @Description: 
   * @param {SignalStaticByReason}  data
   * @return {void} 
   */
  setChartData(data){
    if(!data){
      return;
    }
    
    //this.signals=data;
    this.showData[0].signals=data.powerIssue;
    this.showData[0].value=this.getStationCount(data.powerIssue);
    this.showData[1].signals=data.timeIssue;
    this.showData[1].value=this.getStationCount(data.timeIssue);
    this.showData[2].signals=data.newSignal;
    this.showData[2].value=this.getStationCount(data.newSignal);
    const tempData = [];
    this.showData.forEach(data=>{
      tempData.push({...data});
    });
    this.chartDataChange(tempData);
  }
  /**
   * 
   * @param {Array<Issue>} issuData 
   */
  getStationCount(issuData){
    const set=new Set();
    issuData.forEach(issue=>{
      issue.stations.forEach(st=>{
        set.add(st);
      })
    })
    return set.size;
  }
  resizeChart = () => {
    this.chart && this.chart.resize();
  };
  createChart = () => {
    var lineColor = "#406A92";
    var labelColor = "#fff";
    var fontSize = "12";
    var lineWidth = 3;
    let opacity = 0.5;

    const getColor = (params) => {
      
        if (params && params.data && params.data.selected) {
          //return "rgba(38,178,232,1)";
          return {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(237,255,21,1)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(0,102,255,0.2)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          };
        } else {
          return "rgba(38,178,232,0.5)";
        }
      
    };
    const getCircleColor = (params) => {
      
        if (params && params.data && params.data.selected) {
          //return "rgba(38,178,232,1)";
          return {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.5,

            colorStops: [
              {
                offset: 0,
                color: "rgba(0,102,255,0.3)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(237,255,21,1)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          };
        } else {
          return "rgba(38,178,232,0.5)";
        }
      
    };
    this.option = {
      //   backgroundColor: "#031845",
      //animationDurationUpdate: 1200,
      grid: {
        left: "0%",
        right: "0%",
        top: "15%",
        bottom: "7%",
        containLabel: true,
      },
      tooltip: {
        // 暂时不显示
        show: false,
        trigger: "axis",
        textStyle: {
          fontSize: fontSize,
        },
      },

      xAxis: [
        {
          type: "category",
          name: "",
          nameTextStyle: {
            fontSize: fontSize,
            color: labelColor,
            lineHeight: 90,
          },
          axisLabel: {
            color: labelColor,
            fontSize: fontSize,
            fontWeight: "bold",
            margin: 30,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              width: lineWidth,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#197584",
            },
          },
          data: [
            this.barName.powerIssue,
            this.barName.timeIssue,
            this.barName.newSignal,
          ],
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          nameTextStyle: {
            fontSize: fontSize,
            fontWeight: "bold",
            color: labelColor,
          },
          nameGap: 30,
          axisLabel: {
            show: false,
            formatter: "{value}",
            margin: 20,
            textStyle: {
              color: labelColor,
              fontSize: fontSize,
              fontWeight: "bold",
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: lineColor,
              width: lineWidth,
            },
          },
          splitArea: {
            show: false,
            areaStyle: {
              color: [
                "rgba(128,160,176,.1)",
                "rgba(128,160,176,.1)",
                "rgba(128,160,176,.1)",
              ],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: lineColor,
            },
          },
        },
      ],
      series: [
        {
          name: "",
          type: "pictorialBar",
          symbolSize: [50, 25],
          symbolOffset: [0, -10],
          symbolPosition: "end",
          z: 12,
          tooltip: {
            show: false,
          },
          label: {
            normal: {
              show: false,
              position: "top",
              fontSize: fontSize,
              fontWeight: "bold",
              color: "#fff",
            },
          },
          itemStyle: {
            color: function (params) {
              //return getCircleColor(params);
              if (params.data.selected) {
                return "rgba(247,206,20)";
              } else {
                return "rgba(38,178,232,1)";
              }
            },
          },
          //color: "rgba(38,178,232,1)",
          opacity: 1,
          data: this.showData,
        },
        {
          name: "",
          type: "pictorialBar",
          tooltip: {
            show: false,
          },
          symbolSize: [70, 30],
          symbolOffset: [0, 15],
          z: 10,
          itemStyle: {
            normal: {
              color: "transparent",
              borderColor: "#2EA9E5",
              borderType: "solid",
              borderWidth: 3,
              opacity: opacity,
            },
          },
          data: this.showData,
        },
        {
          name: "",
          type: "pictorialBar",
          tooltip: {
            show: false,
          },
          symbolSize: [90, 40],
          symbolOffset: [0, 20],
          z: 10,
          itemStyle: {
            normal: {
              color: "transparent",
              borderColor: "#26B2E8",
              borderType: "solid",
              borderWidth: 4,
              opacity: opacity,
            },
          },
          data: this.showData,
        },
        {
          name: "",
          type: "pictorialBar",
          symbolSize: [50, 25],
          tooltip: {
            show: false,
          },
          symbolOffset: [0, 10],
          z: 12,
          itemStyle: {
            normal: {
              color: (params) => getCircleColor(params),
            },
          },

          opacity: opacity,
          data: this.showData,
        },
        {
          type: "bar",
          name: "signal warning",
          barWidth: "50",
          barGap: "200%",
          barCateGoryGap: "10%",
          itemStyle: {
            normal: {
              //color: "#1E93C6",
              //"rgba(38,178,232,0.5)"
              color: (params) => getColor(params),
              // 上面的数字
              opacity: 1,
            },
            // emphasis:{
            //     color:"#1E93C6",
            //     opacity:0.8,
            // }
          },
          label: {
            normal: {
              show: true,
              position: "top",
              fontSize: fontSize,
              fontWeight: "bold",
              color: "yellow",
              formatter: "{c}",
              offset: [0, -20],
            },
          },

          data: this.showData,
        },
      ],
    };
    this.chart = echarts.init(document.getElementById("signal_chart_id"));
    this.chart.setOption(this.option);
    window.addEventListener("resize", this.resizeChart);


    this.chart.on("click", (params) => {
      //console.log(params);
      const tempData = [];
      this.showData.forEach((data) => {
        if (data.name === params.data.name) {
          data.selected = !params.data.selected;
          data.selected = !params.data.selected;
          if (data.selected) {
            data.itemStyle = {
              borderColor: "rgba(237,255,21,0.6)",
            };
          } else {
            data.itemStyle = {
              borderColor: "#2EA9E5",
            };
          }
        }
        const temp = { ...data };
        tempData.push(temp);
      });
      this.chartDataChange(tempData);
      this.triggerSelected();
      //this.chart.setOption(this.option);
      //在option 里面，背景color是函数，可以重新计算颜色
      //this.selectedBarIndex=params.seriesIndex;
      // const option=this.chart.getOption();
      // console.log("option",option);
      //this.flashBarName=params.name||this.flashBarName;
      // if(params.name===barName.powerIssue){
      //     // this.chart.dispatchAction({
      //     //     type: 'highlight',
      //     //     seriesIndex:params.seriesIndex,
      //     // });
      //     this.flashBarName=
      // }else if(params.name===barName.timeIssue){

      // }else if(params.name===barName.newSignal){

      // }
    });
  };
  chartDataChange=(newData)=>{
    this.chart.setOption({
      series: [
        {
          data: newData,
        },
        {
          data: newData,
        },
        {
          data: newData,
        },
        {
          data: newData,
        },
        // 柱状图，不要边框
        {
          data: newData.map((data) => {
            const temp = { ...data };
            delete temp.itemStyle;
            return temp;
          }),
        },
      ],
    }); 
  }
  render() {
    return (
      <div id="signal_chart_id" style={{ width: "100%", height: "100%" }}></div>
    );
  }
}
