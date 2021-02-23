//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-27 07:59:32
 * @LastEditors: shaomin fei
 * @LastEditTime: 2021-02-22 23:35:16
 */
  
  import {parseSpectrum} from "./Spectrum";
  import {parseIQ} from "./IQ";
  import {parseITU} from "./ITU";
  import {parseLevel} from "./level";
  //import {playAudio} from
  import Utils from "../../utils/utils";

  import {parseAudio} from "./audio";



  export const DataTypeEnum={
      Spectrum:"Spectrum",
      IQ:"IQ",
      ITU:"ITU",
      Level:"Level",
      Audio:"Audio",
      MaxSpectrum:"maxspectrum",
      MinSpectrum:"minspectrum",
      AvgSpectrum:"avgspectrum",
  }
  /**
   * @type {Map<string,function>}
   */
  const parseFunc=new Map();
  parseFunc.set(DataTypeEnum.Spectrum,parseSpectrum);
  parseFunc.set(DataTypeEnum.MaxSpectrum,parseSpectrum);
  parseFunc.set(DataTypeEnum.MinSpectrum,parseSpectrum);
  parseFunc.set(DataTypeEnum.AvgSpectrum,parseSpectrum);
  parseFunc.set(DataTypeEnum.IQ,parseIQ);
  parseFunc.set(DataTypeEnum.ITU,parseITU);
  parseFunc.set(DataTypeEnum.Level,parseLevel);
  /**
     * 
     * @param {Int8Array} data 
     * @return {Map<string,object>} key is the data type,enumed in DataTypeEnum,value is the data structure
     */
export function parseData(data,factor=0.1,original=true){

    let index=0;
    
    const mapData=new Map();
        while(index<data.byteLength){
            let dataView=null;
            let currentPackageIndex=0;
            if(data instanceof Int8Array){
                dataView=new DataView(data.buffer,index);
            }else{
                dataView=new DataView(data,index);
            }
            const len=dataView.getInt32(currentPackageIndex,true);
            currentPackageIndex+=4;
            let szType=null;
            // if(isInt8Arra){
            //     szType=data.buffer.slice(index+currentPackageIndex,index+currentPackageIndex+20);
            // }else{
                szType=data.slice(index+currentPackageIndex,index+currentPackageIndex+20);
           // }
           
            let type=Utils.arrayBuf2Utf8(szType);
            const indexOf=type.indexOf("\0");
            type=type.substring(0,indexOf);
            currentPackageIndex+=20;
            if(type===DataTypeEnum.ITU){
                
                let szITU=data.subarray(index,index+len);
                const itu=Utils.arrayBuf2Gb(szITU);
                mapData.set(DataTypeEnum.ITU,itu);
            }else if(type===DataTypeEnum.Audio){
                const audioData=parseAudio(data,index+currentPackageIndex);
                mapData.set(DataTypeEnum.Audio,audioData);
            }else if(type===DataTypeEnum.Level){
                mapData.set(DataTypeEnum.Level,dataView.getInt16(currentPackageIndex,true)*0.1);
            }else {
                if(parseFunc.has(type)){
                    const reslut= parseFunc.get(type)(data,index+currentPackageIndex,factor,original);
                    mapData.set(type,reslut);
                 }else{
                     console.error("cann't analyze data type:"+type);
                 }
            }
           
            index+=(len);
        }
        return mapData;
}