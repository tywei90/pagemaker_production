var express = require('express');
var router = express.Router();
var path = require('path');
var Promise = require("bluebird");

var fs = Promise.promisifyAll(require("fs"));
var env = require('../env.js');
var dir = require('../common/dir.js');
var bcrypt = require('bcrypt');


router.param(['id', 'page'], function(req, res, next, value) {
    console.log('CALLED ONLY ONCE with', value);
    next();
})

/* 获取pagemake页面. */
router.get('/', function(req, res, next) {
    res.render('genpages', {
        data: {
            title: 'pagemaker'
        },
        request: req,
        isLogin: true,
        retcode: 200,
        retdesc: 'Express'
    });
});


/* 文件上传接口 */
router.post('/upload', require('../common/upload'));

/* 文件下载接口 */
router.post('/download', function(req, res, next) {
    var basepath = './files/download/';
    var randNum = Math.random().toString(16).slice(2);
    var filename = 'config.json';
    var filepath = basepath + randNum + ".json";
    var data = JSON.stringify(req.body);
    // console.log(req.body);
    //创建目录
    dir.mkdirsSync(basepath);
    fs.writeFile(filepath, data, function(err) {
        if(err) console.log(err);
        res.json({
            filepath: filepath,
            retcode: 200,
            retdesc: '下载成功'
        });
    });
});


/* files文件夹清理接口 */
router.post('/clear', function(req, res, next) {
    let password = req.body.password;
    // 验证平台密码
    fs.readFileAsync('./data/password.json', 'utf-8')
    .then(data => JSON.parse(data))
    .then(tmp => bcrypt.compare(password, tmp.value))
    .then((result) => {
        if(!result){
            res.json({
                retcode: 400,
                retdesc: '平台密码错误'
            });
            // 所有想直接结束promise链的，直接reject掉，去catch里处理
            return Promise.reject();
        }else{
            let configStr = '';
            let configArr = [];
            let files = fs.readdirSync('./data/');
            files.forEach(function(file, index) {
                let filePath = path.join('./data/', file);
                if (fs.statSync(filePath).isDirectory()) {
                    let tmp = fs.readFileSync( path.join(filePath, '/config.json'), 'utf-8');
                    configArr.push(tmp);
                }
            });
            configStr = configArr.join("");
            // 下载目录一定清空
            let delFilesArr = dir.getFilesSync('./files/download/');
            // 上传目录会清理一个月前的文件
            let fileArr = dir.getFilesSync('./files/upload/', 30*24*3600*1000);
            dir.rmdirSync('./files/download/');
            fileArr.forEach(function(file, index){
                if(configStr.indexOf(file) == -1){
                    delFilesArr.push(file);
                    fs.unlinkSync(file);
                }
            })
            if(delFilesArr.length == 0){
                res.json({
                    retcode: 201,
                    retdesc: '没有需要清除的文件'
                });
            }else{
                res.json({
                    retcode: 200,
                    retdesc: '目录清除成功',
                    data: {delFilesArr}
                });
            }
        }
    })
    .catch(function(e) {
        if(e instanceof Error) console.error(e.stack);
    });
});

/* 用户信息接口 */
router.get('/username', function(req, res, next) {
    // 查询数据库代码...
    res.json({
        data:{
            username: '魏天尧'
        },
        retcode: 200,
        retdesc: '请求成功'
    });
});

/* 通过目录名称获取配置文件接口 */
router.post('/getConfig', function(req, res, next) {
    let dirname = req.body.dirname;
    let filepath = './data/';
    let existDirname = [];
    fs.readdir(filepath, function(err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(function(file) {
            let stats = fs.statSync(filepath + file);
            if(stats.isDirectory() && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(file)){
                existDirname.push(file);
            }
        });
        if(existDirname.indexOf(dirname) != -1){
            fs.readFileAsync(filepath + dirname + '/config.json', 'utf-8')
            .then(data => JSON.parse(data))
            .then((result) => {
                res.json({
                    config: result,
                    retcode: 200,
                    retdesc: '导入成功'
                });
            })
        }else{
            res.json({
                retcode: 400,
                retdesc: '发布目录不存在'
            });
        }
    });
});

