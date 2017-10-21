import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

@pureRender
class PreTitle extends React.Component {
	static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
	constructor(props){
		super(props);
	}
	render() {
		var fontSize;
		var style = {}, styleInner = {};
		const { data } = this.props;
		let jsdata = data.toJS();
		switch(jsdata.fontSize) {
			case 'small': fontSize = '1.2rem'; break;
			case 'middle': fontSize = '1.5rem'; break;
			case 'big': fontSize = '2rem'; break;
		}
		style = {
			marginTop: jsdata.margin[0],
			marginRight: jsdata.margin[1],
			marginBottom: jsdata.margin[2],
			marginLeft: jsdata.margin[3],
			paddingTop: jsdata.padding[0],
			paddingRight: jsdata.padding[1],
			paddingBottom: jsdata.padding[2],
			paddingLeft: jsdata.padding[3]
		};
		styleInner = {
			color: jsdata.color,				
			fontSize: fontSize,
			textAlign: jsdata.textAlign,
		}
		return (
			<section className={`title`} style={style}>
				<a href= {jsdata.url}  style={styleInner} >
					{jsdata.text}
				</a>
			</section>
		)
	}
}
export default PreTitle;
