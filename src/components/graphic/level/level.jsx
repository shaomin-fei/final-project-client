//@ts-check
import React, { useEffect } from "react";
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import { DataTypeEnum } from "../../../common/data/realtime/parse-data";
Exporting(Highcharts);
Highcharts.setOptions({
        global: {
                //@ts-ignore
                useUTC: false
        }
});
const showCount = 30;
const levels = [];
const options = {
        
  chart: {
        animation:false,
    type: "line",
    marginRight: 10,
    backgroundColor: "#06183d",
    spacingTop: 8,
    spacingBottom: 23,
    //borderWidth: 1,
    //borderColor: "red",
  },
  title: {
    text: "",
  },
  xAxis: {
    type: "datetime",
    //tickAmount:5,
//     tickPixelInterval: 150,
    
    labels: {
      enabled: true,
      style: {
        color: "#ffffff",
      },
//       formatter: function (){
//         Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.value)
//       }
    },
  },
  yAxis: {
    gridLineWidth: 1,
    min: -40,
    max: 100,
    floor: -40,
    ceiling: 100,
    tickInterval: 20,
    //crosshair: true,
    gridLineColor: "gray",
    gridLineDashStyle: "Dash",
    title: {
      text: null,
    },
    labels: {
      enabled: true,
      style: {
        color: "#ffffff",
      },
    },
  },
  tooltip: {
    formatter: function () {
      return (
        "<b>" +
        this.series.name +
        "</b><br/>" +
        Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.x) +
        "<br/>" +
        Highcharts.numberFormat(this.y, 2)
      );
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
            id:"level",
      name: "level",
      color:"green",
      lineWidth: 2.5,
      // 显示50个数据，初始值位-40
      //data: Array(50).fill(-40)
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
};
let container = null;
let chart = null;
function setOptions() {
  //@ts-ignore
  chart = Highcharts.chart(container, options);
}
export function reset(){
  levels.splice(0,levels.length);
  chart&&chart.get("level").setData([]);
}
const LevelGraph = function (props) {
  useEffect(() => {
    setOptions();
    setTimeout(() => {
      chart.reflow();
    }, 10);
  }, []);
  return (
    <div
      ref={(dv) => (container = dv)}
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
};
export default LevelGraph;
export function resizeChart() {
  chart && chart.reflow();
}
export function setData(data) {
        //debugger
  if(!chart){
    return;
  }
  if (data.has(DataTypeEnum.Level)) {
    const level = data.get(DataTypeEnum.Level);
    if (levels.length >= showCount) {
      levels.shift();
    }
    levels.push([new Date().getTime(),level]);
   chart&&chart.get("level").setData([...levels]);
  }
}
