import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';
import { Modal } from 'antd';

import './index.scss';

import unitAction from '../../../action/unit';
import UnitPanel from '../panel/index';
import ColorPicker from 'rc-color-picker';

@pureRender
class UnitTitle extends React.Component {
    static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
    constructor(props){
        super(props);
    }
    render() {
        const { data, id } = this.props;
        return (
            <UnitPanel id={id} type={data.get('type').toLowerCase()} unitName={data.get('name')}>
                <ul>
                    <li className="f-cb">
                        <label className="f-fl">标题文字</label>
                        <input 
                            className="f-fr"
                            type="text"
                            placeholder="标题文字"
                            value={data.get('text')}
                            ref="text"
                            onChange={()=>unitAction.editUnit(id, 'text', this.refs.text.value)}
                        />
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">链接</label>
                        <input 
                            className="f-fr"
                            type="text"
                            placeholder="标题点击跳转地址"
                            value={data.get('url')}
                            ref="url"
                            onChange={()=>unitAction.editUnit(id, 'url', this.refs.url.value)}
                        />
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">标题颜色</label>
                         <input
                            className="input-color f-fl"
                            type="text"
                            placeholder="标题颜色"
                            value={data.get('color')}
                            ref="color"
                            disabled
                        />
                        <ColorPicker 
                            color={data.get('color')} 
                            onChange={(colorObj)=>unitAction.editUnit(id, 'color', colorObj.color)}
                            placement="bottomLeft"
                        />
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">字体大小</label>
                        <ul className="f-fr">
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`fontSize${id}`}
                                    ref="small"
                                    value="small"
                                    id={`small${id}`}
                                    defaultChecked={data.get('fontSize') === "small"}
                                    onClick={()=>unitAction.editUnit(id, 'fontSize', this.refs.small.value)}
                                />
                                <label htmlFor={`small${id}`}>小</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`fontSize${id}`}
                                    ref="middle"
                                    value="middle"
                                    id={`middle${id}`}
                                    defaultChecked={data.get('fontSize') === "middle"}
                                    onClick={()=>unitAction.editUnit(id, 'fontSize', this.refs.middle.value)}
                                />
                                <label htmlFor={`middle${id}`}>中</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`fontSize${id}`}
                                    ref="big"
                                    value="big"
                                    id={`big${id}`}
                                    defaultChecked={data.get('fontSize') === "big"}
                                    onClick={()=>unitAction.editUnit(id, 'fontSize', this.refs.big.value)}
                                />
                                <label htmlFor={`big${id}`}>大</label>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">布局</label>
                        <ul className="f-fr">
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`textAlign${id}`}
                                    ref="left"
                                    value="left"
                                    id={`left${id}`}
                                    defaultChecked={data.get('textAlign') === "left"}
                                    onClick={()=>unitAction.editUnit(id, 'textAlign', this.refs.left.value)}
                                />
                                <label htmlFor={`left${id}`}>居左</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`textAlign${id}`}
                                    ref="center"
                                    value="center"
                                    id={`center${id}`}
                                    defaultChecked={data.get('textAlign') === "center"}
                                    onClick={()=>unitAction.editUnit(id, 'textAlign', this.refs.center.value)}
                                />
                                <label htmlFor={`center${id}`}>居中</label>
                            </li>
                            <li className="f-fl">
                                <input 
                                    type="radio" 
                                    name={`textAlign${id}`}
                                    ref="right"
                                    value="right"
                                    id={`right${id}`}
                                    defaultChecked={data.get('textAlign') === "right"}
                                    onClick={()=>unitAction.editUnit(id, 'textAlign', this.refs.right.value)}
                                />
                                <label htmlFor={`right${id}`}>居右</label>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">组件内边距</label>
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
                                />
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

export default UnitTitle;
