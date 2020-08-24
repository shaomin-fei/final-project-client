import React, { Component } from 'react';


export default class ColorCircle extends Component{

    render(){
        let {color,width,height}=this.props;
        if(!color){
            color="green";
        }
        if(!width){
            width=12;
        }
        if(!height){
            height=12;
        }
        let radius=width*0.5;//+"px";
        // width+="px";
        // height+="px";
        
        return (
            <div style={
                {
                    background:color,
                    width:width,
                    height:height,
                    borderRadius:radius,
                    margin:"6px 6px"
                }
            }></div>
        );
    }
}