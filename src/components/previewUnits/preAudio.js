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
		var height, width, audio;
		var style = {};
		const { data } = this.props;
		let jsdata = data.toJS();
		switch(jsdata.size) {
			case 'small': 	height = width = '2rem'; break;
			case 'middle': 	height = width = '3rem'; break;
			case 'big': 	height = width = '4rem'; break;
		}
		style = {
			height,
			width,
			backgroundColor: jsdata.bgColor
		};
		audio = (function(){
			if(jsdata.auto && jsdata.loop){
				return <audio className="bgMusic" src={jsdata.address}  autoPlay  loop></audio>
			}else if(!jsdata.auto && jsdata.loop){
				return <audio className="bgMusic" src={jsdata.address}  loop></audio>
			}else if(jsdata.auto && !jsdata.loop){
				return <audio className="bgMusic" src={jsdata.address} autoPlay></audio>
			}else{
				return <audio className="bgMusic" src={jsdata.address}></audio>
			}
		})();
		return (
			!!jsdata.address?
			<section className={`audio ${jsdata.position}`} style={style}>
				<a className="mscBtn mscRoll">
					<i className="music-pause"></i>
					<i className="music-play"></i>
				</a>
				{audio}
			</section>
			: null
		)
	}
}
export default PreTitle;
