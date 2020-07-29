/* eslint-disable linebreak-style */
/* eslint no-undef: "off" */

/*
 * @Author: shaomin fei
 * @Date: 2020-07-23 14:35:31
 * @LastEditTime: 2020-07-29 02:55:31
 * @LastEditors: shaomin fei
 * @Description: capsule the basic spctrum diagram
 * @FilePath: \rms-ui\src\components\spectrum\temple.jsx
 */ 

import React,{Component} from 'react';
import {List} from 'immutable';
import PropTypes from "prop-types"


//const Highcharts=require('../../thirdparty/Highcharts-8.1.2/code/highcharts.src');
//import  Highcharts from '../../thirdparty/Highcharts-8.1.2/code/es-modules/masters/highcharts.src';
// Alternatively, this is how to load Highstock. Highmaps is similar.
// import Highcharts from 'highcharts/highstock';
//import highchartsHeatmap from 'highcharts/modules/heatmap';
//const highchartsHeatmap=require( '../../thirdparty/Highcharts-8.1.2/code/modules/heatmap.src');
//import * as highchartsHeatmap from '../../thirdparty/Highcharts-8.1.2/code/es-modules/masters/modules/heatmap.src.js';

//const Boost=require('../../thirdparty/Highcharts-8.1.2/code/es-modules/masters/modules/boost.src');
//import * as Boost from '../../thirdparty/Highcharts-8.1.2/code/es-modules/masters/modules/boost.src.js';
//import BoostCanvas from 'highcharts/modules/boost-canvas';

// Load the exporting module.
//const Exporting=require("../../thirdparty/Highcharts-8.1.2/code/modules/exporting.src");
//import * as Exporting from '../../thirdparty/Highcharts-8.1.2/code/es-modules/masters/modules/exporting.src.js';

import WaterFall from './waterfall';

import Highcharts from "../../thirdparty/Highcharts-8.1.2/code/highcharts.src.js"
import highchartsHeatmap from "../../thirdparty/Highcharts-8.1.2/code/modules/heatmap.src.js"
import Boost from "../../thirdparty/Highcharts-8.1.2/code/modules/boost.src.js"
import Exporting from "../../thirdparty/Highcharts-8.1.2/code/modules/exporting.src.js"

// Initialize exporting module.
Exporting(Highcharts);
highchartsHeatmap(Highcharts);

Boost(Highcharts);

//BoostCanvas(Highcharts);

/**
 * @Author: shaomin fei
 * @description: 
 * @Date: 2020-07-28 12:40:13
 * @param {number}  minNum
 * @param {number}  maxNum
 * @return: {number}
 */
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return Math.round((Math.random() * minNum + 1));
      case 2:
        return Math.round((Math.random() * ( maxNum - minNum + 1 ) + minNum));
        //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
      default:
        return 0;
    }
  }

    let dataShowTemp=[];
    function mockData(){
        for(let col=0;col<50;col++){
            for(let i=0;i<801;i++){
                let temp=[i,col,randomNum(-40,100)];
                dataShowTemp.push(temp);
           }
          }
    }
     
       
export default class Spectrum extends Component{

    // private chart:Highcharts.Chart|null;
    // private chartHeatMap:Highcharts.Chart|null;
    // private container:any;
    // private heatMapContainer:HTMLDivElement|null;
    // // private heatMapColIndex:number=0;
    // private lstHeatMapData:Array<Array<Array<number>>>=[];
    // private heatMapCount:number=30;
    // private specProps:IProps={
    //     specAttr:{}
    // };
   
    // private isMouseDown:boolean;
    // private  options:Highcharts.Options ={};
    // private positionMouseDown:IPosition;
    // private restZoom:boolean;
    //private packageCount:number;

