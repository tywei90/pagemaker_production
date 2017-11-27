import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Modal, Upload, message } from 'antd';

import './content.scss';
// 在content里引入一次color-picker样式即可
import 'rc-color-picker/assets/index.css';

import unitAction from '../action/unit';

import UnitMeta from './units/meta/index'
import UnitTitle from './units/title/index'
import UnitImage from './units/image/index'
import UnitButton from './units/button/index'
import UnitTextBody from './units/textbody/index'
import UnitAudio from './units/audio/index'
import UnitCode from './units/code/index'

import Preview from './preview.js'
import $ from 'jquery'

import 'whatwg-fetch'

const renderUnits = units => {
    return units.map((item, index) => {
        switch (item.get('type')) {
            case 'META' :
                return <li key={index} id={index}><UnitMeta id={index} data={item} /></li>
            case 'TITLE' :
                return <li key={index} id={index}><UnitTitle id={index} data={item} /></li>
            case 'IMAGE' :
                return <li key={index} id={index}><UnitImage id={index} data={item} /></li>
            case 'BUTTON' :
                return <li key={index} id={index}><UnitButton id={index} data={item} /></li>
            case 'TEXTBODY' :
                return <li key={index} id={index}><UnitTextBody id={index} data={item} /></li>
            case 'AUDIO' :
                return <li key={index} id={index}><UnitAudio id={index} data={item} /></li>
            case 'CODE' :
                return <li key={index} id={index}><UnitCode id={index} data={item} /></li>
        }
    });
};

