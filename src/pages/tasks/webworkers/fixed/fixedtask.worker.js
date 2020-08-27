//@ts-check
/*
 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-25 20:24:24
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-27 02:16:01
 */
import RealtimeTaskBase from "../realtime-task-base";
import CmdDefineEnum from "../../../../workers/cmd-define";
import WorkerParam from "../../../../config/worker-param";
import {SpectrumData,parseSpectrum,packSpectrumToCommon} from "../../../../common/data/realtime/Spectrum";
class FixedTask extends RealtimeTaskBase {

    constructor(){
        super();
        this.maxSpectrum=null;
        this.minSpectrum=null;
        this.averageSpectrum=null;
      
        this.realSpectrum=null;
        this.level=null;
        this.itu=null;
        this.iq=null;
        this.count=1;
    }
   
  /**
   * @Date: 2020-08-26 23:27:23
   * @Description:
   * @param {string} type
   * @param {ArrayBuffer} array
   * @param {number} offset 带commondata 头，
   * @return {void}
   */
  handleBusinessData (type, array, offset,dataLen) {
    if (type === "Spectrum") {
        this.realSpectrum=new Int8Array(array,offset,dataLen);
        const specData=parseSpectrum(array,offset+24);
        if(!this.maxSpectrum){
            this.maxSpectrum={...specData};
            this.minSpectrum={...specData};
            this.averageSpectrum={...specData};
        }
        for(let i=0;i<specData.currentCount;i++){
            if(specData.data[i]>this.maxSpectrum.data[i]){
                this.maxSpectrum.data[i]=specData.data[i];
            }
            if(specData.data[i]<this.minSpectrum.data[i]){
                this.minSpectrum.data[i]=specData.data[i];
            }
            this.averageSpectrum.data[i]=(this.averageSpectrum.data[i]*this.count+
                this.averageSpectrum.data[i])/this.count++;
            if(this.count<0){
                this.count=1;
            }
        }

    } else if (type === "IQ") {
        this.iq=new Int8Array(array,offset,dataLen);
    } else if (type === "ITU") {
        this.itu=new Int8Array(array,offset,dataLen);
    } else if (type === "Audio") {
        const audio=new Int8Array(array,offset,dataLen);
        //@ts-ignore
        postMessage(audio,[audio.buffer]);
    } else if (type === "Level") {
        this.level=new Int8Array(array,offset,dataLen);
    }
  };
  timeTriggered () {
      let maxArray,minArray,avgArray;
      let totalLen=0;
      let dataTemp=[];
      if(this.maxSpectrum){
        maxArray=packSpectrumToCommon(this.maxSpectrum,"maxspectrum");
        totalLen+=maxArray.byteLength;
        dataTemp.push(maxArray);
      }
      if(this.minSpectrum){
        minArray=packSpectrumToCommon(this.minSpectrum,"minspectrum");
        totalLen+=minArray.byteLength;
        dataTemp.push(minArray);
      }
      if(this.averageSpectrum){
        avgArray=packSpectrumToCommon(this.averageSpectrum,"avgspectrum");
        totalLen+=avgArray.byteLength;
        dataTemp.push(avgArray);
      }
      if(this.realSpectrum){
          totalLen+=this.realSpectrum.length;
          dataTemp.push(this.realSpectrum);
      }
      if(this.iq){
          totalLen+=this.iq.length;
          dataTemp.push(this.iq);
      }
      if(this.itu){
          totalLen+=this.itu.length;
          dataTemp.push(this.itu);
      }
      if(this.level){
        totalLen+=this.level.length;
        dataTemp.push(this.level);
      }
      const data=new Int8Array(totalLen);
      let index=0;
      dataTemp.forEach(temp=>{
          //@ts-ignore
          data.set(temp,index);
          index+=temp.byteLength;
      });
      //@ts-ignore
      postMessage(data);
  };
}
const fixedTask = new FixedTask();
console.log("fixedworker load");
onmessage = (ev) => {
  console.log("fixedworker msg", ev);
  /**
   * @type {WorkerParam}
   */
  const param = ev.data;
  switch (param.cmd) {
    case CmdDefineEnum.cmdStartRealtime: {
      fixedTask.start(param.arg);
      return;
    }
    case CmdDefineEnum.cmdStopRealtime: {
      fixedTask.stop();
      return;
    }
    case CmdDefineEnum.cmdStop: {
      //the worker will be terminated by creator
      fixedTask.stop();
      return;
    }
    default:
      break;
  }
};
