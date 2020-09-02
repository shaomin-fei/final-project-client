import React,{useEffect} from "react";

import OverviewMap from "./overview-map"; 
import StationManageLayout from "../station-manage-layout/station-manage-layout";


const OverView=function(props){

    useEffect(()=>{

    },[]);
    return (
        <>
        <StationManageLayout>
            <OverviewMap/>
        </StationManageLayout>
        </>
    );
}
export default OverView;