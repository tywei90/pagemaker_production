import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';


import './pagelist.scss';

@pureRender
class PageList extends React.Component {
	static propTypes = {
		name: PropTypes.string
	};
	static defaultProps = {
		name: ""
	};
	render() {
		return (
			<ul>
				<li className="list">
					<img src="./src/components/1.png" className="preview-img" />
					<span className="name">保存的第一个页面</span>
					<a className="link">删除</a>
				</li>
				<li className="list">
					<img src="./src/components/2.png" className="preview-img" />
					<span className="name">保存的第二个页面</span>
					<a className="link">删除</a>
				</li>
				<li className="list">
					<img src="./src/components/3.png" className="preview-img" />
					<span className="name">保存的第三个页面</span>
					<a className="link">删除</a>
				</li>
			</ul>
		);
	}
}

export default PageList;


