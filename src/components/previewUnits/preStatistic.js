import React, {PropTypes} from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

@pureRender
class PreStatistic extends React.Component {
    static propTypes = {
        data: ImmutablePropTypes.map
    };
    constructor(props) {
        super(props);
    }
    render() {
        var { data } = this.props;
        data = data.toJS();
        return (
            <setction className="statistic">
                
            </setction>
        )
    }
}
export default PreStatistic;
