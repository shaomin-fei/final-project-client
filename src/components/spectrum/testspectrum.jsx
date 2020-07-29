/*
 * @Author: shaomin fei
 * @Date: 2020-07-24 14:17:39
 * @LastEditTime: 2020-07-28 16:52:26
 * @LastEditors: shaomin fei
 * @Description: test spectrum component
 * @FilePath: \rms-ui\src\components\spectrum\testspectrum.jsx
 */ 
import React,{useState,useEffect, useRef} from 'react';


import Spectrum,{IDataPoint} from './temple';
import { List } from 'immutable';


let packageCount=1;
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return Math.round((Math.random() * minNum + 1));
      case 2:
        return Math.round((Math.random() * ( maxNum - minNum + 1 ) + minNum));
        //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
      default:
        return 0;
    }
  }
  const count=801;
    const start=88,end=108;
    const step=((end-start)*1000/(count-1));

/**
 * @Author: shaomin fei
 * @description: 
 * @Date: 2020-07-28 13:26:51
 * @param {type} 
 * @return: {number[]}
 */    
function generateData(){
    let data=[];
    
    for(let i=0;i<count;i++){
        //data.push({x:start+(step*i)/1000.0,y:randomNum(-40,100)});
        data.push(randomNum(-40,80));
    }
    return data;
}


export const WrpperSpectrumTest=()=>{

    let [specData,setSpecData]= useState([]);
    let wrapperAttr={
        interval:null,
        didMount:false
    }
    let attr=useRef(wrapperAttr);
    //@type {Spectrum}{}
    let spec=useRef(null);
    useEffect(()=>{
        console.log("WrpperSpectrumTest effect in");
        const {interval}=attr.current;
        if(!attr.current.didMount){
            attr.current.didMount=true;
            attr.current.interval=setInterval(()=>{

                    const data=generateData();
                    packageCount++;
                    spec.current.setData(data);
                    //setSpecData(data);

            },100);
        }
        return ()=>{
            if(interval){
                clearInterval(interval);
            }
            
        }
    }
    ,[]);
    return (
        <Spectrum ref={spec} specAttr={{yData:specData,packageIndex:packageCount,freqMHz:88,freqStepMHz:step/1000}}></Spectrum>
    );
}
