/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-07-29 14:31:35
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-28 23:01:05
 */
/*******
 * @param {} event
 * @return {number[]} number[0] xAxis.min number[1] xAxis.max
 */
export class SpectrumUtils 
{
    static ZoomXaxies(event,tick=10){
        if (event.xAxis&&event.xAxis.length>0) {
            let min = event.xAxis[0].min;
            let max = event.xAxis[0].max;
            let xdataL = Math.floor(event.target.series[0].xData.length / (10));
            if (event.target.mouseDownX < event.originalEvent.layerX) {
                event.target.xAxis[0].setExtremes(Math.floor(min), Math.floor(max));
                ///xdataL = Math.round((Math.floor(event.xAxis[0].max) - Math.floor(event.xAxis[0].min)) / (this.props.tick ? this.props.tick : 10))
            } else {
                event.target.xAxis[0].setExtremes(null, null)
                min=null;
                max=null;
            }
            return [min,max];
        }
    }
    
}