/*
 * @Description: header of the cockpit
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-06 09:48:11
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 14:39:47
 */
import React from "react"

import HeaderRight from "../../../components/header-right/header-right"
import '../cockpit.css'

const Header=function(props){
    return (
    <section className="header">
        <img alt='' className="header_left" src={require('../../../imgs/newLeftLogo.png')}></img>
        <section className="header_center">FM Monitor System</section>
       
        <img alt='' className="header_right" src={require('../../../imgs/newRightLogo.png')}>
        </img>
        
        <HeaderRight />
       
        
    </section>)

}
export default Header;