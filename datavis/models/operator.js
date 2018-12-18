import {
  newOperator,
  searchOperator,
  updateOperator
} from 'services/operator';
import _ from 'lodash';

export default {
  namespace: 'operator',
  state: {
    id: '',
    name: '',
    data: [],
    fieldDefs: [],
    encoding: {},
    schema: {} // 每个字段的统计
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
        data, name, id, fieldDefs, encoding, schema
      } = payload;
      return {
        ...state,
        id,
        name,
        data,
        fieldDefs,
        encoding,
        schema
      };
    },

    saveOperator(state, { payload }) {
      const {
        data, name, id, fieldDefs, encoding, schema
      } = payload;
      return {
        id,
        name,
        data,
        fieldDefs,
        encoding,
        schema
      };
    },

    changeFieldType(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    changeEncoding(state, { payload }) {
      const { label, fieldDef } = payload;
      const { encoding } = state;
      if (_.isEmpty(fieldDef)) {
        delete encoding[label];
      } else {
        encoding[label] = fieldDef;
      }
      return {
        ...state,
        encoding
      };
    },

    resetOperator() {
      return {
        id: '',
        name: '',
        data: [],
        fieldDefs: [],
        encoding: {},
        schema: {}
      };
    }
  }
};
