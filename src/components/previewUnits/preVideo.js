import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

@pureRender
class PreVideo extends React.Component {
	static propTypes = {
        data: ImmutablePropTypes.map,
        id: PropTypes.number
    };
	constructor(props){
		super(props);
	}
	render() {
		var video;
		var style = {};
		const { data } = this.props;
		let jsdata = data.toJS();
		style = {
			paddingTop: jsdata.padding[0],
			paddingRight: jsdata.padding[1],
			paddingBottom: jsdata.padding[2],
			paddingLeft: jsdata.padding[3]
		};
		video = (function(){
			if(jsdata.auto && jsdata.loop){
				return <video src={jsdata.address} x-webkit-airplay="allow" webkit-playsinline="true" preload controls frontend width="100%" autoPlay  loop></video>
			}else if(!jsdata.auto && jsdata.loop){
				return <video src={jsdata.address} x-webkit-airplay="allow" webkit-playsinline="true" preload controls frontend width="100%" loop></video>
			}else if(jsdata.auto && !jsdata.loop){
				return <video src={jsdata.address} x-webkit-airplay="allow" webkit-playsinline="true" preload controls frontend width="100%" autoPlay></video>
			}else{
				return <video src={jsdata.address} x-webkit-airplay="allow" webkit-playsinline="true" preload controls frontend width="100%"></video>
			}
		})();
		return (
			!!jsdata.address?
			<section className="m-video" style={style}>
				{video}
			</section>
			: null
		)
	}
}
export default PreVideo;
