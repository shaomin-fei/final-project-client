//@ts-check
import React,{useReducer} from "react";
import { Tooltip } from 'antd';
import 'antd/dist/antd.css';

import picFolder from "../../imgs/icon/file/dir.png";
import picFile from "../../imgs/icon/file/file.png";
import "./data-manage.css";

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
}
function reducer(prestate,action){
    switch (action.type){
        default:
            return prestate;
    }
}
const FileToDownload=function(props){
    const init=new StateInfo();
    init.fileInfo.push(new SingleFileInfo("Virtual-001"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));
    init.fileInfo.push(new SingleFileInfo("Virtual-002"));

    init.fileInfo.push(new SingleFileInfo("Virtual-003","file"));
    init.fileInfo.push(new SingleFileInfo("Virtual-004","file"));

    init.fileInfo.push(new SingleFileInfo("Virtual-005","file"));
    init.fileInfo.push(new SingleFileInfo("Virtual-006","file"));
    /**
     * @type {[StateInfo, React.Dispatch<object>]}
     */
    const [stateInfo,dispatch]=useReducer(reducer,init);
    function pathClick(path){

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

            dispatch({type,fileInfo});
        }else{
            //download file from server
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
                        <span key={index} onClick={e=>pathClick(path)}>{path}</span>
                        )
                    })
                }
            </div>
            <div className="file_content">
                {
                    stateInfo.fileInfo.map(fileInfo=>{
                        let img=picFolder;
                        if(fileInfo.type==="file"){
                            img=picFile;
                        }
                        return (
                            <Tooltip placement="bottom" title={fileInfo.name}>
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
        </>
    );
}
export default FileToDownload;