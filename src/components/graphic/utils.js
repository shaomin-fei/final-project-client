/*******
 * @param {} event
 * @return {number[]} number[0] xAxis.min number[1] xAxis.max
 */
export class SpectrumUtils 
{
    static ZoomXaxies(event,tick=10){
        if (event.xAxis) {
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