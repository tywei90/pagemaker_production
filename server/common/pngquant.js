//改装自 https://github.com/imagemin/imagemin-pngquant/blob/master/index.js
//去掉自动化安装的步骤，直接使用 pngquant 命令，命令不存在则不处理
var spawn = require('child_process').spawn;
var isPng = function(buf) {
	if (!buf || buf.length < 4) {
		return false;
	}
	return buf[0] === 137 &&
		buf[1] === 80 &&
		buf[2] === 78 &&
		buf[3] === 71;
};
var through = require('through2');
var support = !!require('shelljs').which("pngquant");

module.exports = function(opts) {
	opts = opts || {};

	return through.ctor({
		objectMode: true
	}, function(file, enc, cb) {
		if (!support) {
			cb(null, file);
			return;
		}

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new Error('Streaming is not supported'));
			return;
		}

		if (!isPng(file.contents)) {
			cb(null, file);
			return;
		}

		var args = ['-'];
		var ret = [];
		var len = 0;

		if (opts.floyd && typeof opts.floyd === 'number') {
			args.push('--floyd=' + opts.floyd);
		}

		if (opts.floyd && typeof opts.floyd === 'boolean') {
			args.push('--floyd');
		}

		if (opts.nofs) {
			args.push('--nofs');
		}

		if (opts.posterize) {
			args.push('--posterize', opts.posterize);
		}

		if (opts.quality) {
			args.push('--quality', opts.quality);
		}

		if (opts.speed) {
			args.push('--speed', opts.speed);
		}

		if (opts.verbose) {
			args.push('--verbose');
		}

		var cp = spawn('pngquant', args);

		cp.stderr.setEncoding('utf8');
		cp.stderr.on('data', function(data) {
			var err = new Error(data);
			err.fileName = file.path;
			cb(err);
			return;
		});

		cp.stdout.on('data', function(data) {
			ret.push(data);
			len += data.length;
		});

		cp.on('error', function(err) {
			err.fileName = file.path;
			cb(err);
			return;
		});

		cp.on('close', function() {
			if (len < file.contents.length) {
				file.contents = Buffer.concat(ret, len);
			}
			cb(null, file);
		});

		cp.stdin.end(file.contents);
	});
};

module.exports.support = support;
