//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-26 23:07:33
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-28 17:57:48
 */
import Utils from "../../utils/utils";
export class AudioData{
    /**
     * @type {WaveFormate}
     */
    wf;

    audioLen=0;
    /**
     * @type {Int8Array}
     */
    audioData;
}
export class WaveFormate{
    formatTag=0;
    channels=1;
    samplePerSec=0;
    avgBytesPerSec=0;
    blockAlign=0;
    bitsPerSample=0;
    cbSize=0;
}
/**
 * @Date: 2020-08-28 15:25:40
 * @Description: 
 * @param {ArrayBuffer} pcmData
 * @param {WaveFormate} wf
 * @return {Int8Array} 
 */
function addWavHead(pcmData,wf){
    const waveData=new ArrayBuffer(44+pcmData.byteLength);
    const dataView=new DataView(waveData);
    let index=0;
    const chunkID=Utils.str2ArrayBuf("RIFF");
    const chunkBuff=new Uint8Array(waveData,0,4);
    chunkBuff.set(chunkID,index);
    index+=4;
    dataView.setUint32(index,36+pcmData.byteLength,true);
    index+=4;
    writeString(waveData,"WAVE",index);
    index+=4;
    writeString(waveData,"fmt ",index);
    index+=4;
    dataView.setUint32(index,16,true);
    index+=4;
    dataView.setUint16(index,1,true);
    index+=2;
    dataView.setUint16(index,wf.channels,true);
    index+=2;
    dataView.setUint32(index,wf.samplePerSec,true);
    index+=4;
    dataView.setUint32(index,
        wf.channels * wf.samplePerSec * (wf.bitsPerSample / 8),true);
    index+=4;
    dataView.setUint16(index,wf.channels * (wf.bitsPerSample / 8),true);
    index+=2;
    dataView.setUint16(index,wf.bitsPerSample,true);
    index+=2;
    writeString(waveData,"data",index);
    index+=4;
    dataView.setUint32(index,pcmData.byteLength,true);
    index+=4;
    const audioDataBuf=new Int8Array(waveData,index,pcmData.byteLength);
    audioDataBuf.set(new Int8Array(pcmData) ,0);
    return new Int8Array(waveData) ;
    
    
}
/**
 * @Date: 2020-08-28 15:41:11
 * @Description: 
 * @param {ArrayBuffer} waveData
 * @param {string} content
 * @param {number} offset 
 * @return {void} 
 */
function writeString(waveData,content,offset){
    const temp=Utils.str2ArrayBuf(content);
    const buf=new Uint8Array(waveData,offset,temp.length);
    buf.set(temp,0);
}
/**
 * @Date: 2020-08-28 00:10:49
 * @Description: 
 * @param {Int8Array} data
 * @return {WaveFormate} 
 */
export function parseWaveFormate(data,offset){

    let index=0;
    const dataView=new DataView(data.buffer,offset);
    const wf=new WaveFormate();
    wf.formatTag=dataView.getInt16(index,true);
    index+=2;
    wf.channels=dataView.getInt16(index,true);
    index+=2;
    wf.samplePerSec=dataView.getInt32(index,true);
    index+=4;
    wf.avgBytesPerSec=dataView.getFloat32(index,true);
    index+=4;
    wf.blockAlign=dataView.getInt16(index,true);
    index+=2;
    wf.bitsPerSample=dataView.getInt16(index,true);
    index+=2;
    wf.cbSize=dataView.getInt16(index,true);
    index+=2;
    return wf;

}
/**
 * @Date: 2020-08-28 00:10:49
 * @Description: 
 * @param {Int8Array} data
 * @return {AudioData} 
 */
export function parseAudio(data,offset){

    let index=0;
    const dataView=new DataView(data.buffer,offset);
    const audioData=new AudioData();
    audioData.wf=parseWaveFormate(data,offset);
    index+=18;
    audioData.audioLen=dataView.getInt32(index,true);
    index+=4;
   
    const audioDataTemp=data.buffer.slice(offset+index,offset+index+audioData.audioLen);
 
    audioData.audioData= addWavHead(audioDataTemp,audioData.wf);
    // audioData.audioData=new Float32Array(audioData.audioLen);
  
    // let indexOfData=0;
    // for(let i=0;i<audioData.audioLen;i++){
    //     audioData.audioData[indexOfData++] =(dataView.getInt8(index));
    //     index++;
    // }
   
    return audioData;
    
}
/**
 * @Date: 2020-08-28 00:10:49
 * @Description: 
 * @param {Int8Array} data
 * @return {AudioData} 
 */
export function parseRawAudio(data,offset){
    let index=0;
    const dataView=new DataView(data.buffer,offset);
    const audioData=new AudioData();
    audioData.wf=parseWaveFormate(data,offset);
    index+=18;
    audioData.audioLen=dataView.getInt32(index,true);
    index+=4;
    audioData.audioData=data.slice(offset+index,offset+index+audioData.audioLen);
    return audioData;
}