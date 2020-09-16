//@ts-check
import React,{useReducer,useRef} from "react";
import { Tooltip } from 'antd';
import 'antd/dist/antd.css';

import APIConfigEnum from "../../config/api-config";
import picFolder from "../../imgs/icon/file/dir.png";
import picFile from "../../imgs/icon/file/file.png";
import "./data-manage.css";
import { useEffect } from "react";

class SingleFileInfo{
    name="";
    type="folder";//folder or file
    constructor(name,type="folder"){
        this.name=name;
        this.type=type;
    }
}
class StateInfo{
    pathInfo=["root"];
    /**
     * @type {Array<SingleFileInfo>}
     */
    fileInfo=[];
    downloadLink="";
}
function reducer(prestate,{type,data}){
    switch (type){
        case "folderChange":{
            if(!data){
                return new StateInfo();
            }
            return {...prestate,fileInfo:data};
        }
        case "dbFolder":{
            return {...prestate,fileInfo:[], pathInfo:[...prestate.pathInfo,">"+data.name]};
        }
        case "folderSplice":{
            return {...prestate,fileInfo:[],pathInfo:data};
        }
        case "linkChange":{
            return {...prestate,downloadLink:data};
        }
        default:
            return prestate;
    }
}
const FileToDownload=function(props){
    let folderData=props.folderData;
    
    //const init=new StateInfo();
    // init.fileInfo.push(new SingleFileInfo("Virtual-001"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-002"));

    // init.fileInfo.push(new SingleFileInfo("Virtual-003","file"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-004","file"));

    // init.fileInfo.push(new SingleFileInfo("Virtual-005","file"));
    // init.fileInfo.push(new SingleFileInfo("Virtual-006","file"));

    const downloadLink=useRef();
    /**
     * @type {[StateInfo, React.Dispatch<object>]}
     */
    const [stateInfo,dispatch]=useReducer(reducer,new StateInfo());
    useEffect(()=>{
        props.getFilesCallback("root");
    },[]);
    useEffect(()=>{
        dispatch({type:"folderChange",data:folderData});
    },[folderData]);

    useEffect(()=>{
        props.getFilesCallback(getPath([...stateInfo.pathInfo]));
    },[stateInfo.pathInfo]);

    useEffect(()=>{
        if(stateInfo.downloadLink){
            downloadLink.current.click();
        }
    },[stateInfo.downloadLink]);

    

    function pathClick(path,index){
        const pathInfo=stateInfo.pathInfo;
        const current=pathInfo.slice(0,index+1);
        dispatch({type:"folderSplice",data:current});
       
    }
    function getPath(pathInfo){
        
        if(pathInfo.length>1){
            pathInfo.splice(0,1);
        }
        let strPath="";
        pathInfo.forEach(pa=>{
            if(strPath){
                strPath+="/";
            }
            pa=pa.replace(">","/");
            strPath+=pa;
        })
        return strPath;
    }
    /**
     * @Date: 2020-09-10 23:00:20
     * @Description: 
     * @param {SingleFileInfo} fileInfo
     * @return {void} 
     */
    function fileDbClick(fileInfo,e){
        let type="dbFile";
        if(fileInfo.type==="folder"){
            type="dbFolder";
            //get content from server

            dispatch({type,data:fileInfo});

            //props.getFilesCallback(getPath());
        }else{
            //download file from server
            let path="http://localhost:3005/downLoad" //APIConfigEnum.download;
            let temp=getPath([...stateInfo.pathInfo]);
            if(temp==="root"){
                temp="";
            }
            path+=`?filePath=${temp}&fileName=${fileInfo.name}`;
            dispatch({type:"linkChange",data:path});
        }
        
    }
    return (
        <>
        <div className="head_box">
            <span>Files</span>
        </div>
        <div className="file_list">
            <div className="file_path">
                {
                    stateInfo.pathInfo.map((path,index)=>{
                        return (
                        <span key={index} onClick={e=>pathClick(path,index)}>{path}</span>
                        )
                    })
                }
            </div>
            <div className="file_content">
                {
                    stateInfo.fileInfo.map((fileInfo,index)=>{
                        let img=picFolder;
                        if(fileInfo.type==="file"){
                            img=picFile;
                        }
                        return (
                            <Tooltip key={index} placement="bottom" title={fileInfo.name}>
                                <div className="single_file_container" onDoubleClick={e=>fileDbClick(fileInfo,e)}>
                                    <img src={img} alt=""/>
                                    <div>{fileInfo.name}</div>
                                </div>
                                </Tooltip>
                        )

                    })
                }
            </div>
        </div>
        <a href={stateInfo.downloadLink} ref={downloadLink}></a>
        </>
    );
}
export default FileToDownload;