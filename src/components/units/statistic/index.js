import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

import './index.scss';

import unitAction from '../../../action/unit';
import UnitPanel from '../panel/index';

@pureRender
class UnitStatistic extends React.Component {
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
                        <label className="f-fl">百度统计id</label>
                        <input 
                            className="f-fr"
                            type="text"
                            placeholder="铺码标识，就是hm.js?后面那串字符串"
                            value={data.get('id')}
                            ref="text"
                            onChange={()=>unitAction.editUnit(id, 'id', this.refs.text.value)}
                        />
                    </li>
                </ul>
            </UnitPanel>
        );
    }
}

export default UnitStatistic;
