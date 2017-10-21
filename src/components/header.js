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
        fetch('/genpages/username', {
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
                <a href="/" className="goHome icon iconfont icon-fire f-fl"></a>
                <div className="links f-fl">
                    <a className="active" href="/genpages">pagemaker</a>
                    <a href="/email">直邮工具</a>
                    <a href="/h5">动效页</a>
                </div>
                <div className="user f-fr">
                    <a href="/users">您好，{username}</a>
                </div>
            </header>
        );
    }
}

export default Header;
