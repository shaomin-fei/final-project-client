//@ts-check
import React from 'react';
import { Component } from 'react';


const echarts = require('echarts');

let speed = [0.8, 0.7, 0.4,0.2, 0.1]//current net speed, percentage of the total band
let realSpeed=[0,0,0,0,0];
//var dataCost = [10.01,200,200,1000.01,200000]//真是的金额
let total = [ 1,1,1,1,1]//比例综合
let idealBand = [10, 10, 10,10, 8]//ideal net band
let stations = ['station1','station2','station3','station4','station5', ]
let myColor = ["#F57474",'#F8B448','#1089E7','#56D0E3','#21BF57'];//[,  , ,'', ];

let data = {
    stations: stations,
    speed: speed,
    total: total,
    idealBand: idealBand,
    realSpeed:realSpeed,
    //dataCost:dataCost
};

export default class NetOrder extends Component{

    constructor(props){
        super(props);
        this.chart=null;
        this.option=null;
        
    }
    componentDidMount(){
        this.option=this.intiChart();
        //@ts-ignore
        this.chart = echarts.init(document.getElementById('net_last5_container'));
        //@ts-ignore
        this.chart.setOption(this.option);
        window.addEventListener("resize",this.resizeChart);
    }
    componentWillUnmount(){
        window.removeEventListener("resize",this.resizeChart);
    }
    resizeChart=()=>{
        this.chart&&this.chart.resize();
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
                //  from top to left
                inverse:true,
                data: data.stations,
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
                data: data.total,
                // data: da
            }, {
                type: 'bar',
                barGap: '-85%',
                barWidth: '21%',
                itemStyle: {
                     normal: {
                        barBorderRadius: 16,
                        color: function(params) {
                            //todo choose color by speed range
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
                            return data.realSpeed[params.dataIndex]+"KBs";
                        }
                    }
                },
                labelLine: {
                    show: true,
                },
                z: -1,
                data: data.speed,
               
            }]
        }
        return option;
    }
    /**
     * @typedef {import("../../../../common/data/station").default} Station
     * @param {Array<Station>} lastFive 
     */
    setData(lastFive){
        for(let i=0;i<5;i++){
            stations[i]=lastFive[i].name;
            speed[i]=(Math.round(lastFive[i].netSpeed*8*0.001*100/lastFive[i].netband))*0.01;
            idealBand[i]=lastFive[i].netband;
            realSpeed[i]=lastFive[i].netSpeed;

        }
        //debugger;
       
        const option={...this.option};
         //@ts-ignore
        this.chart&&this.chart.setOption(option);
    }
    render(){
       
        const {lastFive}=this.props;
        if(lastFive&&lastFive.length>0){
            //console.log("lastfive",lastFive);
            this.setData(lastFive);
        }

        return (
            <div id="net_last5_container" className="net_order"></div>
        );
    }
}
    

