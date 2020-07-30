/* eslint no-undef: "off" */
import React, { Component } from "react";
//import * as Highcharts from '../../thirdparty/Highcharts-8.1.2/code/highcharts.src';
//const Highcharts=require('../../thirdparty/Highcharts-8.1.2/code/highcharts.src');
//import  Highcharts from '../../thirdparty/Highcharts-8.1.2/code/es-modules/masters/highcharts.src';
// Alternatively, this is how to load Highstock. Highmaps is similar.
// import Highcharts from 'highcharts/highstock';

import Highcharts from "../../thirdparty/Highcharts-8.1.2/code/highcharts.src.js";
import { number } from "prop-types";

import { SpectrumUtils } from "./utils";

/**
 * This plugin extends Highcharts in two ways:
 * - Use HTML5 canvas instead of SVG for rendering of the heatmap squares. Canvas
 *   outperforms SVG when it comes to thousands of single shapes.
 * - Add a K-D-tree to find the nearest point on mouse move. Since we no longer have SVG shapes
 *   to capture mouseovers, we need another way of detecting hover points for the tooltip.
 */

function arrayMax(data) {
  var i = data.length,
    max = data[0];
  while (i--) {
    if (data[i] > max) {
      max = data[i];
    }
  }
  return max;
}
export default class WaterFall extends Component {
  constructor(props) {
    super(props);
    this.heatMapContainer = null;
    this.lstHeatMapData = [];
    this.chartHeatMap = null;
    this.heatMapCount = 30;
    //this.newAddedPoints=[];
  }
  // 用箭头函数，否则需要绑定this
  ZoomX = (event) => {
    //console.log(this);
    //console.log(this.chartHeatMap);
    const [min, max] = SpectrumUtils.ZoomXaxies(
      event,
      this.chartHeatMap.xAxis[0].tickInterval
    );
    const series=this.chartHeatMap.get("waterfall");
    series.reDrawImg(series);
    
    this.props.waterFallXaxisZoomedCallback(min, max);
    return false;
  };
  updateData(data, animation) {
   
    if (this.points) {
        //this.points[0].x=100;
      this.points.splice(0, this.points.length);
    }
    if (this.data) {
      this.data.splice(0, this.data.length);
    }
    if (this.processedXData) {
      this.processedXData.splice(0, this.processedXData.length);
    }
    if (this.processedYData) {
      this.processedYData.splice(0, this.processedYData.length);
    }
    if (this.options.data) {
      this.options.data.splice(0, this.options.data.length);
    }
    if (this.valueData) {
      this.valueData.splice(0, this.valueData.length);
    }
    const dataIn=Date.now();
    data.forEach(function (point) {
      this.addPoint(point, false, null, null, false);
    }, this);
    console.log("new update",Date.now()-dataIn);
    if (this.xIncrement === null && this.xData && this.xData.length) {
      this.xIncrement = arrayMax(this.xData);
      this.autoIncrement();
    }
    
    return true;

    //console.log("child update");
  }
 
  redraw(animation){
    this.chartHeatMap.redraw(animation);
  }
  setData(yData,bDraw) {
    if (yData) {
      let data = [];
      let dataShow = [];
      for (let i = 0; i < yData.length; i++) {
        const temp = [i, this.heatMapCount, yData[i]];
        data.push(temp);
        dataShow.push(temp);
      }
      if (this.lstHeatMapData.length === this.heatMapCount) {
        this.lstHeatMapData.pop();
      }
      this.lstHeatMapData.splice(0, 0, data);

      // the first row is the newest one,we don't need to modify its col index
      for (let i = 1; i < this.lstHeatMapData.length; i++) {
        let eachRow = this.lstHeatMapData[i];
        eachRow.forEach((eachPoint) => {
          eachPoint[1]--;
          //we can't use data to add the point,becaue data is the ref, it included in lstHeatMapdata,
          //if we changed it here,the data in lst will be changed too
          dataShow.push(eachPoint);
        });
      }

      if (this.chartHeatMap) {
        //(this.chartHeatMap.get("waterfall") as Highcharts.Series).setData(dataShowTemp,true,false,true);
        //(this.chartHeatMap.get("waterfall") ).setData([],false);
        const date=Date.now();
        this.chartHeatMap.get("waterfall").thisData=data;
        this.chartHeatMap.get("waterfall").setData(dataShow, bDraw);
        console.log("set data",Date.now()-date);

        // (this.chartHeatMap.get("waterfall")).update({
        //     type:"heatmap",
        //     data:dataShow,
        // },true);
      }
    }
  }

