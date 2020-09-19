/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-26 22:51:39
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-19 14:07:57
 */
//@ts-check
export class IQData{
    centerFreqHz=0;
    sampleRate=0;
    scalar=1;
    type=1;
    IQCount=0;
    //data=null;
    idata=null;
    qdata=null;

}
export function parseIQ(array,offset){
    const iqData=new IQData();
    let dataView=null;
    if(array instanceof Int8Array){
        dataView=new DataView(array.buffer,offset);
    }else{
        dataView=new DataView(array,offset);
    }
   
    let index=0;
    //@ts-ignore
    if(dataView.getBigUint64){
        iqData.centerFreqHz=Number(dataView.getBigUint64(index,true));
    }else{
        iqData.centerFreqHz=Number(dataView.getUint32(index,true));
    }
    
    index+=8;
    iqData.sampleRate=dataView.getInt32(index,true);
    index+=4;
    iqData.scalar=dataView.getFloat32(index,true);
    index+=4;
    const temp=dataView.getInt32(index,true);
    iqData.type=temp&0x01;
    iqData.IQCount=temp>>>1;
    index+=4;
    // iqData.type=dataView.getInt8(index);
    // index+=1;
    // iqData.IQCount=dataView.getUint32(index,true);
    // index+=4;
    
    if(iqData.type===0){
        
        iqData.idata=new Int16Array(iqData.IQCount);
        
        iqData.qdata=new Int16Array(iqData.IQCount);
        for(let i=0;i<iqData.IQCount;i++){
            iqData.idata[i]=dataView.getInt16(index,true);
            index+=2;
        }
        for(let i=0;i<iqData.IQCount;i++){
            iqData.qdata[i]=dataView.getInt16(index,true);
            index+=2;
        }
        
    }else if(iqData.type===1){
        let tempIQ=new Int16Array(array.buffer,offset+index,iqData.IQCount*2);
        iqData.idata=new Int16Array(iqData.IQCount);
        iqData.qdata=new Int16Array(iqData.IQCount);
        for(let i=0;i<iqData.IQCount*2;i+=2){
            iqData.idata[i]=tempIQ[i];
            iqData.qdata[i]=tempIQ[i+1];
        }
    }
    
   
    return iqData;
}