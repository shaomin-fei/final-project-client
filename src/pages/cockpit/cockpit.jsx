/*
 * @Description:
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 08:42:12
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-06 18:49:22
 */
import React from "react";


import "../../thirdparty/bootstrap/css/bootstrap.min.css";
import Header from "./header/header";
import Left from "./left/left";
import './cockpit.css'



const CockPit = function (props) {
  return (
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
          <section className="col-lg-6"></section>
          {/*  content_right */}
          <section className="col-lg-3"></section>
        </section>
      </section>
    </div>
  );
};
export default CockPit;
