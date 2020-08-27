import React from "react"

import "./itu.css"
const ITUGraph =function(props){
    return (
        <div className="tab_container" >
            <table className="tab_itu">
            <thead >
                <tr>
                    <th colSpan={2}>ITU</th>
                </tr>
            </thead>
            <tbody >
                <tr className="table_row">
                    <td className="table_td">modulation</td>
                    <td className="table_td">10</td>
                </tr>
                <tr>
                    <td className="table_td">bandwidth</td>
                    <td className="table_td">20</td>
                </tr>
            </tbody>
            
            </table>
        </div>
    );
}
export default ITUGraph;