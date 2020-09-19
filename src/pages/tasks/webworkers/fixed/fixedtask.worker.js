//@ts-check
/*
 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-25 20:24:24
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-19 13:56:49
 */
import RealtimeTaskBase from "../realtime-task-base";
import CmdDefineEnum from "../../../../workers/cmd-define";
import WorkerParam from "../../../../config/worker-param";
import {parseSpectrum,packSpectrumToCommon} from "../../../../common/data/realtime/Spectrum";
import { AudioData, parseRawAudio } from "../../../../common/data/realtime/audio";

//import {parseData} from "../../../../common/data/realtime/parse-data";
//import PlayAudio from "../../../../common/utils/playsound";
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
        this.couldSendData=true;// after ui finish the drawing,then send data

        /**
         * @type {Array<AudioData>}
         */
        this.audios=[]
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
        //this.realSpectrum=new Int8Array(array,offset,dataLen);
        //debugger
        const specData=parseSpectrum(array,offset+24);
        this.realSpectrum=specData;
        if(!this.maxSpectrum){
            this.maxSpectrum={...specData};
            this.maxSpectrum.data=new Int16Array(specData.currentCount).fill(-10000);
            this.minSpectrum={...specData};
            this.minSpectrum.data=new Int16Array(specData.currentCount).fill(10000);
            this.averageSpectrum={...specData};
            //this.averageSpectrum.data=new Int16Array(specData.currentCount);
        }
        for(let i=0;i<specData.currentCount;i++){
            if(specData.data[i]>this.maxSpectrum.data[i]){
                this.maxSpectrum.data[i]=specData.data[i];
            }
            if(specData.data[i]<this.minSpectrum.data[i]){
                this.minSpectrum.data[i]=specData.data[i];
            }
            if(this.count===1){
              this.averageSpectrum.data[i]=this.averageSpectrum.data[i];
            }else{
              this.averageSpectrum.data[i]=(this.averageSpectrum.data[i]*this.count+
                this.averageSpectrum.data[i])/(this.count+1);
            }
            
            
        }
        if(this.count<0){
          this.count=1;
      }
      this.count++;

    } else if (type === "IQ") {
        this.iq=new Int8Array(array,offset,dataLen);
    } else if (type === "ITU") {
        this.itu=new Int8Array(array,offset,dataLen);
    } else if (type === "Audio") {
        const audio=new Int8Array(array,offset,dataLen);
        
        const audioTemp=parseRawAudio(audio,offset+24);
        this.audios.push(audioTemp);
        if(this.audios.length>=5){
          let dataLen=0;//head len of the audio data
          this.audios.forEach(ad=>{
            dataLen+=ad.audioLen;
          });
           //re generate the buffer
          const sendData=new Int8Array(24+22+dataLen);
          let index=0;
          //common header
          const dataView=new DataView(sendData.buffer);
          dataView.setUint32(index,sendData.length,true);
          index+=4;
          const type=audio.slice(index,index+20);
          sendData.set(type,index);
          index+=20;
          //audio data,first waveformate
          const wf=new Int8Array(array,offset+24,22);
          sendData.set(wf,index);
          index+=18;
         //second,audio len
          dataView.setUint32(index,dataLen,true);
          index+=4;
          //third combine audo data
          this.audios.forEach(ad=>{
            sendData.set(ad.audioData,index);
            index+=ad.audioLen;
          });
         this.audios.splice(0,this.audios.length);
          //@ts-ignore
          postMessage(sendData,[sendData.buffer]);
        }
        
       
    } else if (type === "Level") {
        this.level=new Int8Array(array,offset,dataLen);
    }
  };
  

  timeTriggered () {
      let realArray,maxArray,minArray,avgArray;
      let totalLen=0;
      let dataTemp=[];
      if(!this.realSpectrum){
        return;
      }
      if(!this.couldSendData){
        return;
      }
      //debugger
      if(this.realSpectrum){
        realArray=packSpectrumToCommon(this.realSpectrum,"Spectrum");
        totalLen+=realArray.byteLength;
        dataTemp.push(realArray);
      }
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
      postMessage(data,[data.buffer]);
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
    case CmdDefineEnum.cmdCouldSendData:{
      fixedTask.couldSendData=true;
      return;
    }
    default:
      break;
  }
};
