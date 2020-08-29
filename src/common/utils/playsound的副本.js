//@ts-check
/*
 * @Description: 
 https://segmentfault.com/a/1190000011377221
 https://github.com/lq782655835/live-video-demo/blob/master/index.html
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-27 22:41:27
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-28 16:05:46
 */
//@ts-check
//window.AudioContext=window.AudioContext||window.webkitAudioContext;

import {WaveFormate} from "../data/realtime/audio";
//@ts-ignore
window.AudioContext=window.AudioContext||window.webkitAudioContext;
export default class PlayAudio{
    bufferLen=1024*100;
    channel=1;
    sampleRate=22050;
    /**
     * @type {Array<Float32Array>}
     */
    //audioData=[];
    /**
     * @type {Array<AudioBuffer>}
     */
    //audioBuffer=null;
    /**
     * @type {Array<AudioBufferSourceNode>}
     */
    sources=[];
    /**
     * @type {AudioContext}
     */
    context=null;

    hasInit=false;
    isPlaying=false;
    
    /**
     * 
     * @param {WaveFormate} wvFormate 
     */
    initPlay(wvFormate){
        
        if(this.hasInit){
            return;
        }
        this.channel=wvFormate.channels;
        this.sampleRate=wvFormate.samplePerSec;
        this.stop();
         this.context=new AudioContext();
         
         //this.audioBuffer=this.context.createBuffer(this.channel,this.bufferLen,this.sampleRate);
         //this.source=this.context.createBufferSource();
         //this.source.loop=false;
         //this.source.buffer=this.audioBuffer;
        
         //this.source.connect(this.context.destination);
         //this.source.connect(this.context.destination);
         //this.source.onended = this.playNextBuffer;
         //this.source.connect(this.context.destination);
         //onaudioprocess will be triggered when data has cached to 8192;
         /*
         this.source=this.context.createBufferSource();
         this.source.loop=false;
         this.recoder=this.context.createScriptProcessor(8192,1,1);
        this.source.connect(this.recoder);
        this.recoder.connect(this.context.destination);
        this.recoder.onaudioprocess=(ev)=>{
            console.log("audio len",this.audioData.length);
            if(this.audioData.length===0){
                return;
            }
            
            ev.outputBuffer.copyToChannel(this.audioData.shift()||new Float32Array(8192), 0, 0);
        }*/
        this.hasInit=true;
        
    }
   
    // startPlay(){
    //     this.source&&this.source.start();
    // }
    addData(data){
        if(!this.hasInit){
            console.log("add data error,need to be init first");
            return false;
        }
        
        this.context.decodeAudioData(data).then(buffer=>{

            const source=this.context.createBufferSource();
            source.buffer=buffer;
            source.loop=false;
            source.connect(this.context.destination);
            
            source.onended=(ev)=>{
                console.log("end ev:",ev,this.sources.length);
                if(this.sources.length===0){
                    console.log("no data to play");
                    return;
                }
                // ev.target.stop();
                // ev.target.disconnect();
                this.sources.shift().start();
               
              
            }
            this.sources.push(source);
            if(this.sources.length>20&&!this.isPlaying){
                const newSrc=this.sources.shift();
                newSrc.start(0);
                this.isPlaying=true;
            }
        }).catch(err=>{
            console.log("audio decode error",err);
        });
        
       

       
       
        return true;
    }

   
    stop(){
       
        if(!this.hasInit){
            return;
        }
        this.hasInit=false;
        //this.audioData&&this.audioData.splice(0,this.audioData.length);
        
        if(this.isPlaying){
            this.sources.forEach(src=>{
                //src.stop();
                src.disconnect();
            })
            this.sources.splice(0,this.sources.length);
            // this.recoder.disconnect();
            // this.recoder.onaudioprocess=null;
            
            this.context.close();
            
        }
        this.isPlaying=false;
        this.context=null;
        //this.source=null;
    }
}