/* 页面发布接口 */
router.post('/release', function(req, res, next) {
    let dirname = req.body.dirname;
    let password = req.body.password;
    let code = req.body.code;
    let html = decodeURI(req.body.html);
    let config = JSON.stringify(req.body.config);
    // 验证平台密码
    fs.readFileAsync('./data/password.json', 'utf-8')
    .then(data => JSON.parse(data))
    .then(tmp => bcrypt.compare(password, tmp.value))
    .then((result) => {
        if(!result){
            res.json({
                retcode: 400,
                retdesc: '平台密码错误'
            });
            // 所有想直接结束promise链的，直接reject掉，去catch里处理
            return Promise.reject();
        }else{
            return fs.readdirAsync('./data/');
        }
    })
    .then((files) => {
        // 检测是否是新目录
        let existDirname = [];
        files.forEach(file => {
            let stats = fs.statSync('./data/' + file);
            if(stats.isDirectory() && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(file)){
                existDirname.push(file);
            }
        });
        if(existDirname.indexOf(dirname) != -1){
            // 旧目录，则验证密码，更新html文件和json配置文件
            fs.readFileAsync('./data/'+ dirname + '/code.json', 'utf-8')
            .then(data => JSON.parse(data))
            .then(tmp => bcrypt.compare(code, tmp.value))
            .then((result) => {
                if(!result){
                    res.json({
                        retcode: 410,
                        retdesc: '发布密码错误'
                    });
                    return Promise.reject();
                }else{
                    return fs.writeFileAsync('./release/' + dirname + '.html', html);
                }
            })
            .then( () => fs.writeFileAsync('./data/' + dirname + '/config.json', config))
            .then( () => {
                res.json({
                    dirname,
                    retcode: 200,
                    retdesc: '发布成功!'
                });
            })
            .catch(function(e) {
                if(e instanceof Error) console.error(e.stack);
            });
        }else{
            // 新目录，则创建html文件、新建目录并创建json配置文件、发布密码
            fs.writeFileAsync('./release/' + dirname + '.html', html)
            .then(() => fs.mkdirAsync('./data/' + dirname))
            .then(() => fs.writeFileAsync('./data/' + dirname + '/config.json', config))
            .then(() => bcrypt.hash(code, 10))
            .then((hash) => fs.writeFileAsync('./data/' + dirname + '/code.json', JSON.stringify({value: hash})))
            .then( () => {
                res.json({
                    dirname,
                    retcode: 200,
                    retdesc: '发布成功!'
                });
            })
            .catch(function(e) {
                if(e instanceof Error) console.error(e.stack);
            });
        }
    })
    .catch(function(e) {
        if(e instanceof Error) console.error(e.stack);
    });
});

/* 页面删除接口 */
router.post('/delDirectory', function(req, res, next) {
    let dirname = req.body.dirname;
    let password = req.body.password;
    let code = req.body.code;
    // 验证平台密码
    fs.readFileAsync('./data/password.json', 'utf-8')
    .then(data => JSON.parse(data))
    .then(tmp => bcrypt.compare(password, tmp.value))
    .then((result) => {
        if(!result){
            res.json({
                retcode: 400,
                retdesc: '平台密码错误'
            });
            // 所有想直接结束promise链的，直接reject掉，去catch里处理
            return Promise.reject();
        }else{
            return fs.readdirAsync('./data/');
        }
    })
    .then((files) => {
        // 检测是否是新目录
        let existDirname = [];
        files.forEach(file => {
            let stats = fs.statSync('./data/' + file);
            if(stats.isDirectory() && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(file)){
                existDirname.push(file);
            }
        });
        if(existDirname.indexOf(dirname) == -1){
            res.json({
                retcode: 410,
                retdesc: '目录不存在'
            });
            // 所有想直接结束promise链的，直接reject掉，去catch里处理
            return Promise.reject();
        }else{
            return fs.readFileAsync('./data/'+ dirname + '/code.json', 'utf-8');
        }
    })
    .then(data => JSON.parse(data))
    .then(tmp => bcrypt.compare(code, tmp.value))
    .then((result) => {
        if(!result){
            res.json({
                retcode: 420,
                retdesc: '发布密码错误'
            });
            return Promise.reject();
        }else{
            fs.unlinkSync('./release/' + dirname + '.html');
            dir.rmdirSync('./data/' + dirname);
            res.json({
                dirname,
                retcode: 200,
                retdesc: '删除目录成功!'
            });
        }
    })
    .catch(function(e) {
        if(e instanceof Error) console.error(e.stack);
    });
});

/* 检查目录接口 */
router.post('/checkDirname', function(req, res, next) {
    let dirname = req.body.dirname;
    let filepath = './data/';
    let existDirname = [];
    fs.readdir(filepath, function(err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(function(file) {
            let stats = fs.statSync(filepath + file);
            if(stats.isDirectory() && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(file)){
                existDirname.push(file);
            }
        });
        if(existDirname.indexOf(dirname) != -1){
            res.json({
                retcode: 201,
                retdesc: '发布目录已存在'
            });
        }else{
            res.json({
                retcode: 200,
                retdesc: '新的发布目录'
            });
        }
    });
});


module.exports = router;








