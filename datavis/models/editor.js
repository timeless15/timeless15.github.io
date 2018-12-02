import {
  newEditor,
  updateEditor,
  searchEditor,
  fetchData
} from 'services/editor';

export default {
  namespace: 'editor',
  state: {
    id: '',
    page: {
      width: '1920px',
      height: '1080px',
      backgroundColor: 'rgba(20, 29, 42, 1)',
      backgroundImage: '',
      gridStep: 10,
      preview: ''
    },
    charts: []
  },
  effects: {
    // 新建页面配置
    * addEditor({ payload }, { call, put }) {
      const { data } = yield call(newEditor, payload);
      yield put({
        type: 'newEditor',
        payload: data
      });
    },
    // 保存页面配置
    * saveEditor({ payload }, { call }) {
      yield call(updateEditor, payload);
    },

    // 根据editor的id找到对应的页面配置
    * searchEditor({ payload }, { call, put }) {
      const { data } = yield call(searchEditor, payload);

      yield put({
        type: 'saveEditorConfig',
        payload: data
      });
    },

    // 根据url获取数据
    * fetchData({ payload }, { call, put }) {
      const { url, chart, attrKey } = payload;
      const { data } = yield call(fetchData, url);
      chart.api[attrKey] = {
        url,
        source: data
      };
      yield put({
        type: 'saveChart',
        payload: chart
      });
    }
  },
  reducers: {

    addChart(state, action) {
      return {
        ...state,
        charts: state.charts.concat(action.payload)
      };
    },

    saveChart(state, { payload }) {
      const charts = state.charts.map((chart) => {
        if (chart.id === payload.id) {
          return { ...chart, ...payload };
        }
        return chart;
      });
      return {
        ...state,
        charts
      };
    },

    setChart(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    newEditor(state, { payload }) {
      const { charts, page, id } = payload;
      return {
        ...state,
        id,
        page,
        charts
      };
    },

    resetEditor() {
      return {
        id: '',
        page: {
          width: '1920px',
          height: '1080px',
          backgroundColor: 'rgba(14, 42, 67, 1)',
          backgroundImage: '',
          gridStep: 10,
          thumbnail: ''
        },
        charts: []
      };
    },

    // 保存charts
    saveEditorConfig(state, { payload }) {
      const { charts, page, id } = payload;
      return {
        id,
        page,
        charts
      };
    },

    // 保存页面配置
    savePage(state, { payload }) {
      const page = Object.assign({}, state.page, { ...payload });
      return {
        ...state,
        page
      };
    }
  }
};