@pureRender
class Content extends React.Component {
    static propTypes = {
        unit: ImmutablePropTypes.list,
    };
    constructor(props){
        super(props);
        this.state = {
            errTip: '',
            visible: false,
            confirmLoading: false,
            pageX: null,
            pageY: null
        }
    }
    clearSettings(){
        Modal.confirm({
            title: '确认清空所有配置?',
            onOk() {
                unitAction.clear();
            },
            onCancel() {}
        });
    }
    handleChange(info) {
        if (info.file.status !== 'uploading') {
            console.log('正在导入...');
        }
        if (info.file.status === 'done') {
            console.log('导入完成！');
            this.setState({
                errTip: '',
                visible: false,
                confirmLoading: false
            });
            if(info.file.response.file.ok){
                if(/\.json$/.test(info.file.response.file.url)){
                    unitAction.clear();
                    unitAction.insert(info.file.response.file.data);
                    message.success(`${info.file.name} 导入成功！`);
                }else{
                    message.error('文件格式错误');
                }
            }else{
                message.error(`${info.file.response.file.des}，导入失败！`);
            }
        } else if (info.file.status === 'error') {
            console.log('导入失败！');
            message.error(`${info.file.name} 导入失败！`);
        }
    }
    handleOk(){
        let inputInfo = this.refs.inputInfo.value.trim();
        if(inputInfo === ''){
            this.setState({
                errTip: '输入信息不能为空',
            });
            return
        }
        this.setState({
            confirmLoading: true,
        });
        fetch('/getConfig', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({inputInfo})
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                confirmLoading: false,
            });
            if(data.retcode == 200){
                this.handleCancel();
                unitAction.insert(data.config);
                message.success(data.retdesc || "信息导入成功！");
            }else{
                this.setState({
                    errTip: data.retdesc
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
            this.refs.inputInfo.value = '';
            this.setState({
                errTip: '',
                confirmLoading: false
            });
        }, 500);
    }
    download(){
        var config = JSON.parse(localStorage.getItem('config') || '');
        fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
        .then(response => response.json())
        .then(data => {
            if(screen.width > 800){
                var a = document.createElement('a');
                a.href = data.filepath;
                a.download = 'config.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }else{
                location.href = data.filepath;
            }
        })
        .catch(e => console.log("Oops, error", e))
    }
     handleTouchStart(e) {
        this.scale = 1.5;
        this.$panel = $('#J_preview');
        this.$panel.css('transform', `scale(${this.scale})`);
        this.$panel.css('-webkit-transform', `scale(${this.scale})`);
        this.panelRight = parseInt(this.$panel.css('right'), 10);
        this.panelBottom = parseInt(this.$panel.css('bottom'), 10);
        this.setState({pageX: e.pageX, pageY: e.pageY});
    }
    handleTouchMove(e) {
        const panelW = parseInt(this.$panel.css('width'), 10);
        const panelH = parseInt(this.$panel.css('height'), 10);
        const minW = panelW*(this.scale - 1)*0.5;
        const maxW = window.innerWidth - panelW*(this.scale + 1)*0.5;
        const minH = panelH*(this.scale - 1)*0.5;
        const maxH = window.innerHeight - panelH*(this.scale + 1)*0.5;
        const {pageX, pageY} = this.state;
        e.preventDefault();
        e = e.touches[0];
        const moveEvent = {
            moveX: e.pageX - pageX,
            moveY: e.pageY - pageY
        };
        this.panelRight = this.panelRight - moveEvent.moveX;
        this.panelBottom = this.panelBottom - moveEvent.moveY;
        // 边界判断
        if(this.panelRight <= minW){
            this.panelRight = minW;
        }
        if(this.panelRight >= maxW){
            this.panelRight = maxW;
        }
        if(this.panelBottom <= minH){
            this.panelBottom = minH;
        }
        if(this.panelBottom >= maxH){
            this.panelBottom = maxH;
        }
        this.$panel.css('right', this.panelRight);
        this.$panel.css('bottom', this.panelBottom);
        this.setState({pageX: e.pageX, pageY: e.pageY});
    }
    handleTouchEnd(e) {
        e.preventDefault();
        this.$panel.css('transform', 'scale(1)');
        this.$panel.css('-webkit-transform', 'scale(1)');
    }
    goPrev(e){
        if(!this.$prev.hasClass('active')) return
        let configs = JSON.parse(sessionStorage.getItem('configs'));
        let index = parseInt(sessionStorage.getItem('index'));
        unitAction.insert(JSON.parse(configs[index - 1]), -1);
    }
    goNext(e){
        if(!this.$next.hasClass('active')) return
        let configs = JSON.parse(sessionStorage.getItem('configs'));
        let index = parseInt(sessionStorage.getItem('index'));
        unitAction.insert(JSON.parse(configs[index + 1]), 1);
    }
    componentDidMount(){
        this.$prev = $('.J_prev');
        this.$next = $('.J_next');
    }
    componentWillUpdate(){
        let configs = JSON.parse(sessionStorage.getItem('configs'));
        let index = parseInt(sessionStorage.getItem('index'));
        if(index > 0){
            this.$prev.addClass('active');
        }else{
            this.$prev.removeClass('active');
        }
        if(index < configs.length - 1){
            this.$next.addClass('active');
        }else{
            this.$next.removeClass('active');
        }
    }
    render() {
        const { unit } = this.props;
        const { errTip, visible, confirmLoading } = this.state;
        const uploadProps = {
            name: 'file',
            action: '/upload?type=page',
            accept: '.json',
            headers: {
                authorization: 'authorization-text',
            },
            onChange: this.handleChange.bind(this)
        };
        // if(screen.width < 800){
        //     uploadProps.accept = '.json,.txt,.js';
        // }
        return (
            <section className="m-content f-fl">
                <em id="J_preview"
                    onTouchStart={(e) => this.handleTouchStart(e.touches[0])}
                    onTouchMove={(e) => this.handleTouchMove(e)}
                    onTouchEnd={(e) => this.handleTouchEnd(e)}
                >
                    <i className="icon iconfont icon-yulan"></i>
                </em>
                <Modal title="导入配置"
                    wrapClassName="upload-dialog"
                    visible={visible}
                    maskClosable={false}
                    onOk={this.handleOk.bind(this)}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <div className="m-upload">
                        <em>1、上传本地json配置文件，</em>
                        <span>
                            <Upload {...uploadProps}>点击这里</Upload>
                        </span>
                    </div>
                    <div className="m-inputInfo">
                        <label>2、输入相关信息</label>
                        <textarea 
                            ref="inputInfo" 
                            type="text" 
                            placeholder="支持以下信息导入：&#13;&#10;1. 发布目录名称&#13;&#10;2. 完整的线上地址&#13;&#10;3. 完整的 json 配置信息"
                            onFocus={()=>{this.setState({errTip: ''})}} 
                        ></textarea>
                        <p className="errTip"><i className={`iconfont icon-cuowu ${errTip == ""? "f-hide" : ""}`}></i>{errTip}</p>
                        <h4>注意！！加载新配置会清空现有的配置！！</h4>
                    </div>
                </Modal>
                <div>
                    内容配置区(
                    <span className="J_insert" onClick={() => this.setState({visible: true})}>导入</span>|
                    <span className="J_output" onClick={this.download}>导出</span>|
                    <span className="J_clear" onClick={this.clearSettings}>清空</span>)
                    <i className="icon iconfont icon-iconfonthoutui J_prev" onClick={this.goPrev.bind(this)}></i>
                    <i className="icon iconfont icon-iconfontqianjin J_next" onClick={this.goNext.bind(this)}></i>
                </div>
                <ul id="unitMain">
                    {renderUnits(unit)}
                </ul>
            </section>
        );
    }
}

export default connect(
    state => ({
        unit: state.get('unit'),
    })
)(Content);