    //@type {HTMLDivElement}
    container=null;
    /**
     * @Author: shaomin fei
     * @description: 
     * @Date: 2020-07-28 12:44:27
     * @param {object} props
     * @param {object} props.specAttr
     * @param {number[]|null} props.specAttr.yData
     * @param {List<number>} props.specAttr.xData
     * @param {string} props.specAttr.xTitle
        @param {string} props.specAttr.yTitle
        @param {number} props.specAttr.yMin
        @param {number} props.specAttr.yMax
        @param {number} props.specAttr.freqMHz
        @param {number} props.specAttr.freqStepMHz
        @param {boolean} props.specAttr.isOver
        @param {number} props.specAttr.totalCount
        @param {number} props.specAttr.packageIndex
         @param {number} props.specAttr.indexOfThisPckage
         @param {boolean} props.specAttr.isCenterFrq
     * @return: 
     */
    static propTypes={
        specAttr:PropTypes.object.isRequired,
    }
    constructor(props){
        super(props);
        this.specProps={
            specAttr:{
                xTitle:"MHz",
        yTitle:"dBuv",
        yMax:100,
        yMin:-40,
        freqMHz:88,
        freqStepMHz:0.025,
        isOver:true,
        totalCount:0,
        packageIndex:0,
        indexOfThisPckage:0,
        isCenterFrq:false,
            }
        };
        
        this.isMouseDown=false;
        this.positionMouseDown={x:0,y:0};
        this.restZoom=false;
        this.chart=null;
        this.chartHeatMap=null;
        this.chartHeatMap=null;
        
        //this.lstHeatMapData=[];
    
        // this.state={
        //     packageCount:0
        // }
    }
    /**
      * @Author: shaomin fei
      * @description: 
      * @Date: 2020-07-28 12:50:05
      * @param {number[]} yData
      * @return: 
      */
     setData(yData){
        if(yData){
                if(this.chart){
                    (this.chart.get("real-line")).setData(yData||[],true);
                }
                if(this.chartHeatMap){
                    this.chartHeatMap.setData(yData);
                }
            }
            
        

        }
    
  
    setOptions(){
        const {xTitle,yTitle,yMin,yMax,yData}=this.props.specAttr;
        this.specProps.specAttr.xTitle=xTitle||this.specProps.specAttr.xTitle;
        this.specProps.specAttr.yTitle=yTitle||this.specProps.specAttr.yTitle;
        this.specProps.specAttr.yMin=yMin||this.specProps.specAttr.yMin;
        this.specProps.specAttr.yMax=yMax||this.specProps.specAttr.yMax;
        this.options={
            title:{
                text:""
            },
            
            chart:{
                
                zoomType:'xy',
                type:"line",
                animation: false,
                panning: {
                    enabled:true
                },
                panKey: 'shift',
                resetZoomButton: {
                    theme: {
                        // do not show the deafult button
                        //resetChartZoom() function can reset to the original
                        display: 'none'
                    }
                },
                events:{
                    selection:this.resetZoomWhenDragLeft,
                },
             },
             xAxis:{
                //  title:{
                //      text:this.xTitle
                //  },
                // gridline will not show if don't set gridlinewidth
                type:"linear",
                gridLineWidth:1,
                 crosshair:true,
                 gridLineColor:"gray",
                 gridLineDashStyle:"LongDash",
                 //tickAmount:10,
                //  at least show ten points of x
                 //minRange:10,
                //  min:88,
                //  max:108,
                //  floor:88,
                //  ceiling:108,
                  tickInterval:10,
                  labels:{
                        formatter:function(){
                            let temp=(this.chart.XRangeMHz.startMHz+
                                this.chart.XRangeMHz.stepMHz*this.value); 
                            const strTemp=temp.toFixed(3);
                            const  tempInit=parseInt(strTemp);
                            const tempFloat=parseFloat(strTemp);
                            if(Math.abs(tempInit-tempFloat)<0.000001){
                                return tempInit.toString();
                            }

                            return tempFloat.toString();
                        }
                      },
                      

                 
             },
             yAxis:{
                 title:{
                     text:this.specProps.specAttr.yTitle
                 },
                 gridLineWidth:1,
                 min:this.specProps.specAttr.yMin,
                 max:this.specProps.specAttr.yMax,
                 crosshair:true,
                 gridLineColor:"gray",
                 gridLineDashStyle:"LongDash",
                 tickInterval:20,
                 floor:this.specProps.specAttr.yMin,
                 ceiling:this.specProps.specAttr.yMax,
                 //minRange:10,
                 //tickAmount:7,
                 
             },
             series:[
                 {
                     id:"real-line",
                     name:"real-line",
                     animation: false,
                     type:'line',
                     color:"green",
                     lineWidth:2.5,
                     boostThreshold:200,
                     showInLegend: false,
                     data:yData?yData:[],
                 }
                 
             ],
             
             credits: {
               //去除版权信息
               enabled: false
             },
             exporting:{
                //  do not show "chart context menu"
                enabled:false,
             },
             boost:{
                 enabled:true,
                usePreallocated:true,
                //useAlpha:false,
                useGPUTranslations: true,

             }
            
        }
        this.chart=Highcharts.chart(this.container,this.options);
       
        this.chart.XRangeMHz={
            startMHz:88,
            stepMHz:0.025,
            isCenter:false,
            yDataLen:0
        }
    }
    //@param {Highcharts.ChartSelectionContextObject} e
    //@return: {boolean}
    resetZoomWhenDragLeft=(e)=>{
        // stop zoom in
        // console.log(e.xAxis);
        // if((e.xAxis[0].axis.oldMin||0)>(e.xAxis[0].axis.min||0)){
        //     console.log("left");
        // }
       if(this.restZoom){
           return false;
       }
        return true;
    }
    // shouldComponentUpdate(){
    //     if(this.props.specAttr.packageCount===this.state.packageCount){
    //         return false;
    //     }
    //     this.setState({packageCount:this.props.specAttr.packageCount});
       
