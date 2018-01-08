/**
 * ajax文件上传service
 * action地址: /files/upload
 */
var Busboy = require('busboy');
var fs = require("fs");
var path = require("path");
var dir = require("./dir");
var Imagemin = require("imagemin");
var ImageminJpegtran = require('imagemin-jpegtran');
var ImageminPngquant = require('imagemin-pngquant');

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
	return /\.(?:png|gif|jpg|jpeg|svg)$/.test(name) ? "img" : /\.(?:mp3|mid|wav|wma)$/.test(name) ? "audio" : /\.(?:mp4|ogg|3gp)$/.test(name) ? "video" : /\.(?:txt|doc|docx|md)$/.test(name) ? "doc" : /\.(?:js|css|json|html|htm)$/.test(name) ? "page" : "unknown";
}

//不同类型文件最大尺寸限制，单位 M
var maxLenForType = {
	img: 5,
	audio: 10,
	video: 20,
	doc: 3,
	page: 1
};

//自动压缩图片
function minImage(fileInfo, callback) {
	Imagemin([fileInfo.filePath], fileInfo.fileFld, {
		plugins: [
			ImageminJpegtran(),
			ImageminPngquant({quality: '65-80'})
		]
	}).then(files => {
		callback(1, fileInfo);
	}).catch(function(err){
		callback(0, fileInfo);
	});
}

module.exports = function(req, res) {
	//解析get参数，控制上传处理过程
	var ctrl = {
		callback: req.query.callback || "", //如果传递了callback，则启动 jsonp 格式
		type: req.query.type // 上传文件类型
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
		if(type === 'img'){
			ctrl.minify = req.query.minify || "1"; //图片是否压缩，默认压缩
		}
		//检测文件名，只允许多媒体类型上传
		if(!filename){
			ret[fieldname] = {
				ok: false,
				err: 1,
				des: "nothing here."
			};
			return taskComplete(res, ret);
		}
		if(type == "unknown"){
			ret[fieldname] = {
				ok: false,
				err: 2,
				des: "不支持的文件类型(" + filename.replace(/^.+\./, ".") + ")."
			};
			return taskComplete(res, ret);
		}
		if(type != ctrl.type){
			ret[fieldname] = {
				ok: false,
				err: 3,
				des: "错误的文件类型(" + filename.replace(/^.+\./, ".") + ")."
			};
			return taskComplete(res, ret);
		}
		//文件传输中
		file.on('data', function(data) {
			uploadLen += data.length;
			if (uploadLen > maxLen * 1024 * 1024) {
				overflow = true;
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
					err: 4,
					des: "文件大小超过上限" + maxLen + "M"
				};
			}else{
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
			}
		});
		file.pipe(fs.createWriteStream(tmpFile.filePath));
	});

	//返回json处理结果
	busboy.on('finish', function() {
		// console.log("busboy finish!!")
		// 读取到的json返回到客户端
		if(ret['file'].url && ret['file'].url.indexOf('json') != -1){
			fs.readFile(path.join('./', ret['file'].url), 'utf8', function (err, data) {
		        if(err) console.log(err);
				try{
                    JSON.parse(data)
                }
                catch(err){
                    ret['file'] = {
                        ok: false,
                        err: 5,
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
                        err: 6,
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
					if (m == n) {
						taskComplete(res, ret);
					}
				},
				info;
			for (i = 0; i < n; i++) {
				info = minFiles[i];
				try {
					minImage(info, deal);
				} catch (e) {
					console.log("minImage error >>>>", e);
				}
			}
			return
		}
		return taskComplete(res, ret);
	});

	//接管request对象
	req.pipe(busboy);
};

//任务完成
function taskComplete(res, ret) {
	res.jsonp(ret);
}
