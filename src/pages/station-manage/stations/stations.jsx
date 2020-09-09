import React from "react";

import StationManageLayout from "../station-manage-layout/station-manage-layout";
import MapStations from "./stations-map";

const Stations=function(props){

    return (
        <>
        <StationManageLayout>
            <MapStations/>
        </StationManageLayout>
        </>
    );
}
export default Stations;