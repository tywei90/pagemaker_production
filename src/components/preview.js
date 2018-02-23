import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

import './preview.scss';
import PreTitle from './previewUnits/preTitle';
import PreImg from './previewUnits/preImg';
import PreTextBody from './previewUnits/preTextBody';
import PreButton from './previewUnits/preButton';
import PreAudio from './previewUnits/preAudio';
import PreVideo from './previewUnits/preVideo';
import PreCode from './previewUnits/preCode';
import PreStatistic from './previewUnits/PreStatistic';

import $ from 'jquery'

import { Modal, Button } from 'antd';
const confirm = Modal.confirm;

let Frame = require('react-frame-component');

const renderUnits = units => {
	return units.map((item, index) => {
		switch (item.get('type')) {
			case 'TITLE' :
				return (
						<PreTitle key={index} id={index} data={item} />
				)
			break;
			case 'IMAGE' :
				return (
					<PreImg key={index} id={index} data={item} />
				)
			break;
			case 'TEXTBODY' :
				return (
					<PreTextBody key={index} id={index} data={item} />
				)
			break;
			case 'BUTTON' :
				return (
					<PreButton key={index} id={index} data={item} />
				)
			break;
			case 'AUDIO' :
				return (
					<PreAudio key={index} id={index} data={item} />
				)
			break;
			case 'VIDEO' :
				return (
					<PreVideo key={index} id={index} data={item} />
				)
			break;
			case 'CODE' :
				return (
					<PreCode key={index} id={index} data={item} />
				)
			break;
			case 'STATISTIC' :
				return (
					<PreStatistic key={index} id={index} data={item} />
				)
			break;
		}
	});
};