  componentDidMount() {
    this.setHeatMapOptions();
    ExtendChart();
  }
  /*****
   * @param {number} min
   * @param {number} max
   */
  ChangeExtremes(min, max) {
    this.chartHeatMap && this.chartHeatMap.xAxis[0].setExtremes(min, max);
    const series= this.chartHeatMap.get("waterfall");
    series.reDrawImg(series);
  }
  setHeatMapOptions() {
    //    do not use boost when using wrap,or wrapped function drawpoints will no invoke
    //:Highcharts.Options
    //@type {Highcharts.Options}
    const options = {
      title: {
        text: "",
      },
      chart: {
        events: {
          selection: this.ZoomX,
        },
        type: "heatmap",
        zoomType: "x",
        resetZoomButton: {
          theme: {
            // do not show the deafult button
            //resetChartZoom() function can reset to the original
            display: "none",
          },
        },
        borderWidth: 1,
        borderColor: "red",
        height: (9 / 16) * 100 + "%", // 16:9 ratio
      },
      boost: {
        enabled: false,
        // usePreallocated:true,
        // useAlpha:false,
        // useGPUTranslations: true,
      },

      
      exporting: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: "",
        },
        ///opposite:true,
        gridLineWidth: 0,
        tickLength: 0,
        labels: {
          enabled: false,
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        max: this.heatMapCount,
        min: 0,
        //crosshair:true,
        //tickPositions: [0, 6, 12, 18, 24],
        //tickWidth: 1,
        //min: 0,
        //max: 23,
        //reversed: true
      },
      xAxis: {
        categories: [],
        tickInterval: 10,
        visible: false,
        // sync X to spectrum
        event: {
          setExtremes: this.props.waterFallXaxisZoomedCallback,
        },
        // type: 'linear',
        crosshair: true,
        // x axis goes to upper side
        opposite: true,
        title: {
          text: "频率(MHz)",
          style: {
            color: "#E0E0E3",
          },
        },
        // type: 'datetime',
        // min: Date.UTC(2017, 0, 1),
        // max: Date.UTC(2017, 11, 31, 23, 59, 59),

        // showLastLabel: false,
        // tickLength: 16
        //reversed:true
      },
      colorAxis: {
        minColor: "#3060cf",
        maxColor: "#c4463a",
        stops: [
          [0, "DarkBlue"],
          [0.2, "CornflowerBlue"],
          [0.4, "DarkGreen"],
          [0.6, "Chartreuse"],
          [0.8, "Yellow"],
          [1, "red"],
        ],
        min: -40,
        max: 100,
        startOnTick: false,
        endOnTick: false,
        tickLength: 0,
        tickWidth: 0,

        //   marker:{
        //       color:"red"
        //   },
        //不显示颜色间隔之间的小横线
        gridLineWidth: 0,
        labels: {
          //    do not show text next to the axis
          enabled: false,
        },
      },
      legend: {
        align: "left",
        layout: "vertical",
        margin: 0,
        verticalAlign: "top",
        y: 0,
        x: 0,
        //do not show triangle when it's longer than the height of the plot area
        navigation: {
          enabled: false,
        },
       
        symbolHeight: this.chartHeatMap?.plotHeight,
      },

      series: [
        {
          //boostThreshold: 100,
          id: "waterfall",
          name: "waterfall",
          type: "heatmap",
        //   events:{
        //     addPoint:this.pointAdded
        // },
          nullColor: "#EFEFEF",
          // dataLabels: {
          //     enabled: true,
          //     color: '#000000'
          // },
          //colsize: 5000, // one day
          tooltip: {
            headerFormat: "time<br/>",
            pointFormat:
              "{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} </b>",
          },
          turboThreshold: Number.MAX_VALUE, // #3404, remove after 4.0.5 release
        },
      ],
    };

