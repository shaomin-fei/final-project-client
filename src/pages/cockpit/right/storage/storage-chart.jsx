import React, { Component } from "react";

const echarts = require("echarts");

export default class StorageChart extends Component {
  chart = null;
  componentDidMount() {
    this.createChart();
  }
  createChart = () => {
    var bigfonts = 12;
    //var nsum = 800;
    //var fontS = 1em;
    var dataAxis = [];
    var radius = 60;
    var data = [
      {
        color: "#00a9ff",
        text: "Spectrum",
        num: "134",
        percent: 10,
        max: 200,
      },
      {
        color: "#2ced99",
        text: "IQ",
        num: "230",
        percent: 30,
        max: 200,
      },
      {
        color: "#fedb00",
        text: "Audio",
        num: "136",
        percent: 12,
        max: 1000,
      },
      {
        color: "#ff7200",
        text: "Level",
        num: "49",
        percent: 20,
        max: 1,
      },
      {
        color: "#00e4fe",
        text: "ITU",
        num: "360",
        percent: 10,
        max: 1,
      },
      {
        color: "#00e4fe",
        text: "Others",
        num: "360",
        percent: 80,
        max: 8,
      },
    ];

    var option = {
      radar: [
        {
          indicator: data,
          radius: radius,
          startAngle: 60,
          //   how many circles are there
          splitNumber: 4,
          shape: "circle",
          name: {
            //   value is the name of the indicator,value of text attribute
            formatter: function (value, indicator) {
              //   var npercent = indicator.num;
              //   var percent = (npercent / indicator.max) * 100;
              return "{a|" + value + "}{b|\n10}{c|%}";
            },
            rich: {
              a: {
                color: "#fff",
                fontSize: bigfonts,
                fontWeight: "bold",
              },
              b: {
                fontSize: bigfonts,
                fontFamily: "AGENCYB",
                fontWeight: "bold",
                color: "yellow",
              },
              c: {
                fontSize: bigfonts,
                color: "#fff",
                fontWeight: "bold",
              },
            },
            textStyle: {
              color: "#fff",
            },
          },
          splitArea: {
            areaStyle: {
              color: "	rgba(6,222,249,0.06)",
              shadowBlur: 10,
            },
          },
          axisLine: {
            lineStyle: {
              color: "#0095B0",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#0095B0",
            },
          },
        },
      ],
      series: [
        {
          name: "雷达图",
          type: "radar",
          symbolSize: 0,
          areaStyle: {
            normal: {
              color: "rgba(6, 222, 249,0.3)",
            },

            emphasis: {
              color: "rgba(6, 222, 249,0.5)",
            },
          },
          lineStyle: {
            normal: {
              color: "#f9d400",
              type: "solid",
              width: 3,
            },
            emphasis: {},
          },
          data: [
            {
              value: [134, 80, 500, 0.3, 0.9, 5],
              label: {
                show: "true",
              },
            },
          ],
        },
      ],
    };

    this.chart = echarts.init(document.getElementById("storage_chart_id"));
    this.chart.setOption(option);
    window.onresize = () => {
      this.chart.resize();
    };
  };
  createContent = () => {
    // return (
    // );
  };
  render() {
    return (
      <div style={{ height: "100%", width: "100%" ,position:"relative"}}>
        <div id="storage_chart_id" style={{padding:"5px"}}></div>
        {/* <div style={{position:"absolute",border:"1px solid red",right:"5px",top:"0px"}}>50/1000(G)</div> */}
      </div>
    );
  }
}
