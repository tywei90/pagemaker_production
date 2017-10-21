# 简单前端页面制作工具pagemaker
---
> pagemaker线上版本

前端: 基于React + Webpack + ES6技术
后端: node.js + express技术

进入项目目录
```
cd pagemake
```
安装依赖
```
npm install
```
如果需要启动node热刷新功能，需要全局安装supervisor
```
npm -g install supervisor
```
运行以下命令
```
npm run server //启动服务器，实时监测后台代码并更新(需要手动刷新页面)
npm run dev //动态监测jsx和.scss文件, 并更新内存里(8080端口)的打包文件，自动刷新页面
//根据需要运行
npm run build //编译文件到build目录下，打包到磁盘里，对应3000端口
```
打开浏览器输入http://localhost:3000/genpages


## 参考文献

0. [Immutable 详解及 React 中实践](https://zhuanlan.zhihu.com/p/20295971?columnSlug=purerender)
0. [React.createClass和extends Component的区别](https://segmentfault.com/a/1190000005863630)
0. [React 技术栈系列教程](http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html)
0. [入门Webpack，看这篇就够了](http://www.jianshu.com/p/42e11515c10f#)
0. [ECMAScript 6入门](http://es6.ruanyifeng.com/)
0. [Immutable.js API](https://github.com/facebook/immutable-js#immutable-collections-for-javascript)