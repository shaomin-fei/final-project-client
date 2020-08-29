//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-26 22:50:45
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-27 14:14:51
 */
import Utils from "../../utils/utils"
export class SpectrumData{

    type=1;
    //when type=1 use
    centerFreqHz=null;
    span=0;
    //////////////
    // when type=0  use
    startFreqHz=null;
    step=0;
    /////
    segmentCount=0;
    isOver=1;
    totalLen=0;
    startIndex=0;
    currentCount=0;
    /**
     * @type {Int16Array}
     */
    data=null;

}
export function parseSpectrum(array,offset,factor=0.1,original=true){
    const spectrum=new SpectrumData();
    let dataView=null;
    if(array instanceof Int8Array){
        dataView=new DataView(array.buffer,offset);
    }else{
        dataView=new DataView(array,offset);
    }
    let index=0;
    spectrum.type=dataView.getInt8(index);
    index+=1;
    if(spectrum.type===1){
        spectrum.centerFreqHz=(dataView.getBigUint64(index,true));
        index+=8;
        spectrum.span=dataView.getInt32(index,true);
        index+=4;
    }else if(spectrum.type===0){
        spectrum.startFreqHz=(dataView.getBigUint64(index,true)) ;
        index+=8;
        spectrum.step=dataView.getInt32(index,true);
        index+=4;
    }
    spectrum.segmentCount=dataView.getInt16(index,true);
    index+=2;
    spectrum.isOver=dataView.getInt8(index);
    index+=1;
    spectrum.totalLen=dataView.getInt32(index,true);
    index+=4;
    spectrum.startIndex=dataView.getInt32(index,true);
    index+=4;
    spectrum.currentCount=dataView.getInt32(index,true);
    index+=4;
    spectrum.data=new Int16Array(spectrum.currentCount);
    //
    if(original){//设备直接来的数据
        for(let i=0;i<spectrum.currentCount;i++){
            spectrum.data[i]=dataView.getInt16(index,true)*factor;
            index+=2;
        }
    }else{
        //已经转过了，可以直接拷贝
        const temp=new Int16Array(array.buffer,index+offset,spectrum.currentCount);
        spectrum.data=temp.subarray(0,spectrum.currentCount);
        //spectrum.data=temp.copyWithin(spectrum.currentCount,)
    }
    
    return spectrum;
}
/**
 * @Date: 2020-08-27 00:01:17
 * @Description: 
 * @param {SpectrumData} spectrum
 * @return {Int8Array} 
 */
export function pack(spectrum,desArray,offset){
    let index=offset;
    const array=desArray;//new Int8Array(spectrum.currentCount*Int16Array.BYTES_PER_ELEMENT+28);
    const  dataView=new DataView(array,0);
    dataView.setInt8(index,spectrum.type);
    index+=1;
    if(spectrum.type===0){
        
        dataView.setBigInt64(index,(spectrum.startFreqHz),true);
        index+=8;
        dataView.setInt32(index,spectrum.step,true);
        index+=4;
    }else if(spectrum.type===1){
        dataView.setBigInt64(index,(spectrum.centerFreqHz),true);
        index+=8;
        dataView.setInt32(index,spectrum.span,true);
        index+=4;
    }
   
    dataView.setInt16(index,spectrum.segmentCount,true);
    index+=2;
    dataView.setInt8(index,spectrum.isOver);
    index+=1;
    dataView.setInt32(index,spectrum.totalLen,true);
    index+=4;
    dataView.setInt32(index,spectrum.startIndex,true);
    index+=4;
    dataView.setInt32(index,spectrum.currentCount,true);
    index+=4;
    //copy spectrum.data to array, place from the position "index" of array
    const arrayInt16=new Int16Array(array,index);
    arrayInt16.set(spectrum.data,0);
    return array;
}
export function packSpectrumToCommon(spectrum,type){
    
    const arrayBuf=new ArrayBuffer(24+spectrum.currentCount*Int16Array.BYTES_PER_ELEMENT+28);
    const dataView=new DataView(arrayBuf);
    const array=new Int8Array(arrayBuf);
    let index=0;
    dataView.setUint32(index,arrayBuf.byteLength,true);
    index+=4;
    const szType=Utils.str2ArrayBuf(type);
    array.set(szType,index);
    index+=20;
    pack(spectrum,arrayBuf,index);
    return array;
}