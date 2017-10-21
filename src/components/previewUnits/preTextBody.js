import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

@pureRender
class PreTextBody extends React.Component {
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
		let fontSize,textIndent,lineHeight,borderRadius;
		let style = {};
		let content = '';
		const { data } = this.props;
		let jsdata = data.toJS();
		if(jsdata.changeLine){
			let text = jsdata.text.replace(/\\\n/g, '');
			let arr = text.split('\n');
			content = arr.map(function(val){return '<p>' + val + '</p>'}).join('');
		}else{
			content = jsdata.text;
		}
		let contentHtml = <article className='article-content' dangerouslySetInnerHTML={{__html: content}}></article>;
		switch(jsdata.fontSize) {
			case 'small': fontSize = '1rem'; break;
			case 'middle': fontSize = '1.2rem'; break;
			case 'big': fontSize = '1.4rem'; break;
			case 'superbig': fontSize = '1.6rem'; break;
		}
		if (jsdata.retract) {
			textIndent = '2em'
		}else {
			textIndent = '0em'
		}
		if(jsdata.bigLH) {
			lineHeight = 2
		}else {
			lineHeight = 1.5
		}
		if(jsdata.borderRadius) {
			borderRadius = '6px'
		}else {
			borderRadius = '0'
		}	
		style = {
			color: jsdata.textColor,
			backgroundColor: jsdata.bgColor,
			textAlign: jsdata.textAlign,
			fontSize: fontSize,
			textIndent: textIndent,
			lineHeight: lineHeight,
			borderRadius: borderRadius,
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
			<section className={`textbody ${jsdata.bigPD? 'bigPD': ''} ${jsdata.noUL? 'noUL': ''}`}  style={style}>
				{contentHtml}
			</section>
		)
	}
}
export default PreTextBody;
