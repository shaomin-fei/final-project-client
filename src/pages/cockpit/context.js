/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-18 00:20:30
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-18 10:55:49
 */
import React from "react";
/**
 * @typedef {import('../../common/data/center').default} CenterInfo
 * @type {CenterInfo}
 */
const initContex={};
export const TreeContext=React.createContext(initContex);

export class Issue{
    frequency= "91";
    /**
     * @type {Array<string>}
     */
    stations= [];
    /**
     * @type {Array<number>}
     */
    maxLevel= [];
    /**
     * @type {Array<string>}
     */
    reason= [];
    /**
     * @type {Array<string>}
     */
    information= [];
    /**
     * @type {Array<number>}
     */
    occupy= [];
    /**
     * @type {Array<string>}
     */
    occurTime=[];
  }
  export class SignalStaticByReason{
    /**
     * @type{Array<Issue>}
     */
  powerIssue= [];
   /**
     * @type{Array<Issue>}
     */
    timeIssue=[];
     /**
     * @type{Array<Issue>}
     */
    newSignal=[];
  }
  