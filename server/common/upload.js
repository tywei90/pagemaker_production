/**
 * ajax文件上传service
 * action地址: /open/upload
 */
var Busboy = require('busboy');
var fs = require("fs");
var path = require("path");
var dir = require("./dir");
var Imagemin = require("imagemin");
var pngquant = require("./pngquant");
var MD5 = require('md5');

//获取临时文件目录
function getTmpFilePath(filename, mimetype) {
	var today = new Date(),
		time = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2),
		type = (mimetype || "unknown").replace(/^.+\//, "").replace(/jpeg/g, "jpg").replace(/^.*\-/, ""),
		fileFld = path.join("./files/upload/" + time + "/" + type),
		randomFileName = Math.random().toString(36).slice(2) + filename.replace(/^.+\./, ".");
	if (!filename || !mimetype) {
		return;
	}
	//创建目录
	dir.mkdirsSync(fileFld);
	return {
		fileFld: fileFld,
		filePath: path.join(fileFld, randomFileName),
		filename: filename,
		url: ["/files/upload", time, type, randomFileName].join("/")
	};
}

//检测文件类型: img / doc / page / media / unknown
function getFileType(filename) {
	var name = filename.toLowerCase();
	return /\.(?:png|gif|jpg|jpeg|svg)$/.test(name) ? "img" : /\.(?:mp3|mid|mp4|wav)$/.test(name) ? "media" : /\.(?:txt|doc|docx|md)$/.test(name) ? "doc" : /\.(?:js|css|json|html|htm)$/.test(name) ? "page" : "unknown";
}

//不同类型文件最大尺寸限制，单位 M
var maxLenForType = {
	img: 5,
	media: 10,
	doc: 3,
	page: 1
};

//自动压缩图片
function minImage(fileInfo, callback, lossless) {
	var min, filename = fileInfo.filename.toLowerCase();
	if (/\.(?:jpg|jpeg)$/.test(filename)) {
		min = new Imagemin()
			.src(fileInfo.filePath)
			.use(Imagemin.jpegtran({
				progressive: lossless == "1"
			}))
			.dest(fileInfo.fileFld);
	} else if (/\.png$/.test(filename)) {
		//如果不支持pngquant，则改为无损压缩
		if (!pngquant.support) {
			lossless = "1";
		}
		min = new Imagemin()
			.src(fileInfo.filePath)
			.dest(fileInfo.fileFld);
		if (lossless == "1") {
			// 无损png压缩
			min.use(Imagemin.optipng({
				optimizationLevel: 1
			}));
		} else {
			//有损png压缩
			min.use(pngquant());
		}
	}
	if (min) {
		min.run(function(err) {
			callback(err ? 0 : 1, fileInfo);
		});
	} else {
		callback(1, fileInfo);
	}
}

module.exports = function(req, res) {
	//解析get参数，控制上传处理过程
	var ctrl = {
		callback: req.query.callback || "", //如果传递了callback，则启动 jsonp 格式
		//控制上限 ~n    控制下限 n~   控制范围  m~n   精确控制 n
		picSize: req.query.picSize || "", //如果是图片类型，则控制图片的长宽限制，比如  ~100,200~300
		minify: req.query.minify || "1", //图片是否自动压缩
		lossless: req.query.lossless || "", //是否无损压缩png
		waterMark: req.query.waterMark || "" //是否为图片添加水印
	};

	//创建上传组件
	var busboy = new Busboy({
			headers: req.headers
		}),
		ret = {},
		minFiles = [];
	//监听文件上传
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		var tmpFile = getTmpFilePath(filename, mimetype),
			uploadLen = 0,
			type = getFileType(filename),
			maxLen = (maxLenForType[type] || 1),
			overflow = false;
		//检测文件名，只允许多媒体类型上传
		if (type == "unknown" || !filename) {
			if (filename) {
				ret[fieldname] = {
					ok: false,
					err: 1,
					des: "错误的文件类型(" + filename.replace(/^.+\./, ".") + ")."
				};
			} else {
				ret[fieldname] = {
					ok: false,
					err: 2,
					des: "nothing here."
				};
			}
			file.resume();
			return;
		}
		//文件传输中
		file.on('data', function(data) {
			uploadLen += data.length;
			if (uploadLen > maxLen * 1024 * 1024) {
				overflow = true;
				file.resume();
			}
		});
		//文件传输完成
		file.on("end", function() {
			if (overflow) {
				//删除中间临时保存的文件 tmpFile.filePath
				var limit = maxLen < 1 ? maxLen * 1024 + " K" : maxLen + "M";
				//删除文件
				fs.unlinkSync(tmpFile.filePath);
				//填入缓存
				ret[fieldname] = {
					ok: false,
					err: 3,
					des: "file is bigger than " + limit + "."
				};
				return;
			}
			//保存结果
			ret[fieldname] = {
				ok: true,
				url: tmpFile.url,
				size: uploadLen / 1024 //文件长度
			};
			//待压缩图片
			if (type === "img") {
				minFiles.push(tmpFile);
			}
		});

		file.pipe(fs.createWriteStream(tmpFile.filePath));
	});

	//返回json处理结果
	busboy.on('finish', function() {
		// console.log("busboy finish!!")
		// 读取到的json返回到客户端
		if(ret['file'].url.indexOf('json') != -1){
			fs.readFile(path.join('./', ret['file'].url), 'utf8', function (err, data) {
		        if(err) console.log(err);
				try{
                    JSON.parse(data)
                }
                catch(err){
                    ret['file'] = {
                        ok: false,
                        err: 1,
                        des: "json文件格式错误"
                    }
                    return taskComplete(res, ret);
                }
		        var parseData = JSON.parse(data);
		        if(Array.isArray(parseData) && parseData[0].type == 'META'){
                    ret['file'].data = parseData;
                }else{
                    ret['file'] = {
                        ok: false,
                        err: 2,
                        des: "非有效的pagemaker配置文件"
                    }
                }
		        return taskComplete(res, ret);
			});
			return
		}
		//批量压缩图片
		if (ctrl.minify === "1") {
			if (!minFiles.length) {
				return taskComplete(res, ret);
			}
			var i = 0,
				n = minFiles.length,
				m = 0,
				deal = function(ok, info) {
					m++;
					// console.log("minify image over:", m, " total is ",n)
					if (m == n) {
						// console.log("taskComplete:", ret)
						taskComplete(res, ret);
					}
				},
				info;
			for (i = 0; i < n; i++) {
				info = minFiles[i];
				// console.log("minify image:", i);
				try {
					minImage(info, deal, ctrl.lossless);
				} catch (e) {
					// console.log("minImage error >>>>", info)
				}
			}
			taskComplete(res, ret);
		} else {
			// console.log("do not minify image")
			taskComplete(res, ret);
		}
	});

	//接管request对象
	req.pipe(busboy);
};

//任务完成
function taskComplete(res, ret) {
	res.jsonp(ret);
}
