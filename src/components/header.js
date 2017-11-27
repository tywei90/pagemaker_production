import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';


import './header.scss';

@pureRender
class Header extends React.Component {
    // static propTypes = {
    //     name: PropTypes.string
    // };
    // static defaultProps = {
    //     name: "游客"
    // };
    constructor(props){
        super(props);
        this.state = {
            username: ''
        }
    }
    // ajax请求正确方式
    componentDidMount(){
        fetch('/username', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({username: data.data.username || '游客'})
        })
        .catch(e => console.log("Oops, error", e))
    }
    render() {
        const {username} = this.state;
        return (
            <header className="f-cb">
                <i className="aside-unitList icon iconfont icon-zhankai" id="J_aside"></i>
                <a href="/" className="goHome f-fl"><i className="icon iconfont icon-fire"></i><span>Pagemaker</span></a>
                <div className="user f-fr"><a>您好，{username}</a></div>
            </header>
        );
    }
}

export default Header;
