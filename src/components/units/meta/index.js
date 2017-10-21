import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './index.scss';

import unitAction from '../../../action/unit';
import UnitPanel from '../panel/index'; 

@pureRender
class UnitMeta extends React.Component {
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
            <UnitPanel id={id} type={data.get('type').toLowerCase()} unitName={data.get('name')} editable={false}>
                	<ul>
                		<li className="f-cb li-first">
                			<label className="f-fl">页面标题</label>
                			<input 
                                className="f-fr"
                				type="text"
    		                    placeholder="页面标题"
                                value={data.get('title')}
                                ref="title"
    		                    onChange={()=>unitAction.editUnit(id, 'title', this.refs.title.value)}
                			/>
                		</li>
                		<li className="f-cb">
                			<label className="f-fl">关键词</label>
                			<input 
                                className="f-fr"
                				type="text"
    		                    placeholder="页面关键词"
                                value={data.get('keywords')}
                                ref="keywords"
    		                    onChange={()=>unitAction.editUnit(id, 'keywords', this.refs.keywords.value)}
                			/>
                		</li>
                		<li className="f-cb">
                			<label className="f-fl">页面描述</label>
                			<input 
                                className="f-fr"
                				type="text"
    		                    placeholder="页面描述"
                                value={data.get('desc')}
                                ref="desc"
    		                    onChange={()=>unitAction.editUnit(id, 'desc', this.refs.desc.value)}
                			/>
                		</li>
                        <li className="f-cb" style={{'display': 'none'}}>
                            <label className="f-fl">页面背景</label>
                            <input 
                                style={{background:data.get('bgColor')}}
                                className="f-fr"
                                type="text"
                                placeholder="页面背景"
                                value={data.get('bgColor')}
                                ref="bgColor"
                                onChange={()=>unitAction.editUnit(id, 'bgColor', this.refs.bgColor.value)}
                            />
                        </li>
                	</ul>
            </UnitPanel>
        );
    }
}

export default UnitMeta;
