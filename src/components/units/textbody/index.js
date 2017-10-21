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
class UnitTextBody extends React.Component {
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
                    {/* 正文内容 */}
                    <li className="f-cb title-part">
                        <label className="f-fl">正文内容</label>
                        <ul className="f-fr">
                            <li className="f-cb f-fl" style={{position:'relative'}}> 
                            <textarea
                                className="f-fl"
                                type="text"
                                placeholder="正文内容"
                                value={data.get('text')}
                                ref="text"
                                onChange={()=>unitAction.editUnit(id, 'text', this.refs.text.value)}
                            ></textarea>
                            <span className="example-btn f-fl" >
                                <a
                                    data-info='这里是正文，原则上支持任何html代码，不过你要小心，不要从别处直接复制html过来，否则可能会造成一些不可预期的潜在风险。这里可以<b>标红</b><i>标黄</i><strong>加粗</strong><a href="share://">分享链接</a>。在行尾添加 \ 字符后，可以消除一个换行导致的分段，可使两行间距变小一些。'
                                    onClick={e=>unitAction.editUnit(id, 'text', e.target.getAttribute('data-info'))}
                                >
                                    示例
                                </a>
                            </span>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">字体颜色</label>
                        <input
                            className="input-color f-fl"
                            type="text"
                            placeholder="字体颜色"
                            value={data.get('textColor')}
                            ref="textColor"
                            disabled
                        />
                        <ColorPicker 
                            color={data.get('textColor')} 
                            onChange={(colorObj)=>unitAction.editUnit(id, 'textColor', colorObj.color)}
                            placement="bottomLeft"
                        />
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">正文背景</label>
                        <input
                            className="input-color f-fl"
                            type="text"
                            placeholder="正文背景"
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
                    {/* 布局 */}
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
                    {/* 字体大小 */}
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
                            <li className="f-fl">
                                <input
                                    type="radio"
                                    name={`fontSize${id}`}
                                    ref="superbig"
                                    value="superbig"
                                    id={`superbig${id}`}
                                    defaultChecked={data.get('fontSize') === "superbig"}
                                    onClick={()=>unitAction.editUnit(id, 'fontSize', this.refs.superbig.value)}
                                />
                              <label htmlFor={`superbig${id}`}>超大</label>
                            </li>
                        </ul>
                    </li>
                    <li className="f-cb">
                        <label className="f-fl">其他设置</label>
                        <ul className="f-fr">
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="changeLine"
                                    value="changeLine"
                                    id={`changeLine${id}`}
                                    defaultChecked={data.get('changeLine')}
                                    onClick={()=>unitAction.editUnit(id, 'changeLine', this.refs.changeLine.checked)}
                                />
                              <label htmlFor={`changeLine${id}`}>回车换行</label>
                            </li>
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="retract"
                                    value="retract"
                                    id={`retract${id}`}
                                    defaultChecked={data.get('retract')}
                                    onClick={()=>unitAction.editUnit(id, 'retract', this.refs.retract.checked)}
                                />
                              <label htmlFor={`retract${id}`}>换行缩进</label>
                            </li>
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="bigLH"
                                    value="bigLH"
                                    id={`bigLH${id}`}
                                    defaultChecked={data.get('bigLH')}
                                    onClick={()=>unitAction.editUnit(id, 'bigLH', this.refs.bigLH.checked)}
                                />
                              <label htmlFor={`bigLH${id}`}>大行距</label>
                            </li>
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="bigPD"
                                    value="bigPD"
                                    id={`bigPD${id}`}
                                    defaultChecked={data.get('bigPD')}
                                    onClick={()=>unitAction.editUnit(id, 'bigPD', this.refs.bigPD.checked)}
                                />
                              <label htmlFor={`bigPD${id}`}>大段距</label>
                            </li>
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="noUL"
                                    value="noUL"
                                    id={`noUL${id}`}
                                    defaultChecked={data.get('noUL')}
                                    onClick={()=>unitAction.editUnit(id, 'noUL', this.refs.noUL.checked)}
                                />
                              <label htmlFor={`noUL${id}`}>链接无下划线</label>
                            </li>
                            <li className="f-fl">
                                <input
                                    type="checkbox"
                                    name={`moreSettings${id}`}
                                    ref="borderRadius"
                                    value="borderRadius"
                                    id={`borderRadius${id}`}
                                    defaultChecked={data.get('borderRadius')}
                                    onClick={()=>unitAction.editUnit(id, 'borderRadius', this.refs.borderRadius.checked)}
                                />
                              <label htmlFor={`borderRadius${id}`}>圆角边框</label>
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

export default UnitTextBody;
