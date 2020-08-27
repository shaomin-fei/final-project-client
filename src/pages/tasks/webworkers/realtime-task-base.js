//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-25 20:22:38
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-27 02:17:07
 */
import socketIOClient from "socket.io-client"

import {ExecuteParam} from "../tasks-common";
import WorkerParam from "../../../config/worker-param";
import CmdDefineEnum from "../../../workers/cmd-define";
import Utils from "../../../common/utils/utils";
import { array } from "prop-types";

export default class RealtimeTaskBase{
    /**
     * @type {SocketIOClient.Socket}
     */
    socketIO=null;
    currentParam=null;
    interval=null;
    postTimeInterval=200;
    /**
     * @Date: 2020-08-26 08:50:12
     * @Description: 
     * @param {ExecuteParam} params
     * @return {void} 
     */
    start(params){
        this.currentParam=params;
        this.stop();
        //this.closeSocket();
        this.socketIO=socketIOClient(params.url,{
            autoConnect:false
        });
        this.socketIO.connect();
        this.socketIO.on("connect_error",this.callbackConnectError);
        this.socketIO.on("connect_timeout",this.callbackConnectError);
        this.socketIO.on("error",this.callbackConnectError);
        this.socketIO.on("realtime_task_data",this.callbackDatacome);
        this.socketIO.on("connect",this.callbackConnected);
    }
    callbackConnected=()=>{
        console.log("connected",this.currentParam);
        this.socketIO.emit("startTask",this.currentParam,(ack)=>{
            //ack is the task id in server
            if(ack){
                console.log("ack",ack);
                this.currentParam.taskid=ack;
                //@ts-ignore
                postMessage(new WorkerParam(CmdDefineEnum.cmdStartTaskSucceed,ack));
                this.interval&&clearInterval(this.interval);
                this.interval=setInterval(() => {
                    this.timeTriggered();
                }, this.postTimeInterval);
            }
        });
    }
    timeTriggered(){

    }
    stop(){
        //console.log("stop in",this.socketIO);
        this.interval&&clearInterval(this.interval);
        try{
            if(this.socketIO&&this.socketIO.connected){
                if(this.currentParam&&this.currentParam.taskid){
                    this.socketIO.emit("stopTask",{taskId:this.currentParam.taskid},(ack)=>{
                        if(ack){
                            //@ts-ignore
                            postMessage(new WorkerParam(CmdDefineEnum.cmdStopTaskSucceed,ack));
                        }
                    });
                }
              this.closeSocket();
            }
        }catch(e){
            //@ts-ignore
            postMessage(new WorkerParam(CmdDefineEnum.cmdSocketError,e));
        }
        

    }
    /**
     * 
     * @param {ArrayBuffer} data 
     */
    callbackDatacome=(data)=>{
        let index=0;
        while(index<data.byteLength){
            const dataView=new DataView(data,index);
            const len=dataView.getInt32(index,true);
            index+=4;
            const szType=data.slice(index,20);
            let type=Utils.arrayBuf2Utf8(szType);
            const indexOf=type.indexOf("\0");
            type=type.substring(0,indexOf);
            //console.log("data type",type,indexOf,type.length);
            index+=20;
            this.handleBusinessData(type,data,index-24,len);//带完整头穿过去
            index+=(len-24);
            // if(type==="Spectrum"){

            // }else if(type==="IQ"){

            // }else if(type==="ITU"){

            // }else if(type==="Audio"){

            // }else if(type==="Level"){

            // }
        }
       
        
    }
    /**
     * @Date: 2020-08-26 23:27:23
     * @Description: 
     * @param {string} type
     * @param {ArrayBuffer} array
     * @param {number} offset
     * @return {void} 
     */
    handleBusinessData(type,array,offset,dataLen){}
        
    
    callbackConnectError=(error)=>{
        //@ts-ignore
        postMessage(new WorkerParam(CmdDefineEnum.cmdSocketError,error));
    }
    closeSocket(){
        if(this.socketIO){
            this.socketIO.removeAllListeners();
            this.socketIO.close();
        }
        this.socketIO=null;
    }
}
