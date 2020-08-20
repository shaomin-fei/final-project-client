import React, { Component } from "react";
import { BarsOutlined, CloseOutlined } from "@ant-design/icons";

import "./signal-list.css";
function SignalList(props) {

  const { id, signals } = props;
  return (
    <div id={id}>
      <div className="mainpage_map_signallist_header" >
        <div>Signal List</div>
        <CloseOutlined className="mainpage_signal_list_close" />
      </div>
      <div className="line_separator_hr"></div>
      <div className="mainpage_map_signallist_list">
        {!signals
          ? null
          : signals.map((signal, index) => {
              return (
                <div key={index} className="signal_list_item">
                  <span>{index + 1}</span>
                  <span>{`${signal}MHz`}</span>
                  <BarsOutlined className="mainpage_singal_lisg_detail"
                    style={{ fontSize: "18px", cursor: "pointer" }}
                    ref={(bo) => (bo.frequency = signal)}
                  
                  />
                </div>
              );
            })}

        {/* <div className="signal_list_item">
          <span>1</span>
          <span>101MHz</span>
          <BarsOutlined style={{fontSize:"18px",cursor:"pointer"}}/>
      </div> */}
      </div>
    </div>
  );
}

export default SignalList;
