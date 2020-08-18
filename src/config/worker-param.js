/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-17 19:42:36
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 19:43:24
 */
export default class WorkerParam{
    cmd="";
    arg=null;
    constructor(cmd,arg){
        this.cmd=cmd;
        this.arg=arg;
    }
}