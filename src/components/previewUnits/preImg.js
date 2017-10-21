import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

@pureRender
class PreImg extends React.Component {
	static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
	constructor(props){
		super(props);
		this.state = {
		}
	}
	render() {
		var style = {};
		const { data } = this.props;
		let jsdata = data.toJS();
		style = {
			backgroundColor: jsdata.bgColor,
			marginTop: jsdata.margin[0],
			marginRight: jsdata.margin[1],
			marginBottom: jsdata.margin[2],
			marginLeft: jsdata.margin[3],
			paddingTop: jsdata.padding[0],
			paddingRight: jsdata.padding[1],
			paddingBottom: jsdata.padding[2],
			paddingLeft: jsdata.padding[3]
		};
		return (
			<section className={`image`} style={style}>
				<a href= {jsdata.url}>
					<img src={jsdata.address} />	
				</a>			
			</section>
		)
	}
}
export default PreImg;