    //     return true;
    // }
    componentDidMount(){
    
        this.setOptions();
        (this.container).onmousedown=this.containerMouseDown;
        (this.container).onmouseup=this.containerMouseUp;
        

    }
    componentWillUnmount(){
        (this.container).onmousedown=null;
        (this.container).onmouseup=null;
    }
    //@type {MouseEvent} e
    containerMouseDown=(e)=>{
        this.isMouseDown=true;
        this.positionMouseDown={x:e.x,y:e.y};
    }
    //@param {MouseEvent} e
    containerMouseUp=(e)=>{
        this.isMouseDown=false;
        if(this.positionMouseDown.x>e.x){
            //left drag
            this.restZoom=true;
            if(this.chart){
                //restore
                this.chart.xAxis[0].setExtremes(undefined,undefined);
                this.chart.yAxis[0].setExtremes(undefined,undefined);
            }
           
            //Highcharts.fireEvent(this,"selection",e);
        }else{
            //right drag
            this.restZoom=false;
        }
        
        //console.log(this.chartHeatMap?.legend.options.symbolHeight);
        //Highcharts.fireEvent(this,"selection",e);
    }
     render(){

        const {yData,freqMHz,freqStepMHz,isCenterFrq}=this.props.specAttr;
        if(this.chart){
            
            let updateX=true;
            if(this.chart.XRangeMHz.startMHz===freqMHz&&
                this.chart.XRangeMHz.stepMHz===freqStepMHz&&
                this.chart.XRangeMHz.isCenter===(isCenterFrq?true:false)&&
                this.chart.XRangeMHz.yDataLen===yData?.length
                ){
                    //console.log("updatex  ");
                    updateX=false;
                }
            this.chart.XRangeMHz.startMHz=freqMHz||this.chart.XRangeMHz.startMHz;
            this.chart.XRangeMHz.stepMHz=freqStepMHz||this.chart.XRangeMHz.stepMHz;
            this.chart.XRangeMHz.isCenter=isCenterFrq||this.chart.XRangeMHz.isCenter;
            this.chart.XRangeMHz.yDataLen=yData?.length;
            if(updateX){
                this.chart.xAxis[0].update({
                    tickPositioner:function(){
                        let position=[88,92,96,100,104,108];
                              if(!this.chart.XRangeMHz){
                                  return position;
                              }
                              const {yDataLen}=this.chart.XRangeMHz;
                             if(!yDataLen){
                                 return position;
                             }
                              let interval=(yDataLen-1)/10;
                            //返回频率在点里面的索引
                            let result=[];
                            for(let i=0;i<10;i++){
                                //const temp=parseFloat((i*interval).toFixed(3));
                                result.push(i*interval);
                            }
                            return result;
                    }
                });
            }
        }
            //this.chart.xAxis[0].tickInterval=yData?yData.length/10:this.chart.xAxis[0].tickInterval;
        
        //console.log("draw",Date.now());
        //console.log("props packagecount",this.props.specAttr.packageCount);
        //console.log("my packagecount",this.state.packageCount);
       
        return (
            <>
            <div ref={dv=>this.container=dv}>

            </div>
            <WaterFall ref={wf=>this.chartHeatMap=wf}></WaterFall>
            </>
        ); 
     }
        
}


// export const Spectrum_fun: React.FC = () => {

//      let container=useRef<HTMLDivElement>(null);
//      useEffect(()=>{
//          console.log("use effect in");
//         Highcharts.chart(container.current?container.current:"", {
//             // options - see https://api.highcharts.com/highcharts
//             chart:{
//                 type:"bar",
//             },
//             title: {
//                 text: 'Fruit Consumption'
//             },
//             xAxis: {
//                 categories: ['Apples', 'Bananas', 'Oranges']
//             },
//             yAxis: {
//                 title: {
//                     text: 'Fruit eaten'
//                 }
//             },
//             series:[
//                 {
//                     id:"id1",
//                     name: 'Jane',
//                     type:"column",
//                     data: [1, 0, 4]
//                 } as Highcharts.SeriesColumnOptions,
    
//     {
//                     id:"id2",
//                     name: 'John',
//                     data: [5, 7, 3],
//                     type:"column",
//                 } as Highcharts.SeriesColumnOptions
//             ]
//         });
//      },[]);
//     // Generate the chart
    
//     return (
//         <div id="container" ref={container}></div>
//     );

// }
