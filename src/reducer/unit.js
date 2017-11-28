import immutable from 'immutable';

const unitsConfig = immutable.fromJS({
    META: {
        type: 'META',
        name: 'META信息配置',
        title: '',
        keywords: '',
        desc: ''
    },
    TITLE: {
        type: 'TITLE',
        name: '标题',
        text: '',
        url: '',
        color: '#000',
        fontSize: "middle",
        textAlign: "center",
        padding: [0, 0, 0, 0],
        margin: [10, 0, 20, 0]
    },
    IMAGE: {
        type: 'IMAGE',
        name: '图片',
        address: '',
        url: '',
        bgColor: '#fff',
        padding: [0, 0, 0, 0],
        margin: [10, 0, 20, 0]
    },
    BUTTON: {
        type: 'BUTTON',
        name: '按钮',
        address: '',
        url: '',
        txt: '',
        margin: [
            0, 30, 20, 30
        ],
        buttonStyle: "yellowStyle",
        bigRadius: true,
        style: 'default'
    },
    TEXTBODY: {
        type: 'TEXTBODY',
        name: '正文',
        text: '',
        textColor: '#333',
        bgColor: '#fff',
        fontSize: "small",
        textAlign: "center",
        padding: [0, 0, 0, 0],
        margin: [0, 30, 20, 30],
        changeLine: true,
        retract: true,
        bigLH: true,
        bigPD: true,
        noUL: true,
        borderRadius: true
    },
    AUDIO: {
        type: 'AUDIO',
        name: '音频',
        address: '',
        size: 'middle',
        position: 'topRight',
        bgColor: '#9160c3',
        loop: true,
        auto: true
    },
    VIDEO: {
        type: 'VIDEO',
        name: '视频',
        address: '',
        loop: true,
        auto: true,
        padding: [0, 20, 30, 20]
    },
    CODE: {
        type: 'CODE',
        name: 'JSCSS',
        js: '',
        css: ''
    }
})

const initialState = immutable.fromJS([
    {
        type: 'META',
        name: 'META信息配置',
        title: '',
        keywords: '',
        desc: '',
        // 非常重要的属性，表明这次state变化来自哪个组件！
        fromType: ''
    }
]);


function reducer(state = initialState, action) {
    let newState, localData, tmp
    // 初始化从localstorage取数据
    if (state === initialState) {
        localData = localStorage.getItem('config');
        !!localData && (state = immutable.fromJS(JSON.parse(localData)));
        // sessionStorage的初始化
        sessionStorage.setItem('configs', JSON.stringify([]));
        sessionStorage.setItem('index', 0);
    }
    switch (action.type) {
        case 'AddUnit': {
            tmp = state.push(unitsConfig.get(action.name));
            newState = tmp.setIn([0, 'fromType'], action.name);
            break
        }
        case 'CopyUnit': {
            tmp = state.push(state.get(action.id));
            newState = tmp.setIn([0, 'fromType'], state.getIn([action.id, 'type']));
            break
        }
        case 'EditUnit': {
            tmp = state.setIn([action.id, action.prop], action.value);
            newState = tmp.setIn([0, 'fromType'], state.getIn([action.id, 'type']));
            break
        }
        case 'RemoveUnit': {
            const type = state.getIn([action.id, 'type']);
            tmp = state.splice(action.id, 1);
            newState = tmp.setIn([0, 'fromType'], type);
            break
        }
        case 'Clear': {
            tmp = initialState;
            newState = tmp.setIn([0, 'fromType'], 'ALL');
            break
        }
        case 'Insert': {
            tmp = immutable.fromJS(action.data);
            newState = tmp.setIn([0, 'fromType'], 'ALL');
            break
        }
        case 'MoveUnit':{
            const {fid, tid} = action;
            const fitem = state.get(fid);
            if (fitem && fid != tid) {
                tmp = state.splice(fid, 1).splice(tid, 0, fitem);
            } else {
                tmp = state;
            }
            newState = tmp.setIn([0, 'fromType'], '');
            break;
        }
        default:
            newState = state;
    }
    // 更新localstorage，便于恢复现场
    localStorage.setItem('config', JSON.stringify(newState.toJS()));

    // 撤销，恢复操作(仅以组件数量变化为触发点，否则存储数据巨大，也没必要)
    let index = parseInt(sessionStorage.getItem('index'));
    let configs = JSON.parse(sessionStorage.getItem('configs'));
    if(action.type == 'Insert' && action.index){
        sessionStorage.setItem('index', index + action.index);
    }else{
        if(newState.toJS().length != state.toJS().length){
            // 组件的数量有变化，删除历史记录index指针状态之后的所有configs，将这次变化的config作为最新的记录
            configs.splice(index + 1, configs.length - index - 1, JSON.stringify(newState.toJS()));
            sessionStorage.setItem('configs', JSON.stringify(configs));
            sessionStorage.setItem('index', configs.length - 1);
        }else{
            // 组件数量没有变化，index不变。但是要更新存储的config配置
            configs.splice(index, 1, JSON.stringify(newState.toJS()));
            sessionStorage.setItem('configs', JSON.stringify(configs));
        }
    }
    
    // console.log(JSON.parse(sessionStorage.getItem('configs')));
    return newState
}

export default reducer;