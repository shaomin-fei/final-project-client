import React,{useState} from "react"

import "./itu.css"
import { DataTypeEnum } from "../../../common/data/realtime/parse-data";
const intiItems=[];
let setItemState=null;
const ITUGraph =function(props){
    const [ituItems,setItemItems]=useState(intiItems);
    setItemState=setItemItems;
    return (
        <div className="tab_container" >
            <table className="tab_itu">
            <thead >
                <tr>
                    <th colSpan={2}>ITU</th>
                </tr>
            </thead>
            <tbody >
                {ituItems.map((item,index)=>{
                    return (
                        <tr key={index} className="table_row">
                    <td className="table_td">{item.name}</td>
                    <td className="table_td">{item.value}</td>
                </tr>
                    );
                })}
            
            </tbody>
            
            </table>
        </div>
    );
}
export default ITUGraph;
export function setData(data){

if(data.has(DataTypeEnum.ITU)){
    if(!setItemState){
        return;
    }
    //
    /**
     * @type {string}
     */
    const itu=data.get(DataTypeEnum.ITU);
    const szSplit=itu.split(";");
    const result=[];
    let index=0;
    szSplit.forEach(split=>{
        const content=split.split("=");
        if(index===0){
            content[0]="Freq Differ"
        }else if(index===1){
            content[0]="Freq Offset"
        }else if(index===2){
            content[0]="Positive Freq Offset"
        }else if(index===3){
            content[0]="Negative Freq Offset"
        }else if(index===4){
            content[0]="XDB BW"
        }
        index++;
        const data={
            name:content[0],
            value:content[1]
        };
        result.push(data);
    });
    setItemState(result);
}
}