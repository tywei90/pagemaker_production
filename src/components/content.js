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
            confirmLoading: false
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
                // console.log(info.file.response.file.data);
                unitAction.clear();
                unitAction.insert(info.file.response.file.data);
                message.success(`${info.file.name} 导入成功！`);
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
            var a = document.createElement('a');
            a.href = data.filepath;
            a.download = 'config.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return data
        })
        // 预删除后台下载生成的目录失败
        // .then((data) => {
        //     fetch('/delete', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(data.filepath)
        //     })
        // })
        .catch(e => console.log("Oops, error", e))
    }
    render() {
        const { unit } = this.props;
        const { errTip, visible, confirmLoading } = this.state;
        const uploadProps = {
            name: 'file',
            action: '/upload',
            accept: '.json',
            headers: {
                authorization: 'authorization-text',
            },
            onChange: this.handleChange.bind(this)
        };
        return (
            <section className="m-content f-fl">
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
                    <em id="J_preview">预览<i className="icon iconfont icon-yulan"></i></em>
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
