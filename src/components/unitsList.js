import React, { PropTypes } from 'react';
import autoBind from 'autobind-decorator';
import pureRender from 'pure-render-decorator';
import { Modal, Button } from 'antd';

import './unitsList.scss';

import unitAction from '../action/unit';

@pureRender
class UnitsList extends React.Component {
    static propTypes = {

    };
    handleClick(name){
        unitAction.addUnit(name);
        this.success();
    }
    success() {
        const modal = Modal.success({
            title: '温馨提示',
            content: '组件添加成功!',
        });
        setTimeout(() => modal.destroy(), 1000);
    }
    info() {
      Modal.info({
        title: '温馨提示',
        content: (
          <div>
            <p>该功能暂未开发，敬请期待</p>
          </div>
        ),
        onOk() {},
      });
    }
    render() {
        return (
            <section className="m-units-list f-fl">
                <ul>
                <li onClick={this.handleClick.bind(this, 'TITLE')}><i className="iconfont icon-iconfonth"></i>标题</li>
                    <li onClick={this.handleClick.bind(this, 'IMAGE')}><i className="iconfont icon-tupian"></i>图片</li>
                    <li onClick={this.handleClick.bind(this, 'BUTTON')}><i className="iconfont icon-anniu"></i>按钮</li>
                    <li onClick={this.handleClick.bind(this, 'TEXTBODY')}><i className="iconfont icon-zhengwen"></i>正文</li>
                    <li onClick={this.handleClick.bind(this, 'AUDIO')}><i className="iconfont icon-yinpin"></i>音频</li>
                    <li onClick={this.handleClick.bind(this, 'CODE')}><i className="iconfont icon-daima"></i>jscss</li>
                    <li onClick={this.info}><i className="iconfont icon-x-rmvb"></i>视频</li>
                    <li onClick={this.info}><i className="iconfont icon-tongji"></i>统计</li>
                </ul>
            </section>
        );
    }
}

export default UnitsList;
