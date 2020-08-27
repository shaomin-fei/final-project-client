import React from "react";

export function getParams(){
    return "centerfreq=101.7;bw=120;";
}
export function changeParams({stationid,deviceid,taskname}){
    const key=stationid+"+"+deviceid+"+"+taskname;
    //console.log("changeparam",key);
    const content=localStorage.getItem(key);
    if(content){
        //change contents of list
    }else{
        //todo go to get the param from server and store it
    }
}
const ParamsList =function(props){
    return (
        <>
        </>
    );
}
export default ParamsList;