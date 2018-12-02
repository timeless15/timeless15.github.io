import {
  queryData,
  uploadData,
  deleteData
} from 'services/data';

export default {
  namespace: 'data',
  state: {
    list: []
  },
  effects: {
    * fetchList(_, { call, put }) {
      const { data } = yield call(queryData);
      yield put({
        type: 'saveList',
        payload: Array.isArray(data) ? data : []
      });
    },

    * addData({ payload }, { call, put }) {
      const { data } = yield call(uploadData, payload);
      yield put({
        type: 'newData',
        payload: data
      });
    },

    * removeData({ payload }, { call, put }) {
      yield call(deleteData, payload);
      yield put({
        type: 'delData',
        payload
      });
    }
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload
      };
    },

    newData(state, { payload }) {
      return {
        ...state,
        list: state.list.concat(payload)
      };
    },

    delData(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload)
      };
    }
  }
};
