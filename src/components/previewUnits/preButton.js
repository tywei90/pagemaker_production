import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

@pureRender
class PreButton extends React.Component {
	static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
	constructor(props){
		super(props);
	}
	render() {
		const { data, id } = this.props;
		let style = {}, styleInner = {};
		let jsdata = data.toJS();
		style = {
			marginTop: jsdata.margin[0] + 'px',
			marginRight: jsdata.margin[1] + 'px',
			marginBottom: jsdata.margin[2] + 'px',
			marginLeft: jsdata.margin[3] + 'px'
		};
		let borderRadius;
		if (jsdata.bigRadius) {
			borderRadius = "3rem";
		} else {
			borderRadius = "0.5rem";
		}
		let btnStyle = jsdata.buttonStyle;
		let bgColor;
		let color;
		if (jsdata.style == 'custome') {
			let background = jsdata.address;
			color = '#333';
			styleInner = {
				color: color,
				background: 'url(' + background + ') no-repeat center center /100%',
				borderRadius: 0
			}
		}
		else {
			switch(btnStyle) {
				case 'redStyle':
					bgColor = '#d91d37';
					color = '#ffffff';
					break;
				case 'yellowStyle':
					bgColor = '#ffb400';
					color = '#38200b';
					break;
				case 'blueStyle':
					bgColor = '#4095d6';
					color ='#ffffff';
					break;
			}
			styleInner = {
				color: color,
				backgroundColor: bgColor,
				borderRadius: borderRadius
			}
		}
		return (
			<section className={`button`} style={style}>
				<a style={styleInner} href={jsdata.url} data-cmd={jsdata.appOrder}>{jsdata.style == 'custome'? " " : jsdata.txt }</a>
			</section>
		)
	}
}
export default PreButton;
