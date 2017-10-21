var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('h5', {
        data: {
            title: '动效页'
        },
        request: req,
        isLogin: true,
        retcode: 200,
        retdesc: '动效页'
    });
});

module.exports = router;
