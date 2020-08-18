/*
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-08-13 01:26:50
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-17 15:39:34
 */
const { override, addWebpackAlias, addWebpackModuleRule, addWebpackExternals} = require('customize-cra')
const path = require('path')
const resolve = path.join(__dirname, './src')
module.exports = override(
	  // 用来配置 @ 导入
    addWebpackAlias({
        '@': resolve
    }),
    addWebpackModuleRule({
        test:/\.worker\.js$/,
        use:{
            loader:'worker-loader',
        }
    }),  
    // addWebpackExternals({
    //     'antd':true,
    //     'react':'window.React',
        
        

    // }),
)