    this.chartHeatMap = Highcharts.chart(this.heatMapContainer, options);
    //    replace  update function and speed up the process
    this.chartHeatMap.get("waterfall").__proto__.updateData = this.updateData;

    this.chartHeatMap.get("waterfall").thisData=[];

    //this.chartHeatMap.get("waterfall").Zoomed=reDrawImg;

    
    //update the legend height
    this.chartHeatMap.legend.update(
      { symbolHeight: this.chartHeatMap?.plotHeight },
      true
    );
  }

  render() {
    return <div ref={(dv) => (this.heatMapContainer = dv)}></div>;
  }
}

const ExtendChart = () => {
  (function (H) {
    var Series = H.Series,
      each = H.each;

    /**
     * Create a hidden canvas to draw the graph on. The contents is later copied over
     * to an SVG image element.
     */
    Series.prototype.getContext = function () {
      if (!this.canvas) {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", this.chart.chartWidth);
        this.canvas.setAttribute("height", this.chart.chartHeight);
        this.image = this.chart.renderer
          .image("", 0, 0, this.chart.chartWidth, this.chart.chartHeight)
          .add(this.group);
        this.ctx = this.canvas.getContext("2d");

        // 创建瀑布图(隐藏状态，用于保存已生成的图像)
        this.waterFallCanvas = document.createElement("canvas");
        this.waterFallCanvas.setAttribute("width", this.chart.chartWidth);
        this.waterFallCanvas.setAttribute("height", this.chart.chartHeight);
        this.waterFallCtx = this.waterFallCanvas.getContext("2d");

        // this.heightOfEachPoint=1;
        // this.widthOfEachPoint=10;
      }
      return { ctx: this.ctx, waterFallCtx: this.waterFallCtx };
    };

    /**
     * Draw the canvas image inside an SVG image
     */
    Series.prototype.canvasToSVG = function () {
      this.image.attr({ href: this.waterFallCanvas.toDataURL("image/png") });
    };

    Series.prototype.reDrawImg= function (series){
      series.points.forEach(point=>{

        var plotY = point.plotY,
          shapeArgs,
          pointAttr;

        if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
          shapeArgs = point.shapeArgs;

          pointAttr =
            (point.pointAttr && point.pointAttr[""]) ||
            point.series.pointAttribs(point);

         
            series.waterFallCtx.fillStyle = pointAttr.fill;
            series.waterFallCtx.fillRect(
            shapeArgs.x,
            shapeArgs.y,
            shapeArgs.width,
            shapeArgs.height
          );
        }
     });
     series.canvasToSVG();
    }
    /**
     * Wrap the drawPoints method to draw the points in canvas instead of the slower SVG,
     * that requires one shape each point.
     * @param {Highcharts.Series} this
     */
    H.wrap(H.seriesTypes.heatmap.prototype, "drawPoints", function () {
      //const dateIn=Date.now();
      var { ctx, waterFallCtx } = this.getContext();
      if (1) {

        
        const getPoint=(data)=>{
            const pt= this.points.find(pt=>{
                if(pt.x===data[0]&&pt.y===data[1]){
                    return true;
                }
                return false;
             });
             return pt;
         }
         
         // 绘制单行图像
     const rowToImageData= (data)=> {
        //在points查找data,找不到有可能是在缩放 外面，points是可视区的点 
        let pointNew=[];
        
       pointNew=(()=>{
            const dateIn=Date.now();
            let pts=[];
            data.forEach((dt)=>{
                let pt=getPoint(dt);
                pt&&pts.push(pt);

            });
            console.log("find points",Date.now()-dateIn);
            return pts;

        })();

        //draw first line
        //const count=this.points.length/801;
        const dateRec=Date.now();
        //if()
        if(pointNew.length>0){
            // 将已生成的图像向下移动一个点的位置
          
          const pt=pointNew[0];
          this.waterFallCtx.drawImage(
            this.waterFallCtx.canvas,
            0,
            0,
           //(this.xAxis.dataMax-this.xAxis.dataMin)*pt.shapeArgs.width,
           this.waterFallCanvas.width,
            this.waterFallCanvas.height,
            //count*pt.shapeArgs.height,
            0,
            pt.shapeArgs.height,
            //(this.xAxis.dataMax-this.xAxis.dataMin)*pt.shapeArgs.width,
            this.waterFallCanvas.width,
            //count*pt.shapeArgs.height,
            this.waterFallCanvas.height
          );
        }
        // this.xAxis.dataMin
        // this.xAxis.dataMax
        pointNew.forEach(point=>{

           var plotY = point.plotY,
             shapeArgs,
             pointAttr;
 
           if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
             shapeArgs = point.shapeArgs;
 
             pointAttr =
               (point.pointAttr && point.pointAttr[""]) ||
               point.series.pointAttribs(point);
 
            
             this.waterFallCtx.fillStyle = pointAttr.fill;
             this.waterFallCtx.fillRect(
               shapeArgs.x,
               shapeArgs.y,
               shapeArgs.width,
               shapeArgs.height
             );
           }
        });
        console.log("draw rect",Date.now()-dateRec);

     
     };
        const drawImage= ()=> {
            const dateIn=Date.now();
            const width = this.ctx.canvas.width
            const height = this.ctx.canvas.height
            if (!this.waterFallCtx.canvas.width) {
                return
            }
            this.ctx.drawImage(this.waterFallCtx.canvas,
              0, 0, this.waterFallCanvas.width, this.waterFallCanvas.height,
              0, 0,
              this.canvas.width, this.canvas.height)
              console.log("drawImage",Date.now()-dateIn);

          }

          const dateIn=Date.now();
        //   试下两个contex绘图的效率怎么杨
        ((data)=> {
          
          //原图下移， 通过数据绘制第一行图像，并插入在第一行像素中
          rowToImageData(data);
          //copy waterfallctx to ctx
          drawImage();
          //const imageData = this.rowToImageData(data);
          //waterFallCtx.putImageData(imageData, 0, 0);
        })(this.thisData);
        

        this.canvasToSVG();
        console.log("new img",Date.now()-dateIn);

        return;
      }
      if (ctx) {
        // draw the columns
        each(this.points, function (point) {
          var plotY = point.plotY,
            shapeArgs,
            pointAttr;

          if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
            shapeArgs = point.shapeArgs;

            pointAttr =
              (point.pointAttr && point.pointAttr[""]) ||
              point.series.pointAttribs(point);

            ctx.fillStyle = pointAttr.fill;
            ctx.fillRect(
              shapeArgs.x,
              shapeArgs.y,
              shapeArgs.width,
              shapeArgs.height
            );
          }
        });

        this.canvasToSVG();
        //console.log("drawPoints",Date.now()-dateIn);
      } else {
        this.chart.showLoading(
          "Your browser doesn't support HTML5 canvas, <br>please use a modern browser"
        );

        // Uncomment this to provide low-level (slow) support in oldIE. It will cause script errors on
        // charts with more than a few thousand points.
        // arguments[0].call(this);
      }
    });

    H.seriesTypes.heatmap.prototype.directTouch = false; // Use k-d-tree
  })(Highcharts);
};
