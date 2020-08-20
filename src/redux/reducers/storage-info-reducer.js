//@ts-check
/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-19 23:15:03
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-20 01:24:56
 */
import StationActionType from "../action-types/action-types"

export const initState={
    totalG:1500,
    remainG:1350,
    Spectrum:{
        "max":200,
        "percent":0
    },
    IQ:{
        "max":200,
        "percent":0
    },
    Audio:{
        "max":12,
        "percent":0
    },
    Level:{
        "max":1,
        "percent":0
    },
    ITU:{
        "max":1,
        "percent":0
    },
    Others:{
        "max":8,
        "percent":0
    }

}
function getStorageInfo(state=initState,action){
    switch (action.type){
        case StationActionType.getStorageInfo:{
            if(typeof(action.data)==="string"){
                //most like it's error info
                return action.data;
            }
            return {...action.data};
        }
        default:
            return state;
    }
}
export default getStorageInfo;