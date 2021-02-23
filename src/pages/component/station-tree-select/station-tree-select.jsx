import React, { useMemo, useState,useEffect } from "react";
import "antd/dist/antd.css";
import { TreeSelect} from "antd";


const { SHOW_PARENT } = TreeSelect;
const StationTreeSelect=function(props){
    /**
     * @type {CenterInfo}
     */
    let stationTrees = props.centerInfo;
    let style= {
        width: "180px",
        height: "30px",
      };
    if(props.style){
        style=props.style;
    }
    const stationTreeSelectedChanged=props.stationTreeSelectedChanged;
    const [state,setTreeSelection]=useState({stationTreeChange:stationTrees?[stationTrees.name]:[]});
    useEffect(()=>{
      function invokeStationSelectedChangedCallBack(value){
        if(stationTreeSelectedChanged){
            if(value.length===1&&value[0]===stationTrees.name){
                //select the root, expand the root to children
                
                const selected=stationTrees.stations.map(sta=>{
                    return sta.name;
                });
                stationTreeSelectedChanged(selected);
            }else{
                stationTreeSelectedChanged(value);
            }
           
        }
      }
        invokeStationSelectedChangedCallBack(state.stationTreeChange);
    },[state.stationTreeChange,stationTreeSelectedChanged,stationTrees]);
    /**
     * @Date: 2020-09-16 09:43:11
     * @Description: 
     * @param {Array<string>} value
     * @return {void} 
     */
    function onStationTreeSelcChange(value) {
        setTreeSelection({stationTreeChange:value});
        
      }
      
    let treeData = useMemo(() => {
        //console.log("use memo call");
        if (
          stationTrees &&
          stationTrees.stations &&
          stationTrees.stations.length > 0
        ) {
          const data = [
            {
              title: stationTrees.name,
              value: stationTrees.name,
              key: stationTrees.name,
              children: stationTrees.stations.map((sta) => {
                return {
                  title: sta.name,
                  key: sta.name,
                  value: sta.name,
                };
              }),
            },
          ];
          return data;
        } else {
          return null;
        }
      }, [stationTrees]);
    
      
      const tProps = {
        treeData,
        size: "small",
        bordered: "false",
        value: state.stationTreeChange,
        onChange: onStationTreeSelcChange,
        treeCheckable: true,
        maxTagCount: 1,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: "Please select",
        maxTagPlaceholder: () => {
            return <label style={
              {color:"black",
              fontSize:"0.5rem",
              //marginLeft:"-3px",
              display:"inline-block",
              width:"10px"}
            }>...</label>;
          },
        style: style,
      };
    return (
        <>
        {/* @ts-ignore */}
        <TreeSelect {...tProps} />
        </>
    )
}
export default StationTreeSelect;