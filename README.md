# 简单前端页面制作工具pagemaker

技术分析，详见我的[博客](https://www.wty90.com/2018/01/11/pagemaker/)

进入项目目录
```bash
cd pagemaker_production
```
安装依赖
```bash
npm install
```
如果需要启动node热刷新功能，需要全局安装nodemon
```bash
npm install -g nodemon
```
运行以下命令
```bash
npm run server //启动服务器，实时监测后台代码并更新(需要手动刷新页面)
npm run dev //动态监测jsx和.scss文件, 并更新内存里(8080端口)的打包文件，自动刷新页面
npm run build //编译文件到build目录下，打包到磁盘里，对应4000端口
```
打开浏览器输入http://localhost:4000

**注意**
1、线上项目的server端采用pm2管理，在开发环境推荐[nodemon](https://github.com/remy/nodemon/)，需要全局安装。不推荐supervisor，代码错误会一直报错，而且不能选择监控目录。本地调试后台，需要修改package.json里的scripts.server属性为`nodemon --watch server server/pagemaker`。

2、我们的html模板采用[pug](https://pugjs.org/api/getting-started.html)，首页的模板在views文件夹下的genpages.pug文件。`https://pagemaker.wty90.com/public/main.js`为线上的js地址，如果是本地调试pc页面，改成`http://127.0.0.1:8080/public/main.js`，css文件一样。如果是调试手机页面或者其他电脑上，改成`http://your_ip_address:4000/public/main.js`。当然，需要先打包修改的代码。

3、genpages.pug里有一些配置可以选，`debugJS`参数是开启在移动端调试js的工具。`debugCSS_IP`参数是开启在移动端调试css的工具，需要传入电脑的ip地址，不传不开启。`showProgressBar`参数是否显示loading进度条。