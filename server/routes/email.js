var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('email', {
        data: {
            title: '直邮工具'
        },
        request: req,
        isLogin: true,
        retcode: 200,
        retdesc: '直邮工具'
    });
});

module.exports = router;
