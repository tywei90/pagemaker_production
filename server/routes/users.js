var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('users', {
        data: {
            title: 'users'
        },
        request: req,
        isLogin: true,
        retcode: 200,
        retdesc: 'users'
    });
});

module.exports = router;
