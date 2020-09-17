//@ts-check
import React, { Component } from 'react';

import echarts from "echarts";
import 'antd/dist/antd.css';
import { UpOutlined,DownOutlined} from "@ant-design/icons";



//var data = getVirtulData(2020);

export default class StatusLogDaily extends Component{

    data=[];
    chart=null;
    chartContainer=null;
    option = {
        backgroundColor: '#404a59',

       toolbox:{
        feature: {
            myTool1: {
                show: true,
                name:"detail",
                title: 'go to more information',
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function (){
                    alert('waiting to implement')
                }
            },
            // myTool2: {
            //     show: true,
            //     title: '自定义扩展方法',
            //     icon: 'image://http://echarts.baidu.com/images/favicon.png',
            //     onclick: function (){
            //         alert('myToolHandler2')
            //     }
            // }
        }
       },
        title: {
            top: 30,
            text: 'Warning Detail',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '30',
            left: '10',
            data: ['Have Warnings', 'Last Over 12 Hours'],
            textStyle: {
                color: '#fff'
            }
        },
        calendar: [{
            //不响应鼠标事件
            //silent:true,
            top: 100,
            width:"85%",
            left:60,
            range: ['2020-01-01', '2020-06-30'],
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#000',
                    width: 4,
                    type: 'solid'
                }
            },
            yearLabel: {
               
                formatter: '{start}',
                
                textStyle: {
                    color: '#fff'
                }
            },
            dayLabel:{
                color:"#ccc"
            },
            monthLabel:{
                color:"#ccc"
            },
            itemStyle: {
                color: '#323c48',
                borderWidth: 1,
                borderColor: '#111'
            }
        }],
        series: [
            {
                name: 'Have Warnings',
                type: 'scatter',
                coordinateSystem: 'calendar',
                data: this.data,
                symbolSize: function (val) {
                    let size=val[1];
                    if(val[1]<8){
                        size=8;
                    }
                    
                    return size;
                },
                itemStyle: {
                    color: '#FFC0F5'
                }
            },
            
            {
                name: 'Last Over 12 Hours',
                type: 'effectScatter',
                coordinateSystem: 'calendar',
                
                data: this.data.filter(dt=>{
                    return dt[1]>=12;
                }),
                symbolSize: function (val) {
                    return val[1];
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                itemStyle: {
                    color: '#FF0000',
                    shadowBlur: 10,
                    shadowColor: '#333'
                },
                zlevel: 1
            },
           
        ]
    };
    componentDidMount(){
        this.chart=echarts.init(this.chartContainer);
        this.chart.setOption(this.option);
       
    }
    render(){
        this.data=this.props.logData.dailyData||[];
        this.chart&&this.chart.setOption({
            calendar: [{
                range: this.data?[this.data[0][0],this.data[this.data.length-1][0]]:['2020-01-01', '2020-06-30'],
            }],
            series: [
                {
                    data: this.data,
                },
               { 
                   data: this.data.filter(dt=>{
                       return dt[1]>=12;
                   }),
                symbolSize: function (val) {
                    let size=val[1];
                    if(val[1]<8){
                        size=8;
                    }
                    
                    return size;
                },
            }
            ]
        });
        return (
            <>
            <div className="status_log_daily_chart_container" ref={dv=>this.chartContainer=dv}>        

            </div>
          <div className="choose_date">
              <UpOutlined className="choose_date_up"></UpOutlined>
              <DownOutlined className="choose_date_down"></DownOutlined>
          </div>
          
            </>
        );
    }
}
