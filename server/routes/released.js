var express = require('express');
var router = express.Router();
var fs = require('fs');
var arrSort = require('arr-sort');

/* GET home page. */
router.get('/', function(req, res, next) {
	let filepath = './data/';
    let tmpArr = [];
    let existDirname = [];
    fs.readdir(filepath, function(err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(function(file) {
            let stats = fs.statSync(filepath + file);
            if(stats.isDirectory() && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(file)){
                tmpArr.push({
                	name: file,
                	date: +stats.birthtime || +new Date()
                });
            }
        });
        // 按照发布日期倒序排
        tmpArr = arrSort(tmpArr,
            [{
                attr: 'date',
                asc: false
            }]
        );
        for(var i=0, len=tmpArr.length; i<len; i++){
        	existDirname.push(tmpArr[i].name);
        }
        if(existDirname.length > 0){
        	res.render('released', {
		        data: {
		            title: '已经发布的页面',
		            existDirname
		        },
		        request: req,
		        isLogin: true,
		        retcode: 200,
		        retdesc: '已经发布的页面'
		    });
        }else{
        	res.render('released', {
		        data: {
		            title: '暂时没有发布的页面',
		            existDirname
		        },
		        request: req,
		        isLogin: true,
		        retcode: 400,
		        retdesc: '暂时没有发布的页面'
		    });
        }
    });
});

module.exports = router;
