<!--
 * @Description: 
 * @version: 1.0
 * @Author: shaomin fei
 * @Date: 2020-07-29 09:02:11
 * @LastEditors: shaomin fei
 * @LastEditTime: 2020-08-22 20:37:40
-->
1. when you use git to commit, maybe you will input commit message in vim. you need to press ESC to quit the edit model ,then press :w to save ,then press :q to quit
2 how to use git it vscode:
https://zhuanlan.zhihu.com/p/23344403
3 git reset --soft HEAD^ 
quit your last commit,注意，仅仅是撤回commit操作，您写的代码仍然保留。HEAD^的意思是上一个版本，也可以写成HEAD~1

如果你进行了2次commit，想都撤回，可以使用HEAD~2
4 GitLens 插件，管理git提交
5 highcharts with large set,heatmap
https://www.highcharts.com/forum/viewtopic.php?t=36417
6 一个同行写的瀑布图
https://jsfiddle.net/codexu/ugva08cq/
7 插件：Bookmarks 快速跳转到制定行

使用：

    开关：ctrl+alt+k

     跳至上一个：ctrl+alt+j

     跳至下一个：ctrl+alt+l

8 安装openlayer
npm install ol
9 float
元素设置float 后，该元素将不占据页面空间，但仍然在包含矿之内，浮动框可以向左或右移动，直到它的边缘碰到另一个浮动框或包含框的边缘；浮动元素的边缘不会超过父元素内边缘，浮动元素不会相互重叠，不会上下浮动，如果一行空间不够，则会自动换行，display属性失效，均可设置宽高（行内元素本身不能设置宽高，设置float后可以），并不会独占一行
10 在worker 中放音频
https://developers.google.com/web/updates/2017/12/audio-worklet
11  box-shadow文章
https://blog.csdn.net/qq_26769677/article/details/70766373
12 echarts
https://gallery.echartsjs.com/editor.html?c=xkwL0ooeD-
13 vscode js 提示
https://blog.csdn.net/zgz682000/article/details/81223266

 jsdoc泛形
 https://zhuanlan.zhihu.com/p/110326971

https://outlook.office365.com/owa/calendar/SaskatchewanInterculturalAssociation1@saskintercultural.org/bookings/

14 404 页面设计
https://www.cnblogs.com/lhb25/archive/2012/11/26/404-error-pages-psd-template.html

15 解决 Error processing launch: Error: Could not attach to main target
In the section Extensions -> JavaScript Debugger set option Debug > JavaScript: Use Preview to false.

17 配置webworker 
https://www.jianshu.com/p/10f2e0ac09c0  用customize-cra配置，并
npm install worker-loader --save-dev 安装 插件
18 不用work-loader:
https://segmentfault.com/a/1190000020299095?utm_source=tag-newest
19 file-loader版本有问题会导致图片加载不对 package-lock.json中可以查看执行脚本react-scripts的版本依赖
20 setstate 调用顺序问题，
https://www.tangshuang.net/3784.html

21 clone link from git
git clone https://github.com/tupes/comit-react-color-organizer.git
22 a标签执行onclick的写法：
{/* href 中执行js代码，;表示执行空代码，这样onclick才会响应 */}
                 <a style={linkStyleStart} href="javascript:;" onClick={(e,item)=>this.handleLinkClick(e,item,"start")}> Start</a>

16  Reactjs code snippets
Reactjs
VS Code Reactjs snippets
Version Installs Ratings

This extension contains code snippets for Reactjs and is based on the awesome babel-sublime-snippets package.

Installation
In order to install an extension you need to launch the Command Palette (Ctrl + Shift + P or Cmd + Shift + P) and type Extensions. There you have either the option to show the already installed snippets or install new ones.

Supported languages (file extensions)
JavaScript (.js)
TypeScript (.ts)
JavaScript React (.jsx)
TypeScript React (.tsx)
Breaking change in version 2.0.0
Removed support for jsx language as it was giving errors in developer tools #39

Breaking change in version 1.0.0
Up until verion 1.0.0 all the JavaScript snippets where part of the extension. In order to avoid duplication the snippets are now included only to this extension and if you want to use them you have to install it explicitly.

Usage
When installing the extension React development could be really fun create react component

As VS Code from version 0.10.10 supports React components syntax inside js files the snippets are available for JavaScript language as well. In the following example you can see the usage of a React stateless component with prop types snippets inside a js and not jsx file. create react stateless component

Snippets
Below is a list of all available snippets and the triggers of each one. The ⇥ means the TAB key.

