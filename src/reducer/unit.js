import immutable from 'immutable';

const unitsConfig = immutable.fromJS({
    META: {
        type: 'META',
        name: 'META信息配置',
        title: '',
        keywords: '',
        desc: '',
        bgColor: '#fff'
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
        margin: [0, 0, 24, 0]
    },
    IMAGE: {
        type: 'IMAGE',
        name: '图片',
        address: '',
        url: '',
        bgColor: '#fff',
        padding: [0, 0, 0, 0],
        margin: [0, 30, 24, 30]
    },
    BUTTON: {
        type: 'BUTTON',
        name: '按钮',
        address: '',
        url: '',
        txt: '',
        margin: [
            0, 30, 24, 30
        ],
        appOrder: '',
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
        margin: [0, 30, 24, 30],
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
        bgColor: '#fff',
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
            tmp = state.splice(action.id, 1);
            newState = tmp.setIn([0, 'fromType'], '');
            break
        }
        case 'Clear': {
            tmp = initialState;
            newState = tmp.setIn([0, 'fromType'], '');
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
    // console.table([newState.toJS()[4]]);
    // 更新localstorage，便于恢复现场
    localStorage.setItem('config', JSON.stringify(newState.toJS()));
    return newState
}

export default reducer;
