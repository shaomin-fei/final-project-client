//@ts-check
import React, { Component } from "react";
import {connect} from "react-redux"


import {getStorageInfoAsync} from "../../../redux/actions/StationAction"


const echarts = require("echarts");

class StorageChart extends Component {
  chart = null;
  option=null;
  data = [
    {
      color: "#00a9ff",
      text: "Spectrum",
      percent: 10,
      max: 200,
    },
    {
      color: "#2ced99",
      text: "IQ",
      percent: 30,
      max: 200,
    },
    {
      color: "#fedb00",
      text: "Audio",
      percent: 12,
      max: 1000,
    },
    {
      color: "#ff7200",
      text: "Level",
      percent: 20,
      max: 1,
    },
    {
      color: "#00e4fe",
      text: "ITU",
      percent: 10,
      max: 1,
    },
    {
      color: "#00e4fe",
      text: "Others",
      percent: 80,
      max: 8,
    },
  ];
  values=this.data.map(dt=>{
    return dt.max*dt.percent*0.01;
  });

  componentDidMount() {
    this.createChart();
    this.resizeChart();
    this.props.getStorageInfoAsync("/getStorageInfo");
    
  }
 componentWillUnmount(){
  window.removeEventListener("resize",this.resizeChart)
 }
 resizeChart=()=>{
  this.chart&&this.chart.resize();
}
  createChart = (radius=60) => {
    let bigfonts = 12;
    //let radius = 60;
    if(this.props.radius){
      radius=this.props.radius;
    }
    this.option = {
      radar: [
        {
          indicator: this.data,
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
              return "{a|" + value + "}{b|\n"+indicator.percent+"}{c|%}";
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
              value: this.values,
              label: {
                show: "true",
              },
            },
          ],
        },
      ],
    };
//@ts-ignore
    this.chart = echarts.init(document.getElementById("storage_chart_id"));
    this.chart.setOption(this.option);
    
    window.addEventListener("resize",this.resizeChart)
   
  };
  createContent = () => {
    // return (
    // );
  };
  render() {
    /***
     * @typedef {import("../../../redux/reducers/storage-info-reducer").initState} initstate
     * @type {initstate}
     */
    const storageInfo=this.props.storageInfo;
    console.log("storage chart render");
    
    if(storageInfo){
      if(typeof(storageInfo)==="string"){
        // setTimeout(()=>{
        //   notification.open({
        //     message: 'Error',
        //     description:
        //       {storageInfo},
        //       duration:0,
        //     onClick: () => {
        //       //console.log('Notification Clicked!');
        //     },
        //   });
        // },10);
        
      }else{
        this.data[0].max= storageInfo.Spectrum.max;
        this.data[0].percent=storageInfo.Spectrum.percent;
  
        this.data[1].max=storageInfo.IQ.max;
        this.data[1].percent=storageInfo.IQ.percent;
  
        this.data[2].max=storageInfo.Audio.max;
        this.data[2].percent=storageInfo.Audio.percent;
  
        this.data[3].max=storageInfo.Level.max;
        this.data[3].percent=storageInfo.Level.percent;
  
        this.data[4].max=storageInfo.ITU.max;
        this.data[4].percent=storageInfo.ITU.percent;
  
        this.data[5].max=storageInfo.Others.max;
        this.data[5].percent=storageInfo.Others.percent;
  
        this.values=this.data.map(dt=>{
          return dt.percent*dt.max*0.01;
        });
        const indicator=[...this.data];
        const values=[...this.values];
        this.chart&&this.chart.setOption({
          radar:[{
            indicator: indicator,
          }],
          series:[{
            
            data:[{
              value:values,
            }],
          }]
        });
      }
     
    }
    
    return (
      <div style={{ height: "100%", width: "100%" ,position:"relative"}}>
        <div id="storage_chart_id"  style={{padding:"5px",height: "100%", width: "100%"}}></div>
        {/* <div style={{position:"absolute",border:"1px solid red",right:"5px",top:"0px"}}>50/1000(G)</div> */}
      </div>
    );
  }
}
const mapStateToProps=(state,ownProps)=>{
  return {storageInfo:state.storageInfo};
}
//包装一下action，使其可以被diaptch
const mapDipatchToProps=(dispatch,ownProps)=>{
  return {getStorageInfoAsync};
}
export default connect(
  mapStateToProps,
  {getStorageInfoAsync}

)(StorageChart);