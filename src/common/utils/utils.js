/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-26 22:22:20
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-26 22:44:10
 */
export default class Utils{
    static arrayBuf2Utf8(array){
        const str=new TextDecoder().decode(array);
        return str;
    }
    static str2ArrayBuf(str){
        const array=new TextEncoder("utf-8").encode(str);
        return array;
    }
}