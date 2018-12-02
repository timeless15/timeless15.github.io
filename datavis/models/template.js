import {
  queryTemplate,
  newTemplate,
  removeTemplate
} from 'services/template';

export default {
  namespace: 'template',
  state: {
    list: []
  },
  effects: {

    // 获取模板列表
    * fetchList(_, { call, put }) {
      const { data } = yield call(queryTemplate);
      yield put({
        type: 'saveList',
        payload: Array.isArray(data) ? data : []
      });
    },

    // 新增模板
    * addTemplate({ payload }, { call, put }) {
      const { data } = yield call(newTemplate, payload);
      yield put({
        type: 'newTemplate',
        payload: data
      });
    },

    // 根据id删除模板
    * removeTemplate({ payload }, { call, put }) {
      yield call(removeTemplate, payload);
      yield put({
        type: 'delTemplate',
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

    newTemplate(state, { payload }) {
      return {
        ...state,
        list: state.list.concat(payload)
      };
    },

    delTemplate(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload)
      };
    }
  }
};
