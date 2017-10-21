import React, { PropTypes } from 'react';
import './footer.scss';


let Footer = React.createClass({
    
    render() {
        return (
            <footer>
                 <div className="copyright">&copy;2017-2018 Tianyao Wei, tywei90@163.com</div>
            </footer>
        );
    }
})

export default Footer;
