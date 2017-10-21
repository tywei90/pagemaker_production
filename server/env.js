var fs = require('fs');
var path = require('path');
var log4js = require('log4js');
var opn = require('opn');

var logger = log4js.getLogger();
logger.debug("服务环境初始化");

// opn('http://localhost:3000/genpages').then(() => {
//     console.log('pagemaker页面已打开');
// });

var env = {
    basedir: __dirname,
    tmpdir: path.resolve(__dirname, '..', 'tmp'),
    products: ['all', 'lmlc', 'lmlcfe', 'lmlcrd', 'lmlcued', 'lmlcpd', 'lmlcpd', 'lmlcop'],
    refuse: function(name) {
        return this.products.indexOf(name) === -1;
    }
};

// 新建项目根目录
if (!fs.existsSync(env.tmpdir)) {
    fs.mkdirSync(env.tmpdir);
}
// 新建项目目录
env.products.forEach(function(product) {
    var dirname = path.resolve(env.tmpdir, product);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
})

module.exports = env;
