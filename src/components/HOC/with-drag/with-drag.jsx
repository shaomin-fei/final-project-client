//@ts-check
import React, { Component } from 'react';
//import ReactDom from "react-dom";

/**
 * @Date: 2020-09-22 16:24:00
 * @Description: 
 * @param {React.ComponentType}  WrappedComponent
 * WrappedComponent must use upper case ,or it will be a warning about " does not exist on type 'JSX.IntrinsicElements'."
 * the lower case if for  built in elements like <div> <a> or <span>,
 * @param {string}  dragDivId header id
 * @param {string}  wholeBoxId whole box id,the position will be changed
 */
 const withDrag=function(WrappedComponent,dragDivId,wholeBoxId){

    return class extends Component{
        mouseClientX=0;
        mouseClientY=0;
        prePointer=null;
       
         
        /**
         * @type {HTMLElement}
         */
        dragHead=null;
          /**
         * @type {HTMLElement}
         */
        wholeBox=null;

        startDrag=false;
        lastClientX=0;
        lastClientY=0;
        componentDidMount(){
            //this.dragHead=document.getElementById(dragDivId);
            //this.dragHead.draggable=true;
            this.wholeBox=document.getElementById(wholeBoxId);
            //this.wholeBox.draggable=true;
            //const temp=ReactDom.findDOMNode(this.wholeBox);
            //console.log("component mount", temp);
            //this.getCurrentPosition();
           
            if(this.wholeBox){
                this.wholeBox.addEventListener("mousedown",this.mouseDown);
                this.wholeBox.addEventListener("mousemove",this.mouseMove);
                this.wholeBox.addEventListener("mouseup",this.mouseUp);
                this.wholeBox.addEventListener("mouseleave",this.mouseLeave);//离开整个box拖拽才失效
            }
        }
        componentWillUnmount(){
            this.wholeBox.removeEventListener("mousedown",this.mouseDown);
            this.wholeBox.removeEventListener("mousemove",this.mouseMove);
            this.wholeBox.removeEventListener("mouseup",this.mouseUp);
            this.wholeBox.removeEventListener("mouseleave",this.mouseLeave);
        }
        // getCurrentPosition=()=>{
        //     const rect=this.wholeBox.getBoundingClientRect();
        //     this.lastClientX=rect.left;
        //     this.lastClientY=rect.top;
        // }
        /**
         * @Date: 2020-09-22 16:35:51
         * @Description: 
         * @param {MouseEvent} e
         * @return {void}  
         */
        mouseDown=e=>{
            this.startDrag=true;
            //this.getCurrentPosition();
            this.mouseClientX=e.clientX;
            this.mouseClientY=e.clientY;
            this.prePointer=this.wholeBox.style.cursor;
            this.wholeBox.style.cursor="move";
        }
             /**
         * @Date: 2020-09-22 16:35:51
         * @Description: 
         * @param {MouseEvent} e
         * @return {void}  
         * clientX 相对可视区域的坐标,是W3C标准的一个属性，浏览器都实现了
         */
        mouseMove=e=>{
            if(!this.startDrag){
                return;
            }
            const offsetClientX=e.clientX-this.mouseClientX;
            const offsetClientY=e.clientY-this.mouseClientY;
          
            this.mouseClientX=e.clientX;
            this.mouseClientY=e.clientY;
       
            const x=offsetClientX+this.wholeBox.offsetLeft;
            const y=offsetClientY+this.wholeBox.offsetTop;

            
           
            const rect=this.wholeBox.getBoundingClientRect();
            

             this.wholeBox.style.left=x+"px";
             this.wholeBox.style.top=y+"px";
             this.wholeBox.style.margin="0px";
            
        }
             /**
         * @Date: 2020-09-22 16:35:51
         * @Description: 
         * @param {MouseEvent} e
         * @return {void}  
         */
        mouseUp=e=>{
            this.startDrag=false;
            this.wholeBox.style.cursor=this.prePointer;
        }

        mouseLeave=e=>{
            this.startDrag=false;
            this.wholeBox.style.cursor=this.prePointer;
            //console.log("mouse leave")
        }
        render(){
            return (
                <WrappedComponent  {...this.props} />
                // <div ref={div=>this.wrapperDiv=div} style={{left:this.state.divLeft+"px",top:this.state.divTop+"px"}}>
                   
                // </div>
               
            );
        }
    }
}
export default withDrag;