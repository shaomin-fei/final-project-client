/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-26 22:22:20
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-04 12:54:01
 */
export default class Utils{
    static arrayBuf2Utf8(array){
        const str=new TextDecoder().decode(array);
        return str;
    }
    static arrayBuf2Gb(array){
        const str=new TextDecoder("gbk").decode(array);
        return str;
    }
    static str2ArrayBuf(str){
        const array=new TextEncoder("utf-8").encode(str);
        return array;
    }
    static dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "M+": (date.getMonth() + 1).toString(),     // 月
            "D+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "m+": date.getMinutes().toString(),         // 分
            "s+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
}