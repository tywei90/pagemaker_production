import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';
import { Modal, Upload, message } from 'antd';

import './index.scss';

import unitAction from '../../../action/unit';
import UnitPanel from '../panel/index';

@pureRender
class UnitButton extends React.Component {
    static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
    constructor(props){
        super(props);
        this.state = {
            uploadProps : {
                name: 'file',
                action: '/genpages/upload',
                accept: 'image/*',
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
        const { data, id } = this.props;
        const { uploadProps} = this.state;
        return (
            <UnitPanel id={id} type={data.get('type').toLowerCase()} unitName={data.get('name')} cls={data.get('style') == "default"? '': 'low-height'}>
                <ul>
                    <li>
                        <label className="f-fl">按钮类型</label>
                        <ul className="f-fr">
                          <li className="f-fl">
                            <input
                                className=""
                                name={`buttonType${id}`}
                                id={`default${id}`}
                                type="radio"
                                value='default'
                                ref="default"
                                checked={data.get('style') == "default"}
                                onChange={() => unitAction.editUnit(id, 'style', this.refs.default.value)}
                            />
                            <label htmlFor={`default${id}`}>内置样式</label>
                          </li>
                          <li className="f-fl">
                            <input
                                className=""
                                name={`buttonType${id}`}
                                id={`custome${id}`}
                                type="radio"
                                value='custome'
                                ref="custome"
                                checked={data.get('style') == 'custome'}
                                onChange={() => unitAction.editUnit(id, 'style', this.refs.custome.value)}
                            />
                            <label htmlFor={`custome${id}`}>自定义图片</label>
                          </li>
                        </ul>
                    </li>
                    {/* 内置样式 */}
                    <li className={`${data.get('style') == "default"? "show-default" : "f-hide"}`}>
                        <label className="f-fl">按钮文字</label>
                        <input 
                            className="f-fr"
                            type="text"
                            placeholder="按钮上显示的文字"
                            value={data.get('txt')}
                            ref="txt"
                            onChange={()=>unitAction.editUnit(id, 'txt', this.refs.txt.value)}
                        />
                    </li>
                    {/* 自定义图片 */}
                    <li className={`${data.get('style') == "custome"? "show-default" : "f-hide"}`}>
                        <label className="f-fl">按钮图片</label>
                        <input 
                            className="f-fr"
                            type="text"
                            placeholder="输入完整图片地址，或上传图片"
                            value={data.get('address')}
                            ref="address"
                            onChange={()=>unitAction.editUnit(id, 'address', this.refs.address.value)}
                        />
                        <div className="upload">
                            <Upload {...uploadProps}>
                                <i className="icon iconfont icon-iosbolt"></i>
                            </Upload>
                        </div>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">链接</label>
                        <input 
                            className="f-fr"
                            type="text"
                            placeholder="图片点击跳转地址"
                            value={data.get('url')}
                            ref="url"
                            onChange={()=>unitAction.editUnit(id, 'url', this.refs.url.value)}
                        />
                    </li>
                    <li>
                        <label className="f-fl">APP命令</label>
                        <input 
                            className="f-fr"
                            type="text"
                            placeholder="客户端功能命令，仅当在内嵌客户端时生效"
                            value={data.get('appOrder')}
                            ref="appOrder"
                            onChange={()=>unitAction.editUnit(id, 'appOrder', this.refs.appOrder.value)}
                        />
                    </li>
                    <li className={`${data.get('style') == "default"? "show-default" : "f-hide"}`}>
                        <label className="f-fl">配色</label>
                        <ul className="f-fr">
                          <li className="f-fl">
                            <input
                                name={`buttonStyle${id}`}
                                id={`redStyle${id}`}
                                type="radio"
                                value='redStyle'
                                ref="redStyle"
                                checked={data.get('buttonStyle') === "redStyle"}
                                onChange={()=>unitAction.editUnit(id, 'buttonStyle', this.refs.redStyle.value)}
                            />
                            <label htmlFor={`redStyle${id}`}>红色</label>
                          </li>
                          <li className="f-fl">
                            <input
                                name={`buttonStyle${id}`}
                                id={`yellowStyle${id}`}
                                type="radio"
                                value='yellowStyle'
                                ref="yellowStyle"
                                checked={data.get('buttonStyle') === "yellowStyle"}
                                onChange={()=>unitAction.editUnit(id, 'buttonStyle', this.refs.yellowStyle.value)}
                            />
                            <label htmlFor={`yellowStyle${id}`}>黄色</label>
                          </li>
                          <li className="f-fl">
                            <input
                                name={`buttonStyle${id}`}
                                id={`blueStyle${id}`}
                                type="radio"
                                value='blueStyle'
                                ref="blueStyle"
                                checked={data.get('buttonStyle') === "blueStyle"}
                                onChange={()=>unitAction.editUnit(id, 'buttonStyle', this.refs.blueStyle.value)}
                            />
                            <label htmlFor={`blueStyle${id}`}>蓝色</label>
                          </li>
                        </ul>
                    </li>
                    {/* 内置样式 */}
                    <li className={`${data.get('style') == "default"? "show-default" : "f-hide"}`}>
                        <label className="f-fl">其他</label>
                        <ul className="f-fr">
                            <li className="f-fl">
                                <input 
                                    name={`bigRadius${id}`}
                                    id={`bigRadius${id}`}
                                    ref="bigRadius"
                                    type="checkbox"
                                    checked={data.get('bigRadius') }
                                    onChange={()=>unitAction.editUnit(id, 'bigRadius', this.refs.bigRadius.checked)}
                                />
                                <label htmlFor={`bigRadius${id}`}>大圆角</label>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">组件外边距</label>
                        <ul className="f-fr">
                            <li className="f-fl label-left">
                                <label>上</label>
                                <input 
                                    type="text" 
                                    ref="marginTop"
                                    defaultValue={data.getIn(['margin', 0])}
                                    onChange={()=>unitAction.editUnit(id, 'margin', immutable.fromJS([
                                        parseFloat(this.refs.marginTop.value) || 0,
                                        parseFloat(this.refs.marginRight.value) || 0,
                                        parseFloat(this.refs.marginBottom.value) || 0,
                                        parseFloat(this.refs.marginLeft.value) || 0
                                    ]))}
                                />
                            </li>
                            <li className="f-fl label-left">
                                <label>右</label>
                                <input 
                                    type="text" 
                                    ref="marginRight"
                                    defaultValue={data.getIn(['margin', 1])}
                                    onChange={()=>unitAction.editUnit(id, 'margin', immutable.fromJS([
                                        parseFloat(this.refs.marginTop.value) || 0,
                                        parseFloat(this.refs.marginRight.value) || 0,
                                        parseFloat(this.refs.marginBottom.value) || 0,
                                        parseFloat(this.refs.marginLeft.value) || 0
                                    ]))}
                                />
                            </li>
                            <li className="f-fl label-left">
                                <label>下</label>
                                <input 
                                    type="text" 
                                    ref="marginBottom"
                                    defaultValue={data.getIn(['margin', 2])}
                                    onChange={()=>unitAction.editUnit(id, 'margin', immutable.fromJS([
                                        parseFloat(this.refs.marginTop.value) || 0,
                                        parseFloat(this.refs.marginRight.value) || 0,
                                        parseFloat(this.refs.marginBottom.value) || 0,
                                        parseFloat(this.refs.marginLeft.value) || 0
                                    ]))}
                                />
                            </li>
                            <li className="f-fl label-left">
                                <label>左</label>
                                <input 
                                    type="text" 
                                    ref="marginLeft"
                                    defaultValue={data.getIn(['margin', 3])}
                                    onChange={()=>unitAction.editUnit(id, 'margin', immutable.fromJS([
                                        parseFloat(this.refs.marginTop.value) || 0,
                                        parseFloat(this.refs.marginRight.value) || 0,
                                        parseFloat(this.refs.marginBottom.value) || 0,
                                        parseFloat(this.refs.marginLeft.value) || 0
                                    ]))}
                                />
                            </li>
                        </ul>
                    </li>
                </ul>
            </UnitPanel>
        );
    }
}

export default UnitButton;
