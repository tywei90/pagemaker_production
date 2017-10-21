import './index.scss'

import React, {PropTypes} from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';
import {Upload, message} from 'antd';

import unitAction from '../../../action/unit'
import UnitPanel from '../panel/index';
import ColorPicker from 'rc-color-picker';

@pureRender
class UnitAudio extends React.Component {
    static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
    constructor(props) {
        super(props);
        this.state = {
            uploadProps : {
                name: 'file',
                action: '/genpages/upload',
                accept: 'audio/mp3,audio/wav',
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
                        <label className="f-fl">音频地址</label>
                        <input
                            className="f-fr"
                            type="text"
                            placeholder="音频文件或地址，支持wav/mp3格式"
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
                        <label className="f-fl">尺寸大小</label>
                        <ul className="f-fr">
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`size${id}`}
                                    ref="small"
                                    value="small"
                                    id={`small${id}`}
                                    defaultChecked={data.get('size') === "small"}
                                    onClick={()=>unitAction.editUnit(id, 'size', this.refs.small.value)}
                                />
                                <label htmlFor={`small${id}`}>小</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`size${id}`}
                                    ref="middle"
                                    value="middle"
                                    id={`middle${id}`}
                                    defaultChecked={data.get('size') === "middle"}
                                    onClick={()=>unitAction.editUnit(id, 'size', this.refs.middle.value)}
                                />
                                <label htmlFor={`middle${id}`}>中</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`size${id}`}
                                    ref="big"
                                    value="big"
                                    id={`big${id}`}
                                    defaultChecked={data.get('size') === "big"}
                                    onClick={()=>unitAction.editUnit(id, 'size', this.refs.big.value)}
                                />
                                <label htmlFor={`big${id}`}>大</label>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">定位</label>
                        <ul className="f-fr">
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`position${id}`}
                                    ref="topLeft"
                                    value="topLeft"
                                    id={`topLeft${id}`}
                                    defaultChecked={data.get('position') === "topLeft"}
                                    onClick={()=>unitAction.editUnit(id, 'position', this.refs.topLeft.value)}
                                />
                                <label htmlFor={`topLeft${id}`}>左上角</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`position${id}`}
                                    ref="topRight"
                                    value="topRight"
                                    id={`topRight${id}`}
                                    defaultChecked={data.get('position') === "topRight"}
                                    onClick={()=>unitAction.editUnit(id, 'position', this.refs.topRight.value)}
                                />
                                <label htmlFor={`topRight${id}`}>右上角</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`position${id}`}
                                    ref="bottomRight"
                                    value="bottomRight"
                                    id={`bottomRight${id}`}
                                    defaultChecked={data.get('position') === "bottomRight"}
                                    onClick={()=>unitAction.editUnit(id, 'position', this.refs.bottomRight.value)}
                                />
                                <label htmlFor={`bottomRight${id}`}>右下角</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`position${id}`}
                                    ref="bottomLeft"
                                    value="bottomLeft"
                                    id={`bottomLeft${id}`}
                                    defaultChecked={data.get('position') === "bottomLeft"}
                                    onClick={()=>unitAction.editUnit(id, 'position', this.refs.bottomLeft.value)}
                                />
                                <label htmlFor={`bottomLeft${id}`}>左下角</label>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">背景颜色</label>
                         <input
                            className="input-color f-fl"
                            type="text"
                            placeholder="背景颜色"
                            value={data.get('bgColor')}
                            ref="bgColor"
                            disabled
                        />
                        <ColorPicker 
                            color={data.get('bgColor')} 
                            onChange={(colorObj)=>unitAction.editUnit(id, 'bgColor', colorObj.color)}
                            placement="bottomLeft"
                        />
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
                </ul>
            </UnitPanel>
        );
    }
}

export default UnitAudio;
