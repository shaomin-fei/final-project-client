// @ts-check
import React,{useState,useEffect,useRef} from 'react';
import {Link} from "react-router-dom"
import Rocket from "../../imgs/pagenotfound/rocket.png"
import "./not-found.css"

const NotFoundPage=function(props){
   
let [rocketLeft,setRocketLeft]=useState(0);
let[spanClassName,setSpanClassName]=useState("steam1");
  //let rocket=document.getElementById("rocket");
  let fromLeftToRight=true;
  //
  let didMount=useRef(false);
  
   useEffect(()=>{
    let rocket=null;
    let originalOffsetLeft=0;
    didMount.current=true;
    const interval=setInterval(() => {
        if(!rocket){
         rocket=document.getElementById("rocket");
         originalOffsetLeft=rocket?rocket.offsetLeft:0;
         rocketLeft=rocket.offsetLeft;
         return;
        }
        
        if(rocket.offsetLeft-originalOffsetLeft>=100){
            fromLeftToRight=false;
        }
        else if(rocket.offsetLeft-originalOffsetLeft<=0){
         fromLeftToRight=true;
        }
        fromLeftToRight?rocketLeft=rocket.offsetLeft+1:rocketLeft=rocket.offsetLeft-1;
        setRocketLeft(rocketLeft);
        if(spanClassName==="steam1"){
            spanClassName="steam2";
        }else{
         spanClassName="steam1";
        }
        setSpanClassName(spanClassName);
    }, 50);

    return ()=>{
        clearInterval(interval);
        //console.log("clear interval",interval);
    }
   },[]);
    return (

        <div className="not_found_page" >
            <section>
            <div id="rocket"  style={didMount.current?{left:rocketLeft}:null}>
                <span className={spanClassName}></span>
            </div>
            </section>
            <hgroup>
                <h1>Page Not Found</h1>
                <h3>We couldn't have what you were looking for......</h3>
            </hgroup>
            {/* target={"_blank"} open in a new tab, in this case, it's a new process */}
            <Link to="/cockpit" >
                <div className="link">Click To Home Page &gt;&gt;</div>
            </Link>
        </div>  
    );
}
export default NotFoundPage;
//export default withRouter(NotFoundPage);