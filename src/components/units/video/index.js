import './index.scss'

import React, {PropTypes} from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';
import {Upload, message} from 'antd';

import unitAction from '../../../action/unit'
import UnitPanel from '../panel/index';

@pureRender
class UnitVideo extends React.Component {
    static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
    constructor(props) {
        super(props);
        this.state = {
            uploadProps : {
                name: 'file',
                action: '/upload?type=video',
                accept: 'video/mp4',
                headers: {
                    authorization: 'authorization-text',
                },
                onChange(info) {
                    if (info.file.status !== 'uploading') {
                        console.log('正在上传...');
                    }
                    if (info.file.status === 'done') {
                        console.log('上传完成！');
                        if(info.file.response.file.ok){
                            unitAction.editUnit(props.id, 'address', info.file.response.file.url);
                            message.success(`${info.file.name} 上传成功！`);
                        }else{
                            message.error(`${info.file.response.file.des}，上传失败！`);
                        }
                    } else if (info.file.status === 'error') {
                        console.log('上传失败！');
                        message.error(`${info.file.name} 上传失败！`);
                    }
                }
            }
        }
    }
    render() {
        const {data, id} = this.props;
        const {uploadProps} = this.state;
        return (
            <UnitPanel id={id} type={data.get('type').toLowerCase()} unitName={data.get('name')}>
                <ul>
                    <li className="f-cb">
                        <label className="f-fl">视频地址</label>
                        <input
                            className="f-fr"
                            type="text"
                            placeholder="视频文件或地址，仅支持mp4格式"
                            value={data.get('address')}
                            ref="address"
                            onChange={() => unitAction.editUnit(id, 'address', this.refs.address.value)}/>
                        <div className="upload">
                            <Upload {...uploadProps}>
                                <i className="icon iconfont icon-iosbolt"></i>
                            </Upload>
                        </div>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">播放设置</label>
                        <ul className="f-fr">
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="loop"
                                    value="loop"
                                    id={`loop${id}`}
                                    defaultChecked={data.get('loop')}
                                    onClick={()=>unitAction.editUnit(id, 'loop', this.refs.loop.checked)}
                                />
                              <label htmlFor={`loop${id}`}>循环播放</label>
                            </li>
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="auto"
                                    value="auto"
                                    id={`auto${id}`}
                                    defaultChecked={data.get('auto')}
                                    onClick={()=>unitAction.editUnit(id, 'auto', this.refs.auto.checked)}
                                />
                              <label htmlFor={`auto${id}`}>自动播放</label>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">组件边距</label>
                        <ul className="f-fr">
                            <li className="f-fl label-left">
                                <label>上</label>
                                <input
                                    type="text"
                                    ref="paddingTop"
                                    defaultValue={data.getIn(['padding', 0])}
                                    onChange={()=>unitAction.editUnit(id, 'padding', immutable.fromJS([
                                        parseFloat(this.refs.paddingTop.value) || 0,
                                        parseFloat(this.refs.paddingRight.value) || 0,
                                        parseFloat(this.refs.paddingBottom.value) || 0,
                                        parseFloat(this.refs.paddingLeft.value) || 0
                                    ]))}
                                    onBlur={() => this.refs.paddingTop.value = this.refs.paddingTop.value || 0}
                                />
                            </li>
                            <li className="f-fl label-left">
                                <label>右</label>
                                <input
                                    type="text"
                                    ref="paddingRight"
                                    defaultValue={data.getIn(['padding', 1])}
                                    onChange={()=>unitAction.editUnit(id, 'padding', immutable.fromJS([
                                        parseFloat(this.refs.paddingTop.value) || 0,
                                        parseFloat(this.refs.paddingRight.value) || 0,
                                        parseFloat(this.refs.paddingBottom.value) || 0,
                                        parseFloat(this.refs.paddingLeft.value) || 0
                                    ]))}
                                    onBlur={() => this.refs.paddingRight.value = this.refs.paddingRight.value || 0}
                                />
                            </li>
                            <li className="f-fl label-left">
                                <label>下</label>
                                <input
                                    type="text"
                                    ref="paddingBottom"
                                    defaultValue={data.getIn(['padding', 2])}
                                    onChange={()=>unitAction.editUnit(id, 'padding', immutable.fromJS([
                                        parseFloat(this.refs.paddingTop.value) || 0,
                                        parseFloat(this.refs.paddingRight.value) || 0,
                                        parseFloat(this.refs.paddingBottom.value) || 0,
                                        parseFloat(this.refs.paddingLeft.value) || 0
                                    ]))}
                                    onBlur={() => this.refs.paddingBottom.value = this.refs.paddingBottom.value || 0}
                                />
                            </li>
                            <li className="f-fl label-left">
                                <label>左</label>
                                <input
                                    type="text"
                                    ref="paddingLeft"
                                    defaultValue={data.getIn(['padding', 3])}
                                    onChange={()=>unitAction.editUnit(id, 'padding', immutable.fromJS([
                                        parseFloat(this.refs.paddingTop.value) || 0,
                                        parseFloat(this.refs.paddingRight.value) || 0,
                                        parseFloat(this.refs.paddingBottom.value) || 0,
                                        parseFloat(this.refs.paddingLeft.value) || 0
                                    ]))}
                                    onBlur={() => this.refs.paddingLeft.value = this.refs.paddingLeft.value || 0}
                                />
                            </li>
                        </ul>
                    </li>
                </ul>
            </UnitPanel>
        );
    }
}

export default UnitVideo;
