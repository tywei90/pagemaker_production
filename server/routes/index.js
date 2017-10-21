var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        data: {
            title: '前端工具集首页'
        },
        request: req,
        isLogin: true,
        retcode: 200,
        retdesc: '前端工具集首页'
    });
});

module.exports = router;
