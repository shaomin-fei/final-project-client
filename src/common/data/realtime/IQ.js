//@ts-check
export class IQData{
    centerFreqHz=0;
    sampleRate=0;
    scalar=1;
    type=1;
    IQCount=0;
    data=null;
}
export function parseIQ(array,offset){
    const iqData=new IQData();
    const dataView=new DataView(array,offset);
    let index=0;
    //@ts-ignore
    iqData.centerFreqHz=dataView.getBigUint64(index,true);
    index+=8;
    iqData.sampleRate=dataView.getInt32(index,true);
    index+=4;
    iqData.scalar=dataView.getFloat32(index,true);
    index+=4;
    iqData.type=dataView.getInt8(index);
    index+=1;
    iqData.IQCount=dataView.getUint32(index,true);
    index+=4;
    iqData.data=new Int16Array(array,offset+index,iqData.IQCount*2);
    return iqData;
}