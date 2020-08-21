/*
 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 08:42:12
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-20 12:19:05
 */
import React from "react";
import {connect} from "react-redux"


import "../../thirdparty/bootstrap/css/bootstrap.min.css";
import Header from "./header/header";
import Left from "./left/left";
import CenterMap from "./center/map/map";
import Right from './right/right';
import {TreeContext} from "./context"


import './cockpit.css'




const CockPit = function (props) {
  /**
   * @typedef {import('../../common/data/center').default} CenterInfo
   * @type {CenterInfo} tree
   */
  const tree=props.tree;  
  console.log("cockpit render");
  return (
    <TreeContext.Provider value={tree}>
    <div className="cockPit">
      <header className="container-fluid">
        <Header />
      </header>
      <section className="container-fluid content_container">
        <section className="row row_container">
          {/*  content_left */}
          <section className="col-lg-3 page_left">
              <Left/>
          </section>
          {/*  content_center */}
          <section className="col-lg-6 page_center">
          <CenterMap/>
          </section>
          
          {/*  content_right */}
          <section className="col-lg-3 page_right">
            <Right/>
          </section>
        </section>
      </section>
    </div>
    </TreeContext.Provider>
    
  );
};
const mapStateToProps={

};
export default connect(
  // props will pass state.tree
  state=>({tree:state.tree}),
)(CockPit);
