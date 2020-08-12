import React from 'react';
import { Component } from 'react';

const echarts = require('echarts');

var cost = [0.8, 0.7, 0.4,0.2, 0.1]//current net speed, percentage of the total band
//var dataCost = [10.01,200,200,1000.01,200000]//真是的金额
var totalCost = [ 1,1,1,1,1]//比例综合
var idealBand = [10, 10, 10,10, 8]//ideal net band
var grade = ['station1','station2','station3','station4','station5', ]
var myColor = ['#21BF57','#56D0E3',  '#1089E7', '#F8B448','#F57474', ];
var data = {
    grade: grade,
    cost: cost,
    totalCost: totalCost,
    idealBand: idealBand,
    //dataCost:dataCost
};

export default class NetOrder extends Component{

    constructor(props){
        super(props);
        this.chart=null;
        
    }
    componentDidMount(){
        const option=this.intiChart();
        this.chart = echarts.init(document.getElementById('net_last5_container'));
        this.chart.setOption(option);
        window.onresize=()=>{
            this.chart.resize();
        }
    }
    intiChart=()=>{
        const option = {
            //backgroundColor: '#05274C',
            
            grid: {
                
                top:"10",
                left: '90',
                right: '60',
                bottom:"0",
                
            },
            xAxis: {
                show: false,
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    margin:10,
                    show: true,
                    color: '#4DCEF8',
                    fontSize: 14
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                z:-1,
                data: data.grade
            },
            series: [{
                type: 'bar',
                barGap: '-65%',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        color: '#fff',
                        fontSize: 14,
                        formatter: 
                        function(param) {
                            return data.idealBand[param.dataIndex] +'Mbps';
                        },
                    }
                },
                barWidth: '30%',
                itemStyle: {
                    normal: {
                        borderColor: '#4DCEF8',
                        borderWidth: 2,
                        barBorderRadius: 15,
                        color: 'rgba(102, 102, 102,0)'
                    },
                },
                z: -1,
                data: data.totalCost,
                // data: da
            }, {
                type: 'bar',
                barGap: '-85%',
                barWidth: '21%',
                itemStyle: {
                     normal: {
                        barBorderRadius: 16,
                        color: function(params) {
                            var num = myColor.length;
                            return myColor[params.dataIndex % num]
                        },
                    }
                },
                max: 1,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(params){
                            return data.cost[params.dataIndex]*data.idealBand[params.dataIndex]*1000/8+"kBs";
                        }
                    }
                },
                labelLine: {
                    show: true,
                },
                z: -1,
                data: data.cost,
            }]
        }
        return option;
    }
    render(){
        return (
            <div id="net_last5_container" className="net_order"></div>
        );
    }
}
    

