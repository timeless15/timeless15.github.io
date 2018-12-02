/*eslint-disable*/
import {
  newOperator,
  searchOperator
} from 'services/operator';

export default {
  namespace: 'operator',
  state: {
    id: '',
    name: '',
    data: [],
    fields: []
  },
  effects: {
    // 新建页面配置
    * addOperator({ payload }, { call, put }) {
      const { data } = yield call(newOperator, payload);
      yield put({
        type: 'newOperator',
        payload: data
      });
    },

    * searchOperator({ payload }, { call, put }) {
      const { data } = yield call(searchOperator, payload);
      yield put({
        type: 'saveOperator',
        payload: data
      });
    }

  },
  reducers: {
    newOperator(state, { payload }) {
      const { data, name, id, fields } = payload;
      return {
        ...state,
        id,
        name,
        data,
        fields
      };
    },

    saveOperator(state, { payload }) {
      const { data, name, id, fields } = payload;
      return {
        id,
        name,
        data,
        fields
      };
    },

    resetOperator() {
      return {
        id: '',
        name: '',
        data: [],
        fields: []
      };
    }
  }
};
