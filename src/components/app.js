import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable from 'immutable';

import './common.scss';
import './app.scss';

import Header from './header.js';
import UnitsList from './unitsList.js';
import Content from './content.js';
import Footer from './footer.js';
import Preview from './preview.js'

import unitAction from '../action/unit';
import { Modal } from 'antd';

class App extends React.Component {
    showConfirm(address) {
        Modal.confirm({
            title: '温馨提示',
            content: 
            <div>
                <p>因为服务器会定期清理一个月前上传到服务器但是没有发布的文件，所以会导致部分文件加载不了。</p>
                <p>您可以选择返回重新上传如下文件：</p>
                <p>{address}</p>
                <p>或者，如果不需要存储配置可直接选择清空配置。</p>
            </div>,
            onOk() {unitAction.clear();},
            onCancel() {},
            okText:"清空",
            cancelText:"返回"
        });
    }
    componentWillMount() {
        let me = this;
        // 因为清理按钮会清除一个月前上传到服务器但是没有发布的文件，所以会导致图片加载不了
        // 这里做了提示，但是会导致所有文件再次加载一遍
        //检测文件类型: img / audio / video 
        function getFileType(filename) {
            var name = filename.toLowerCase();
            return /\.(?:png|gif|jpg|jpeg|svg)$/.test(name) ? "img" : /\.(?:mp3|ogg|wav)$/.test(name) ? "audio" : /\.(?:ogg|mp4|webm)$/.test(name) ? "video" : 'unknown';
        }
        let localData = localStorage.getItem('config');
        if(!!localData){
            let addressArr = [];
            let formatlocalData = JSON.parse(localData);
            formatlocalData.forEach(function(item, index){
                item.address && addressArr.push(item.address);
            })
            let promises = addressArr.map(function (address) {
                return new Promise(function (resolve, reject) {
                    let type = getFileType(address);
                    if(type != 'unknown'){
                        let domType = document.createElement(type);
                        domType.onload = function() {
                            resolve(domType);
                        };
                        domType.onerror = function() {
                            reject(new Error(address));
                        };
                        domType.src = address;
                    }else{
                        reject(new Error(address));
                    }
                });
            });
            Promise.all(promises).then(function (posts) {
                // console.log('文件加载成功');
                return
            }).catch(function(reason){
                // console.log('文件加载失败');
                me.showConfirm(reason.message);
            });
        }
    }

    componentDidMount() {
        
    }
    render() {
        
        return (
            <div className="window">
                <Header />
                <div className="m-body f-cb">
                    <UnitsList />
                    <Content />
                    <Preview />
                </div>
                <Footer />
            </div>
        );
    }
}

export default App