Trigger	Content
rcc→	class component skeleton
rrc→	class component skeleton with react-redux connect
rrdc→	class component skeleton with react-redux connect and dispatch
rccp→	class component skeleton with prop types after the class
rcjc→	class component skeleton without import and default export lines
rcfc→	class component skeleton that contains all the lifecycle methods
rwwd→	class component without import statements
rpc→	class pure component skeleton with prop types after the class
rsc→	stateless component skeleton
rscp→	stateless component with prop types skeleton
rscm→	memoize stateless component skeleton
rscpm→	memoize stateless component with prop types skeleton
rsf→	stateless named function skeleton
rsfp→	stateless named function with prop types skeleton
rsi→	stateless component with prop types and implicit return
fcc→	class component with flow types skeleton
fsf→	stateless named function skeleton with flow types skeleton
fsc→	stateless component with flow types skeleton
rpt→	empty propTypes declaration
rdp→	empty defaultProps declaration
con→	class default constructor with props
conc→	class default constructor with props and context
est→	empty state object
cwm→	componentWillMount method
cdm→	componentDidMount method
cwr→	componentWillReceiveProps method
scu→	shouldComponentUpdate method
cwup→	componentWillUpdate method
cdup→	componentDidUpdate method
cwun→	componentWillUnmount method
gsbu→	getSnapshotBeforeUpdate method
gdsfp→	static getDerivedStateFromProps method
cdc→	componentDidCatch method
ren→	render method
sst→	this.setState with object as parameter
ssf→	this.setState with function as parameter
props→	this.props
state→	this.state
bnd→	binds the this of method inside the constructor
disp→	MapDispatchToProps redux function
The following table lists all the snippets that can be used for prop types. Every snippet regarding prop types begins with pt so it's easy to group it all together and explore all the available options. On top of that each prop type snippets has one equivalent when we need to declare that this property is also required.

For example pta creates the PropTypes.array and ptar creates the PropTypes.array.isRequired

Trigger	Content
pta→	PropTypes.array,
ptar→	PropTypes.array.isRequired,
ptb→	PropTypes.bool,
ptbr→	PropTypes.bool.isRequired,
ptf→	PropTypes.func,
ptfr→	PropTypes.func.isRequired,
ptn→	PropTypes.number,
ptnr→	PropTypes.number.isRequired,
pto→	PropTypes.object,
ptor→	PropTypes.object.isRequired,
pts→	PropTypes.string,
ptsr→	PropTypes.string.isRequired,
ptsm→	PropTypes.symbol,
ptsmr→	PropTypes.symbol.isRequired,
ptan→	PropTypes.any,
ptanr→	PropTypes.any.isRequired,
ptnd→	PropTypes.node,
ptndr→	PropTypes.node.isRequired,
ptel→	PropTypes.element,
ptelr→	PropTypes.element.isRequired,
pti→	PropTypes.instanceOf(ClassName),
ptir→	PropTypes.instanceOf(ClassName).isRequired,
pte→	PropTypes.oneOf(['News', 'Photos']),
pter→	PropTypes.oneOf(['News', 'Photos']).isRequired,
ptet→	PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
ptetr→	PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
ptao→	PropTypes.arrayOf(PropTypes.number),
ptaor→	PropTypes.arrayOf(PropTypes.number).isRequired,
ptoo→	PropTypes.objectOf(PropTypes.number),
ptoor→	PropTypes.objectOf(PropTypes.number).isRequired,
ptoos→	PropTypes.objectOf(PropTypes.shape()),
ptoosr→	PropTypes.objectOf(PropTypes.shape()).isRequired,
ptsh→	PropTypes.shape({color: PropTypes.string, fontSize: PropTypes.number}),
ptshr→	PropTypes.shape({color: PropTypes.string, fontSize: PropTypes.number}).isRequired,
Categories
Snippets
Tags
snippet
Resources
Repository
Download Extension
Project Details
xabikos/vscode-react
No Pull Requests
2 Open Issues
Last Commit: 6 months ago
More Info
Version	2.4.0	
Released on	2015/11/17 下午2:54:33	
Last updated	
2019/10/29 下午3:40:30
Publisher	charalampos karypidis	
Unique Identifier	xabikos.ReactSnippets	
Report	Report Abuse	  


17 react 使用@操作符代表src根目录
安装npm i react-app-rewired customize-cra -D
首先先在package.json中配置 把react-scripts替换成为react-app-rewired
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
}

替换成为
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}

在项目根目录和package.json同级下面新建一个 config-overrides.js的文件
const { override, addWebpackAlias} = require('customize-cra')
const path = require('path')
const resolve = path.join(__dirname, './src')
module.exports = override(
	  // 用来配置 @ 导入
    addWebpackAlias({
        '@': resolve
    })  
)

14 Home, RealTime Task, (Signal Manage),  Data Manage, Station Manage 
