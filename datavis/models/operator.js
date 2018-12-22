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
    spec: {
      geom: '',
      encoding: {}
    },
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
        data, name, id, fieldDefs, spec, schema
      } = payload;
      return {
        ...state,
        id,
        name,
        data,
        fieldDefs,
        spec,
        schema
      };
    },

    saveOperator(state, { payload }) {
      const {
        data, name, id, fieldDefs, spec, schema
      } = payload;
      return {
        id,
        name,
        data,
        fieldDefs,
        spec,
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
      const { spec } = state;
      const { encoding } = spec;
      if (_.isEmpty(fieldDef)) {
        delete encoding[label];
      } else {
        encoding[label] = fieldDef;
      }
      return {
        ...state,
        spec
      };
    },

    changeGeomType(state, { payload }) {
      const { spec } = state;
      spec.geom = payload;
      return {
        ...state,
        spec
      };
    },

    resetOperator() {
      return {
        id: '',
        name: '',
        data: [],
        fieldDefs: [],
        spec: {
          geom: 'auto',
          encoding: {}
        },
        schema: {}
      };
    }
  }
};
