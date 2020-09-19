<!--
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-07-29 08:56:20
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-09-19 14:27:38
-->
1 url:
front-end url:
https://github.com/shaomin-fei/final-project-client
server-side url:
https://github.com/shaomin-fei/final-project-server

2 Introduction
**2.1 There are three main requirements of the project:manage unattended devices which are used to collect radio signal,control devices,visualize data got from devices.
**2.2 The project now is testing on Macbook pro,and is able to work well in browser chrome(v 85.0.4183.102) and safari(v13.1.1 (15609.2.9.1.2)), haven't known what it will look like under windows or other resolution. So in order to show the current effect, in the front-end's pic folder, I update four pictures,which I cut from my Mac computer.
3 How to start?
**3.1 start server-side:
      npm start
**3.2 start front-end:
      npm start
4 How to use?
**4.1 cockpit page
when the server-side and front-end have been started,the browser will show the first page, I call it cockpit. The cockpit has five parts,left side contains two parts: Device Status and Running Task, click title "Device Status" and "Running Task" could trigger to station manage page and real time task page.
Right side contains two parts:Storage and Signal Warnning, click title could also trigger to related pages.(those two pages have not been completed). Module at the right-bottom is Signal Warning,click colume could trigger the map in the center to show different infromation.If you click icon on the map, there will be a box contains a list,click button of each row, the information box below will be changed.
**4.2 station manage page
click "Device Status" on the cockpit page will enter the station manage page. Click icon on the map will open a dialog, which will show some enviroment information get from remote device through network.The button "on/off" will turn on/off the remote device. Other functions have not been completed.
**4.3 realtime task
click "Running Task" title will enter the realtime task page. The left of the page show the tree-structure of our monitor network. The leaf of the tree is a device.Click device, there will be a task-list show below,click start button will enter the task page. When you enter the task page, click "start" button to start the task. Then the page will draw graphics dynamically. click checkbox "level","IQ","ITU" to choose what kind of graphic you want to show. click checkbox "Audio" to decide if you want to hear the audio. 

      



