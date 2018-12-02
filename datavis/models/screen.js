import {
  queryScreen,
  newScreen,
  removeScreen,
  updateScreen
} from 'services/screen';

import { removeEditor } from 'services/editor';

export default {
  namespace: 'screen',
  state: {
    list: []
  },

  effects: {

    * fetchList(_, { call, put }) {
      const { data } = yield call(queryScreen);
      yield put({
        type: 'saveList',
        payload: Array.isArray(data) ? data : []
      });
    },

    * addScreen({ payload }, { call, put }) {
      const { data } = yield call(newScreen, payload);
      yield put({
        type: 'newScreen',
        payload: data
      });
    },

    * removeScreen({ payload }, { call, put }) {
      yield call(removeScreen, payload);
      yield call(removeEditor, payload);
      yield put({
        type: 'delScreen',
        payload
      });
    },

    * editScreen({ payload }, { call, put }) {
      yield call(updateScreen, payload);
      yield put({
        type: 'updateList',
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

    newScreen(state, { payload }) {
      return {
        ...state,
        list: state.list.concat(payload)
      };
    },

    delScreen(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload)
      };
    },

    updateList(state, { payload }) {
      return {
        ...state,
        list: state.list.map((item) => {
          const temp = item;
          if (temp.id === payload.id) {
            temp.name = payload.name;
          }
          return temp;
        })
      };
    }
  }
};
