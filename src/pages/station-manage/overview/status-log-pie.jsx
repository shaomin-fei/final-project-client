//@ts-check
import React, { Component } from 'react';
import echart from "echarts";

export default class StatusLogPie extends Component{

    
    initData=[
        {value:100,name:"Warning",itemStyle:{color:"rgba(255,0,0,1)"}},
        {value:100,name:"Working",itemStyle:{color:"rgba(53, 255, 0, 1)"}},
        {value:100,name:"Idle",itemStyle:{color:"rgba(0,254,228,1)"}},
        {value:100,name:"Shutdown",itemStyle:{color:"rgba(180,180,180,1)"}},
    ]
    
    constructor(props){
        super(props);
        this.logData=this.initData;
        this.chartConteiner=null;
        this.chart=null;
        this.option = {
            title: {
                textStyle:{
                    color:"wheat",
                    fontWeight:"bold"
                },
                text: 'Status Static-Up To Now',
                top:1,
                left: 'center'
            },
            legendHoverLink:true,
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                textStyle:{
                    color:"white",
                },
                itemGap:1,
                orient: 'horizontal',
                bottom: 5,
                left:2,
                padding:1,
                width:"100%",
                data: ['Warning', 'Working', 'Idle', 'Shutdown']
            },
            series: [
                {
                    name: 'Status_static',
                    type: 'pie',
                    radius: '55%',
                    center: ['55%', '50%'],
                    data: this.logData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        
    }
    
    componentDidMount(){
        this.chart=echart.init(this.chartConteiner);

        
         //@ts-ignore
        this.chart.setOption(this.option);
        window.addEventListener("resize",this.resizeChart);
        setTimeout(() => {
            this.resizeChart();
        }, 300);
    }
    componentWillUnmount(){
        window.removeEventListener("resize",this.resizeChart);
    }
    resizeChart=()=>{
        if(this.chart){
            this.chart.resize();
            console.log("resize chart");
        }
      }
    render(){
        if(this.logData!=this.props.logData){
            const tempData=this.props.logData;
            const showData=[];
            if(tempData){
                showData.push({value:tempData.warningTime,name:"Warning",itemStyle:{color:"rgba(255,0,0,1)"}});
                showData.push({value:tempData.workingTime,name:"Working",itemStyle:{color:"rgba(53, 255, 0, 1)"}});
                showData.push({value:tempData.idleTime,name:"Idle",itemStyle:{color:"rgba(0,254,228,1)"}});
                showData.push({value:tempData.shutdownTime,name:"Shutdown",itemStyle:{color:"rgba(180,180,180,1)"}});
                
            }
            this.chart&&this.chart.setOption({
                series: [
                    {
                        data:showData
                    }
                ]
            });
        }
        return (
            <div className="status_static_pie_container" ref={dv=>this.chartConteiner=dv} >
            </div>
        );
    }
}