/*
 * @Author: shaomin fei
 * @Date: 2020-07-28 12:12:36
 * @LastEditTime: 2020-09-15 15:56:14
 * @LastEditors: shaomin fei
 * @Description: 
 * @FilePath: \rms-ui\.eslintrc.js
 */ 
module.exports = {
  env: {
    browser: true,
    es6: true,
    amd:true,
    commonjs:true,
  },
  extends: [
    'plugin:react/recommended',
    //'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  
    
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "globals":{
    "document": true,
    "localStorage": true,
    "window": true,
    "Highcharts":true,
    "BigInt":true,
  }
};
