import {
  newOperator,
  searchOperator,
  updateOperator
} from 'services/operator';

export default {
  namespace: 'operator',
  state: {
    id: '',
    name: '',
    data: [],
    fieldDefs: [],
    encoding: {}
  },
  effects: {
    // 新建配置
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
    },

    * saveOperator({ payload }, { call }) {
      yield call(updateOperator, payload);
    }
  },
  reducers: {
    newOperator(state, { payload }) {
      const {
        data, name, id, fieldDefs, encoding
      } = payload;
      return {
        ...state,
        id,
        name,
        data,
        fieldDefs,
        encoding
      };
    },

    saveOperator(state, { payload }) {
      const {
        data, name, id, fieldDefs, encoding
      } = payload;
      return {
        id,
        name,
        data,
        fieldDefs,
        encoding
      };
    },

    saveFieldType(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    resetOperator() {
      return {
        id: '',
        name: '',
        data: [],
        fieldDefs: [],
        encoding: {}
      };
    }
  }
};
