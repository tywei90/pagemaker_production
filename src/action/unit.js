import Store from '../store';

const dispatch = Store.dispatch;

const actions = {
    addUnit: (name) => dispatch({ type: 'AddUnit', name }),
    copyUnit: (id) => dispatch({ type: 'CopyUnit', id }),
    editUnit: (id, prop, value) => dispatch({ type: 'EditUnit', id, prop, value }),
    removeUnit: (id) => dispatch({ type: 'RemoveUnit', id }),
    clear: () => dispatch({ type: 'Clear'}),
    insert: (data) => dispatch({ type: 'Insert', data}),
    moveUnit: (fid, tid) => dispatch({ type: 'MoveUnit', fid, tid }),
};

export default actions;
