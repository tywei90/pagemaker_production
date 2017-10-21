import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';
import { Modal, Upload, message } from 'antd';

import './index.scss';

import unitAction from '../../../action/unit';

@pureRender
class UnitPanel extends React.Component {
    static propTypes = {
        id: PropTypes.number,
        type: PropTypes.string,
        unitName: PropTypes.string,
        editable: PropTypes.bool,
        cls: PropTypes.string
    };
    static defaultProps = {
        type: '',
        editable: true,
        cls: ''
    };
    constructor(props){
        super(props);
        this.state = {
            showDetail: false,
            pageX: null,
            pageY: null,
            dragFlag: false //设置下是不是在drag状态
        }
    }
    showConfirm(id) {
        Modal.confirm({
            title: '删除面板?',
            onOk() {
                unitAction.removeUnit(id)
            },
            onCancel() {},
        });
    }
    copyUnit(id){
        unitAction.copyUnit(id); 
        this.success();
    }
    success() {
        const modal = Modal.success({
            title: '温馨提示',
            content: '组件复制成功!',
        });
        setTimeout(() => modal.destroy(), 1000);
    }
    handleMouseDown(e) {
        if (!this.state.dragFlag && e.target.className.indexOf('icon-yidong') > -1) {
            this.panel = e.target.offsetParent;
            this.startTop = this.panel.offsetTop;
            this.panel.style.zIndex = 1;
            this.panelTop = parseInt(this.panel.style.top, 10) || 0;
            var unitMain = document.getElementById('unitMain');
            this.pList = [];
            for (let i = 0; i < unitMain.children.length; i++) {
                var unit = unitMain.children[i];
                this.pList.push({top: unit.offsetTop, height: unit.offsetHeight});
            }
            this.setState({dragFlag: true, pageX: e.pageX, pageY: e.pageY});
        }
    }
    handleMouseMove(e) {
        const {pageX, pageY, dragFlag} = this.state;
        if (dragFlag) {
            const moveEvent = {
                moveX: e.pageX - pageX,
                moveY: e.pageY - pageY
            };
            this.panelTop = this.panelTop + moveEvent.moveY;
            this.panel.style.top = this.panelTop + 'px';
            this.setState({pageX: e.pageX, pageY: e.pageY, dragFlag: true});
        } else {
            return false;
        }
    }
    handleMouseUp(e) {
        const {pageX, pageY, dragFlag} = this.state;
        if (dragFlag) {
            e.preventDefault();
            const fid = parseInt(this.panel.id);
            const moveEvent = {
                moveX: e.pageX - pageX,
                moveY: e.pageY - pageY
            };
            const y = this.startTop + this.panelTop + moveEvent.moveY;
            var tid = fid;
            if(y < this.pList[1].top){
                tid = 1;
            }else if(y >= this.pList[this.pList.length - 1].top){
                tid = this.pList.length;
            }else{
                if(y < this.startTop){
                    for (let i = 1; i < fid; i++) {
                        var cur = this.pList[i];
                        var next = this.pList[i+1];
                        if ( y >= cur.top && y < next.top ) {
                            tid = i + 1;
                            break;
                        }
                    }
                }else{
                    for (let i = fid; i < this.pList.length - 1; i++) {
                        var cur = this.pList[i];
                        var next = this.pList[i+1];
                        if ( y >= cur.top && y < next.top ) {
                            tid = i;
                            break;
                        }
                    }
                }
            }
            this.panel.style.zIndex = 'auto';
            this.panel.style.top = '0px';
            this.panel = null;
            this.setState({dragFlag: false, pageX: null, pageY: null});
            unitAction.moveUnit(fid, tid);
        }
    }
    render() {
        const { id, type, unitName, editable, cls, children} = this.props;
        const { showDetail } = this.state;
        return (
            editable?
                <div className={`unit-common unit-${type} ${cls}`}>
                    <div 
                        className="header f-cb" 
                        onClick={(e) => !e.target.className.indexOf('header') && this.setState({'showDetail': !showDetail})}
                        onMouseDown={(e) => this.handleMouseDown(e)}
                        onMouseMove={(e) => this.handleMouseMove(e)}
                        onMouseUp={(e) => this.handleMouseUp(e)}>
                        <i className="f-fl f-hide2 icon iconfont icon-iconfontbi" onClick={() => this.refs.name.focus()}></i>
                        <input 
                            className="f-fl"
                            type="text"
                            value={unitName}
                            ref="name"
                            onChange={()=>unitAction.editUnit(id, 'name', this.refs.name.value)}
                        />
                        <i className={`f-fr icon iconfont icon-zhankaianniu ${showDetail? "arrow-up": "arrow-down"}`} onClick={(e) => this.setState({'showDetail': !showDetail})}></i>
                        <i className="f-fr f-hide2 icon iconfont icon-shanchu1" onClick={this.showConfirm.bind(this, id)}></i>
                        <i className="f-fr f-hide2 icon iconfont icon-fuzhi" onClick={this.copyUnit.bind(this, id)}></i>
                        <i className="f-fr f-hide2 icon iconfont icon-yidong"></i>
                    </div>
                    <div className={`content ${showDetail? "show-detail": "hide-detail"}`}>
                        { children }
                    </div>
                </div>
            :
                <div className={`unit-common unit-${type} ${cls}`}>
                    <div className="header f-cb" onClick={(e) => !e.target.className.indexOf('header') && this.setState({'showDetail': !showDetail})}>
                        <span className="f-fl">{unitName}</span>
                        <i className={`f-fr icon iconfont icon-zhankaianniu ${showDetail? "arrow-up": "arrow-down"}`} onClick={(e) => this.setState({'showDetail': !showDetail})}></i>
                    </div>
                    <div className={`content ${showDetail? "show-detail": "hide-detail"}`}>
                        { children }
                    </div>
                </div>
        );
    }
}

export default UnitPanel;