@pureRender
class Preview extends React.Component {
	static propTypes = {
        unit: ImmutablePropTypes.list,
    };
	constructor(props){
		super(props);
		this.state = {
	    	errTip1: '',
	    	errTip2: '',
	    	stateTip: '',
	    	stateOK: false,
	    	placeholder: '请输入发布密码',
	    	visible: false,
	    	confirmLoading: false,
	    	confirmLoading2: false,
	    	confirmLoading3: false,
	    	isDirnameExist: false,
	    	visible2: false,
	    	errTip3: '',
	    	cleanType: 'shallow'
	  	}
	}
	showReleaseModal(){
		this.setState({visible: true});
		setTimeout(()=>{
			this.submitBtn = document.getElementById('releaseBtn');
			this.submitBtn.setAttribute('disabled', 'disabled');
		}, 0)
	}
	handleInput(){
		let dirname = this.refs.dirname.value.trim();
		let password = this.refs.password.value.trim();
		let code = this.refs.code.value.trim();
		if(/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dirname) && password != '' && code != ''){
			this.setState({stateOK: true});
			this.submitBtn.removeAttribute('disabled');
		}else{
			this.setState({stateOK: false});
			this.submitBtn.setAttribute('disabled', 'disabled');
		}
	}
	handleBlur(){
		let dirname = this.refs.dirname.value.trim();
		if(dirname == ''){
			this.setState({
				errTip1: '',
		    	stateTip: '',
		    	placeholder: '请输入发布密码'
		  	});
			return
		}
		if(!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dirname)){
			this.setState({
		    	errTip1: '目录名称是以字母或下划线开头，后面跟字母、数字或下划线的字符',
		    	stateTip: '',
		    	placeholder: '请输入发布密码'
		    });
		    return
		}
		fetch('/checkDirname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dirname})
        })
        .then(response => response.json())
        .then(data => {
            if(data.retcode == 200){
            	this.setState({
            		errTip1: '',
            		stateTip: '这是一个新的发布目录，请创建您的发布密码并牢记，以便下次更新发布内容',
            		placeholder: '请创建发布密码',
            		isDirnameExist: false
            	});
            }else{
            	this.setState({
            		errTip1: '',
			    	stateTip: '发布目录已存在，确认覆盖请输入发布密码',
			    	placeholder: '请输入发布密码',
			    	isDirnameExist: true
			  	});
            }
        })
        .catch(e => console.log("Oops, error", e))
	}
	handleOk(){
		if(!this.state.stateOK){
			return
		}
		const { unit } = this.props;
		let config = unit.toJS();
		let dirname = this.refs.dirname.value.trim();
		let password = this.refs.password.value.trim();
		let code = this.refs.code.value.trim();
		let html = this.prepareData();
		this.setState({
	    	confirmLoading: true,
	    });
		fetch('/release', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dirname, password, code, html, config})
        })
        .then(response => response.json())
        .then(data => {
        	this.setState({
		    	confirmLoading: false,
		    });
            if(data.retcode == 200){
            	this.handleCancel();
            	Modal.success({
			    	title: '页面发布成功!',
			    	content: <div>查看发布的页面<a href={`/release/${data.dirname}.html`}>点击这里</a></div>,
			  	});
            }else{
            	this.setState({
			    	errTip2: data.retdesc
			  	});
            }
        })
        .catch(e => console.log("Oops, error", e))
	}
	handleCancel(){
	    this.setState({
	    	visible: false
	    });
	    setTimeout(() => {
	    	this.refs.dirname.value = '';
			this.refs.password.value = '';
			this.refs.code.value = '';
			this.setState({
		        errTip1: '',
		    	errTip2: '',
		    	stateTip: '',
		    	stateOK: false,
		    	placeholder: '请输入发布密码',
		    	confirmLoading: false,
		    	confirmLoading2: false
		    });
	    }, 500);
	}
	confirmDel(){
		var me = this;
		confirm({
		    title: '确认删除已发布页面?',
		    content: '删除之后将不可恢复，请谨慎操作！',
		    onOk() {
		        me.handleDel();
		    },
		    onCancel() {},
		});
	}
	handleDel(){
		if(!this.state.stateOK || !this.state.isDirnameExist){
			return
		}
		const { unit } = this.props;
		let dirname = this.refs.dirname.value.trim();
		let password = this.refs.password.value.trim();
		let code = this.refs.code.value.trim();
		this.setState({
	    	confirmLoading2: true,
	    });
		fetch('/delDirectory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dirname, password, code})
        })
        .then(response => response.json())
        .then(data => {
        	this.setState({
		    	confirmLoading2: false,
		    });
            if(data.retcode == 200){
            	this.handleCancel();
            	Modal.success({
			    	title: '页面删除成功!',
			    	content: <div>查看已发布的页面<a href="/released">点击这里</a></div>,
			  	});
            }else{
            	this.setState({
			    	errTip2: data.retdesc
			  	});
            }
        })
        .catch(e => console.log("Oops, error", e))
	}
	showClearModal(){
		this.setState({visible2: true});
		setTimeout(()=>{
			this.clearBtn = document.getElementById('clearBtn');
			this.clearBtn.setAttribute('disabled', 'disabled');
		}, 0)
	}
	handleInput2(){
		let password = this.refs.password2.value.trim();
		if(password != ''){
			this.clearBtn.removeAttribute('disabled');
		}else{
			this.clearBtn.setAttribute('disabled', 'disabled');
		}
	}
	handleOk2(){
		let password = this.refs.password2.value.trim();
		if(password == ''){
			return
		}
		this.setState({
	    	confirmLoading3: true,
	    });
		fetch('/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
            	password,
            	type: this.state.cleanType
            })
        })
        .then(response => response.json())
        .then(data => {
        	this.setState({
		    	confirmLoading3: false,
		    });
            if(data.retcode == 200){
            	this.handleCancel2();
            	Modal.success({
			    	title: 'files文件夹清理成功!',
			    	content: 
			    	<div>
				    	<h3>清除的文件如下：</h3>
				    	<br />
				    	<ul>
					    	{data.data.delFilesArr.map(function(file, index){
						    		return <li key={index}>{file}</li>
						    })}
				    	</ul>
			    	</div>,
			  	});
            }else if(data.retcode == 201){
            	this.handleCancel2();
            	Modal.success({
			    	title: 'files文件夹清理成功!',
			    	content: 
			    	<div>
				    	<p>files目录非常干净，没有要清除的文件，记得时常清理哦</p>
			    	</div>,
			  	});
            }else{
            	this.setState({
			    	errTip3: data.retdesc
			  	});
            }
        })
        .catch(e => console.log("Oops, error", e))
	}
	handleCancel2(){
	    this.setState({
	    	visible2: false
	    });
	    setTimeout(() => {
			this.refs.password2.value = '';
			this.setState({
		    	errTip3: '',
		    	confirmLoading3: false
		    });
	    }, 500);
	}
	prepareData(){
		let me = this;
		const { unit } = this.props;
		let localData = unit.toJS();
		let data = localData[0];
		let iframe = document.getElementsByTagName('iframe')[0];
		let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
		let bodyContext = iframeDoc.getElementById("framePage").outerHTML;
		let ids = [];
		let scriptIds = [];
		for(let i=0, len=localData.length; i<len; i++){
			if(localData[i].type = 'STATISTIC' && localData[i].id){
				ids.push(localData[i].id);
			}
		}
		for(let i=0, len=ids.length; i<len; i++){
			scriptIds.push(
				'<script>'+
					'var _hmt = _hmt || [];'+
					'(function() {'+
						'var hm = document.createElement("script");'+
						'hm.src = "https://hm.baidu.com/hm.js?'+ ids[i] + '";'+
						'var s = document.getElementsByTagName("script")[0]; '+
						's.parentNode.insertBefore(hm, s);'+
					'})();'+
				'</script>'
			)
		}
		let htmlContext = 
			'<!DOCTYPE html>' + 
			'<html>' + 
				'<head>'+ 
					'<title>' + data.title +'</title>'+
					'<link rel="shortcut icon" href="/public/favicon.ico">' + 
					'<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui">'+
					'<meta name="keywords" content=' + data.keywords + '>'+
					'<meta name="description" content=' + data.desc + '>'+ 
					'<link type="text/css" rel="stylesheet" href="/release/index.css" />' + 
					'<style id="insertCSS" type="text/css">' + me.insertCSS + '</style>' + 
					scriptIds.join('') +
				'</head>'+ 
				'<body>' + 
					bodyContext + 
					'<script  type="text/javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>' +
					'<script  type="text/javascript" src="/release/index.js"></script>' +
					'<script  type="text/javascript">' + me.insertJS + '</script>'+
				'</body>' + 
			'</html>';
		return encodeURI(htmlContext)
	}
	init(isMount){
		// 插入index.js脚本
		let me = this;
		const { unit } = this.props;
		let localData = unit.toJS();
		let typeArr = [];
		let initType = '';
		// 判断页面首次加载时的fromType
		for(var i=0,len=localData.length; i<len; i++){
			typeArr.push(localData[i].type);
		}
		if(typeArr.indexOf('AUDIO') != -1 && typeArr.indexOf('CODE') != -1){
			initType = 'ALL';
		}else if(typeArr.indexOf('AUDIO') != -1 && typeArr.indexOf('CODE') == -1){
			initType = 'AUDIO';
		}else if(typeArr.indexOf('AUDIO') == -1 && typeArr.indexOf('CODE') != -1){
			initType = 'CODE';
		}
		let jsArr = [];
		let cssArr = [];
		// 在iframe的head里动态插入执行脚本，保证js执行环境一致
		let iframe = document.getElementsByTagName('iframe')[0];
		let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
		let body= iframeDoc.getElementsByTagName('body')[0]; 
		let $jquery = $('#jquery', iframeDoc);
		function reload(type){
			if(type == 'AUDIO' || type == 'ALL'){
				let script= document.createElement('script');
				script.type= 'text/javascript'; 
				script.src= '/release/index.js'; 
				body.appendChild(script);
				// 页面不刷新，所以需要手动删除每次添加的节点
				script.parentNode.removeChild(script);
			}
			if(type == 'CODE' || type == 'ALL'){
				// 插入页面添加的JSCSS组件脚本
				localData.forEach(function(item, index){
					if(item.type == 'CODE'){
						jsArr.push(item.js);
						cssArr.push(item.css);
					}
				})
				let $insertCSS = $('#insertCSS', iframeDoc);
				$insertCSS[0].innerText = me.insertCSS = cssArr.join('\n');
				let script2= document.createElement('script'); 
				script2.type= 'text/javascript'; 
				script2.innerText = me.insertJS = jsArr.join(';');
				body.appendChild(script2);
				script2.parentNode.removeChild(script2);
			}
		}
		function changePOS(){
			setTimeout(function(){
				if($('#framePage', $(body)).height() > $(body).height()){
					$('#copyright', $(body)).css('position', 'absolute');
				}else{
					$('#copyright', $(body)).css('position', 'fixed');
				}
			}, 200);
		}
		// PC端preview环境修改copyright位置
		if(screen.width >= 800){
			changePOS();
		}
		if(isMount){
			// 修改iphone手机上iframe会撑开父元素的高度bug
			body.style.height = '549px';
			body.style.overflow = 'scroll';
			// 移动端preview环境修改copyright位置
			$('#J_preview').on('click', function(){
				changePOS();
			})
			// 脚本需要在jquery加载完毕后执行
			$jquery.on('load', function(){
				reload(initType);
			})
		}else{
			// 增加参数fromType，表明这次是那个组件变化的，确定需不需要执行这部分代码
			reload(localData[0].fromType);
		}
	}
	render() {
		const { unit } = this.props;
		const { visible, visible2, confirmLoading, confirmLoading2, confirmLoading3, stateTip, placeholder, errTip1, errTip2, errTip3, stateOK, isDirnameExist, cleanType } = this.state;
		//初始化meta部分数据
		let localData = unit.toJS();
		let data = localData[0];
		let initialContent='<!DOCTYPE html><html>' + 
							'<head>'+ 
								'<title>' + data.title +'</title>'+
								'<link rel="shortcut icon" href="/public/favicon.ico">' + 
								'<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui">'+
								'<meta name="keywords" content=' + data.keywords + '>'+
								'<meta name="description" content=' + data.desc + '>'+ 
								'<link type="text/css" rel="stylesheet" href="/release/index.css" />' + 
								'<style id="insertCSS" type="text/css"></style>' +
							'</head>'+ 
							'<body class="forPreview"><div id="framePage"></div>'+
							'<script  id="jquery" type="text/javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>' +
							'</body></html>';
		return (
			<section className="m-preview">
				<span id="release" onClick={this.showReleaseModal.bind(this)}><i className="iconfont icon-fabu1"></i>发布</span>
				<a href="/released" className="see-released"><i className="iconfont icon-chakan"></i>查看</a>
				<em className="clearDirectory" onClick={this.showClearModal.bind(this)}>清理</em>
				<Frame  className="iframe" 
	  					initialContent= {initialContent}
	  					contentDidMount={this.init.bind(this, true)}
	  					contentDidUpdate={this.init.bind(this, false)}
	  					mountTarget='#framePage'>
					{renderUnits(unit)}
					<div id="copyright">Powered by <a target="_blank" href="https://www.wty90.com/">Teal</a></div>
				</Frame>
				<Modal title="请输入发布信息"
					wrapClassName="publish-dialog"
					maskClosable={false}
		         	visible={visible}
		         	onOk={this.handleOk.bind(this)}
			        onCancel={this.handleCancel.bind(this)}
		         	footer={[
		            	<Button 
		            		key="back" 
		            		size="large" 
		            		onClick={this.handleCancel.bind(this)}>
		            		取消
		            	</Button>,
		            	<Button 
		            		key="submit" 
		            		id="releaseBtn" 
		            		type="primary" 
		            		size="large" 
		            		loading={confirmLoading} 
		            		onClick={this.handleOk.bind(this)}>
		            		发布
		            	</Button>,
		            	<Button 
		            		style={{float: 'left', display: `${stateOK && isDirnameExist? 'inline-block': 'none'}`}}  
		            		key="danger" 
		            		type="danger" 
		            		size="large" 
		            		loading={confirmLoading2} 
		            		onClick={this.confirmDel.bind(this)}>
		            		删除
		            	</Button>
		          	]}
		        >
			        <div className="dirname f-cb">
			        	<label>发布目录</label>
			        	<input 
			        		ref="dirname" 
			        		name="发布目录" 
			        		type="text" 
			        		placeholder="请输入发布目录"
			        		onInput={this.handleInput.bind(this)}
			        		onFocus={()=>{this.setState({errTip1: '', stateTip: ''})}} 
			        		onBlur={this.handleBlur.bind(this)}/>

			         	<p className={`err-p ${errTip1 == "" && this.refs.dirname != ""? "f-hide" : ""}`}>
			         		<i className={`iconfont icon-cuowu ${errTip1 == ""? "f-hide" : ""}`}></i>{errTip1}
			         	</p>
			         	<p className={`ok-p ${errTip1 == "" && this.refs.dirname != ""? "" : "f-hide"}`}>
			         		<i className={`iconfont icon-dui ${stateTip == ""? "f-hide" : ""}`}></i>{stateTip}
			         	</p>
			        </div>
			        <div className="code">
				        <label>发布密码</label>
			        	<input 
			        		ref="code" 
			        		name="发布密码" 
			        		type="password" 
			        		placeholder={placeholder}
			        		onInput={this.handleInput.bind(this)}
			        		onFocus={()=>{this.setState({errTip2: ''})}}/>
			        </div>
			        <div className="password">
			        	<label>平台密码</label>
			        	<input 
			        		ref="password" 
			        		name="平台密码" 
			        		type="password" 
			        		placeholder="请输入平台密码"
			        		onInput={this.handleInput.bind(this)}
			        		onFocus={()=>{this.setState({errTip2: ''})}}/>
			         	<p className="errTip2"><i className={`iconfont icon-cuowu ${errTip2 == ""? "f-hide" : ""}`}></i>{errTip2}</p>
			        </div>
		        </Modal>
		        <Modal title="哇塞，这都被你发现啦！"
					wrapClassName="clean-dialog"
					maskClosable={false}
		         	visible={visible2}
		         	onOk={this.handleOk2.bind(this)}
			        onCancel={this.handleCancel2.bind(this)}
			        footer={[
		            	<Button 
		            		key="back" 
		            		size="large" 
		            		onClick={this.handleCancel2.bind(this)}>
		            		取消
		            	</Button>,
		            	<Button 
		            		key="submit" 
		            		id="clearBtn" 
		            		type="primary" 
		            		size="large" 
		            		loading={confirmLoading3} 
		            		onClick={this.handleOk2.bind(this)}>
		            		确定
		            	</Button>
		          	]}
		         >
		         	<div className="clear-info">
		         		<div>这是清理后台上传和下载无用文件的按钮，非管理员勿动！</div>
		         		<ul className="f-cb">
		         		  <label className="f-fl">请选择清理类型： </label>
                          <li className="f-fl">
                            <input
                            	name="cleanRadio"
                            	id="shallow"
                                type="radio"
                                value='shallow'
                                ref="shallow"
                                checked={cleanType == "shallow"}
                                onChange={()=>{this.setState({cleanType: 'shallow'})}}
                            />
                            <label htmlFor="shallow">普通清理</label>
                          </li>
                          <li className="f-fl">
                            <input
                            	name="cleanRadio"
                            	id="deep"
                                type="radio"
                                value='deep'
                                ref="deep"
                                checked={cleanType == "deep"}
                                onChange={()=>{this.setState({cleanType: 'deep'})}}
                            />
                            <label htmlFor="deep">深度清理</label>
                          </li>
                        </ul>
		         		<p>注意：普通清理会清理一个月前上传到服务器但是没有发布的文件，深度清理会立刻执行。都将会导致用户缓存文件加载失败。</p>
			        </div>
			        <div className="password">
			        	<label>后台密码</label>
			        	<input 
			        		ref="password2" 
			        		name="后台密码" 
			        		type="password" 
			        		placeholder="请输入后台密码"
			        		onInput={this.handleInput2.bind(this)}
			        		onFocus={()=>{this.setState({errTip3: ''})}}/>
			         	<p className="errTip3"><i className={`iconfont icon-cuowu ${errTip3 == ""? "f-hide" : ""}`}></i>{errTip3}</p>
			        </div>
		        </Modal>
			</section>
		);
	}
}

export default connect(
		state => ({
		unit: state.get('unit'),
	})
)(Preview);