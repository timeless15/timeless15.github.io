import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form, Modal, message, Spin
} from 'antd';
import {
  Menu, HeaderOthers, Layer, Screen, PageConfig, Gui, ScaleCanvas, ToggleControlBtn
} from 'components/Editor';
import _ from 'lodash';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import utils from 'src/utils/utils.js';
import ReactRuler from 'mb-sketch-ruler';
import Canvas2Image from 'src/vendor/canvas2image.js';
import classNames from 'classnames';
import styles from './Editor.less';

const { confirm } = Modal;

const rulerActive = true;
const thick = 16; // ruler width

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      pos: { left: 0, top: 0 },
      isLeftToggleOn: true,
      isRightToggleOn: true,
      zoom: 1,
      loading: true,
      startX: -44,
      startY: -44,
      lines: {
        h: [100, 200],
        v: [100, 200]
      }
    };

    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleScreenClick = this.handleScreenClick.bind(this);
    this.handleAddChartClick = this.handleAddChartClick.bind(this);
    this.handleAddChartEntry = this.handleAddChartEntry.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.setEditorState = this.setEditorState.bind(this);
    this.handleCloneChartClick = this.handleCloneChartClick.bind(this);
    this.handleRemoveChartClick = this.handleRemoveChartClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handlePageConfigUpdate = this.handlePageConfigUpdate.bind(this);
    this.handleConfigUpdate = this.handleConfigUpdate.bind(this);
    this.handleEditorZoomIn = this.handleEditorZoomIn.bind(this);
    this.handleEditorZoomOut = this.handleEditorZoomOut.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleLine = this.handleLine.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const { match, dispatch, editor } = this.props;
    const { id } = match.params; // 当前页面配置id
    // 判断charts是否
    if (!editor.charts.length || editor.id !== +id) {
      dispatch({
        type: 'editor/searchEditor',
        payload: id
      }).then(() => {
        this.setState({ loading: false });
      });
    }

    // window.addEventListener('keydown', this.handleKeyBoardDirection);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/resetEditor'
    });
    window.removeEventListener('keydown', this.handleKeyBoardDirection);
  }

  /**
   * 设置当前选择中组件
   * @param  {String} id 组件编号
   */
  setEditorState(state) {
    this.setState({ ...state });
  }

  handleLine(lines) {
    this.setState({ lines });
  }

  handleScroll() {
    const screensRect = document.querySelector('#screen').getBoundingClientRect();
    const canvasRect = document.querySelector('#editor').getBoundingClientRect();
    console.log(screensRect);

    // 标尺开始的刻度
    const { zoom } = this.state;
    const startX = (screensRect.left + thick - canvasRect.left) / zoom;
    const startY = (screensRect.top + thick - canvasRect.top) / zoom;
    this.setState({ startX, startY });
  }

  /**
   * 放大画布
   * @param max {Number} 最大阈值
   */
  handleEditorZoomIn(max) {
    return () => {
      const { zoom } = this.state;
      if (zoom >= max) return;
      this.setState(prevState => ({
        zoom: prevState.zoom + 0.1
      }));
      // const zoomIn = new Promise((resolve, reject) => {
      //   const { zoom } = this.state;
      //   if (zoom >= max) reject();
      //   this.setState(prevState => ({
      //     zoom: prevState.zoom + 0.1
      //   }));
      //   resolve();
      // });
      // zoomIn.then(() => {
      //   debugger;
      //   this.handleScroll();
      // }, (error) => {
      //   console.log(error);
      // });
    };
  }

  /**
   * 缩小画布
   * @param min {Number} 最小阈值
   */
  handleEditorZoomOut(min) {
    return () => {
      const { zoom } = this.state;
      if (zoom <= min) return;
      this.setState(prevState => ({
        zoom: prevState.zoom - 0.1
      }));
    };
  }

  /**
   * 初始化数据属性
   * @param  {Object} apis 数据属性配置
   * @param  {Object} api api接口数据值
   */
  initApi(apis = {}, api = {}) {
    let apiField = null;
    const newApi = api;

    Object.keys(apis).forEach((item) => {
      const apiItem = apis[item];
      apiField = apiItem;
      if (!Object.prototype.hasOwnProperty.call(apiField, 'type')) {
        apiField.type = 'apiData';
      }
      newApi[item] = {
        url: '',
        source: []
      };

      if (apiField.children) {
        return this.initApi(apiField.children, newApi);
      }
    });
    return newApi;
  }

  handleAddChartClick(chartType, requirePath) {
    const { dispatch, editor } = this.props;
    const { datavis } = require(`brickComponents/${requirePath}/package.json`);
    const id = `${chartType}-${new Date().getTime()}`;
    const newDatavis = _.cloneDeep(datavis);
    const api = this.initApi(newDatavis.apis);
    const pageWidth = window.parseInt(editor.page.width, 10) / 2;
    const pageHeight = window.parseInt(editor.page.height, 10) / 2;
    const chartConfig = {
      id,
      requirePath,
      alias: '',
      myChart: '',
      chartConfig: {},
      apis: {
        source: {
          type: 'apiData',
          fields: {}
        }
      },
      styles: {
        width: '400px',
        height: '300px',
        top: '0px',
        left: '0px'
      },
      apiData: {
        source: []
      },
      api,
      ...newDatavis
    };
    chartConfig.styles.left = pageWidth - window.parseInt(chartConfig.styles.width, 10) / 2;
    chartConfig.styles.top = pageHeight - window.parseInt(chartConfig.styles.height, 10) / 2;

    dispatch({
      type: 'editor/addChart',
      // 初始化配置
      payload: [chartConfig]
    });
  }

  handleAddChartEntry(id, myChart) {
    const { dispatch, editor } = this.props;
    const { charts } = editor;
    const target = charts.filter(item => item.id === id)[0];
    if (target) {
      dispatch({
        type: 'editor/saveChart',
        payload: {
          ...target,
          id,
          myChart
        }
      });
    }
  }

  handleKeyBoardDirection(e) {
    const { keyCode } = e;
    if (this.rnd) {
      const { dragGrid } = this.rnd.props;
      const { pos, id } = this.state;
      let { left, top } = pos;
      const [lambX, lambY] = dragGrid;
      if (keyCode === 37) {
        // 按了←键
        e.preventDefault();
        left -= lambX;
      } else if (keyCode === 38) {
        // 按了↑键
        e.preventDefault();
        top -= lambY;
      } else if (keyCode === 39) {
        // 按了→键
        e.preventDefault();
        left += lambX;
      } else if (keyCode === 40) {
        // 按了↓键
        e.preventDefault();
        top += lambY;
      }
      this.setState({
        pos: { left, top }
      });
      this.handleRndResize(id, { left: `${left}px`, top: `${top}px` });
    }
  }

  // 初始化数据
  initData(chart, apis = chart.apis, data = {}) {
    let tmpData = null;
    let dataType = null;

    Object.keys(apis).forEach((name) => {
      dataType = apis[name].type;
      if (dataType === 'apiData') {
        tmpData = chart[dataType][name];
      } else if (dataType === 'api') {
        tmpData = chart[dataType][name].source;
      }

      data[name] = utils.convertData(apis[name].fields, tmpData);
      if (apis[name].children) {
        return this.initData(chart, apis[name].children, data);
      }
    });

    return data;
  }

  // 更新组件
  handleChartUpdate(chart) {
    const { dispatch } = this.props;
    let dataFields = {};
    let data = this.initData(chart);
    dataFields = Object.keys(data);
    data = (dataFields.length > 1) ? data : data[dataFields[0]];
    // console.log('handleChartUpdate data', data);
    chart.myChart.render(data, utils.convertOption(true, {}, chart.chartConfig));

    if (typeof chart.myChart.resize === 'function') {
      chart.myChart.resize(chart.styles);
    }
    dispatch({
      type: 'editor/saveChart',
      payload: chart
    });
  }

  /**
   * 更新图表配置
   * @param {string} strKey 属性键名
   * @param {(string|number|boolean)} value 属性键值
   * @param {(string|number)} unit 值单位 '', px, %
   */
  async handleConfigUpdate(strKey, value, unit = '') {
    const { dispatch, editor } = this.props;
    const { charts } = editor;
    const { id } = this.state;
    let attrKey = null; // 数据字段
    // let data = {}; // 数据
    // let tmpData = null; // 转换前的数据
    let newValue = value;
    // console.log('handleConfigUpdate', strKey, value, unit);
    if (unit) {
      newValue += unit;
    }

    if (strKey.indexOf('styles') > -1) {
      const { pos } = this.state;
      if (strKey === 'styles.top') {
        this.setState({
          pos: Object.assign({}, { ...pos }, { top: newValue })
        });
      } else if (strKey === 'styles.left') {
        this.setState({
          pos: Object.assign({}, { ...pos }, { left: newValue })
        });
      }
    }

    const target = charts.filter(item => item.id === id)[0];
    if (target) {
      if (strKey.includes('api.')) {
        [, attrKey] = strKey.split('.');
        return dispatch({
          type: 'editor/fetchData',
          payload: {
            url: newValue,
            chart: target,
            attrKey
          }
        }).then(() => {
          if (!target.api[attrKey].source) {
            message.error(`${target.alias}接口: 无法连接到你的服务器`);
            return false;
          }
          utils.setValueByStrkey(target, strKey, newValue);
          this.handleChartUpdate(target);
        });
      }
      utils.setValueByStrkey(target, strKey, newValue);
      this.handleChartUpdate(target);
    }
  }

  /**
   * 更新页面配置
   * @param {string} strKey 属性键名
   * @param {(string|number|boolean)} value 属性键值
   */
  handlePageConfigUpdate(strKey, value) {
    const { dispatch } = this.props;
    if (strKey === 'width' || strKey === 'height') {
      value += 'px';
    }
    if (strKey === 'thumbnail') {
      this.handleScreenShot();
    } else if (strKey === 'reset') {
      dispatch({
        type: 'editor/savePage',
        payload: {
          backgroundColor: 'rgba(14, 42, 67, 1)',
          backgroundImage: ''
        }
      });
    } else {
      dispatch({
        type: 'editor/savePage',
        payload: {
          [strKey]: value
        }
      });
    }
  }

  /** 截屏 */
  handleScreenShot() {
    const { dispatch } = this.props;
    const editor = document.querySelector('#editor');
    const options = {
      logging: false,
      backgroundColor: null
    };
    let base64 = '';
    html2canvas(editor, options).then((canvas) => {
      base64 = Canvas2Image.convertToPNG(canvas, 440, 270);
      dispatch({
        type: 'editor/savePage',
        payload: {
          thumbnail: base64
        }
      });
    });
  }

  handleResize(id, originStyles) {
    const { editor } = this.props;
    const { charts } = editor;
    // let tmpData = null;
    // const data = (item.apiData && item.apiData.source) ? item.apiData.source : [];
    // console.log('handleConfigUpdate', charts);
    const target = charts.filter(item => item.id === id)[0];
    // let data = {};
    if (target) {
      target.styles = Object.assign({}, { ...target.styles }, { ...originStyles });
      this.handleChartUpdate(target);
    }
  }

  /**
   * 复制组件
   * @param  {String} id 组件编号
   */
  handleCloneChartClick(id) {
    const { dispatch, editor } = this.props;
    const { charts } = editor;

    const target = charts.filter(item => item.id === id)[0];

    const newId = `${id.split('-')[0]}-${new Date().getTime()}`;
    const top = `${window.parseFloat(target.styles.top, 10) + 10}px`;
    const left = `${window.parseFloat(target.styles.left, 10) + 10}px`;

    dispatch({
      type: 'editor/addChart',
      payload: [{
        ..._.cloneDeep(target),
        id: newId,
        myChart: '',
        styles: {
          ...target.styles,
          top,
          left
        }
      }]
    });
  }

  /**
   * 删除组件
   * @param  {String} id 组件编号
   */
  handleRemoveChartClick(id) {
    const self = this;
    const { dispatch, editor } = this.props;
    const { charts } = editor;
    const newCharts = charts.filter(item => item.id !== id);

    confirm({
      title: '是否删除选中的1个组件',
      onOk() {
        dispatch({
          type: 'editor/setChart',
          payload: {
            charts: newCharts
          }
        });
        self.setState({ id: '' });
      },
      okText: '确定',
      onCancel() {
      },
      cancelText: '取消'
    });
  }

  /** 预览 */
  handlePreview() {
    const { match, history } = this.props;
    const { id } = match.params; // 页面id
    this.handleSave().then(() => {
      history.push(`/screen/preview/${id}`);
    });
  }

  /* 以下是控制台操作方法 */

  /** 返回上一页 */
  handleGoBack() {
    const { history } = this.props;
    history.push('/screen');
  }

  /** 点击当前选中图表以外的区域，取消选中状态 */
  handleScreenClick() {
    this.setState({ id: '' });
  }

  /** 左右两侧面板显示隐藏 */
  handleToggle(name) {
    return () => {
      this.setState(prevState => ({
        [name]: !prevState[name]
      }));
    };
  }

  /** 下载 */
  handleDownload() {
    const { editor } = this.props;

    const charts = editor.charts.map((item) => {
      const chartConfig = utils.convertOption(true, {}, item.chartConfig);
      const innerItem = _.cloneDeep(item);
      delete innerItem.myChart;
      return {
        ...innerItem,
        chartConfig
      };
    });
    // 下载的JSON配置文件内容
    let dataJSON = { id: editor.id, page: editor.page, charts };

    dataJSON = JSON.stringify(dataJSON, null, 2);
    const config = new Blob([dataJSON], { type: 'application/json' });
    const zip = new JSZip();
    zip.file('config.json', config);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      FileSaver.saveAs(content, `chart-${new Date().getTime()}.zip`);
    });
  }

  /** 保存 */
  async handleSave() {
    const { dispatch, editor, match } = this.props;
    const { id } = match.params; // 页面id
    const { page } = editor;
    let charts = _.cloneDeep(editor.charts);
    charts = charts.map((item) => {
      delete item.myChart;
      return item;
    });
    return dispatch({
      type: 'editor/saveEditor',
      payload: {
        id,
        page,
        charts
      }
    }).then(() => {
      message.success('保存成功');
    });
  }

  /**
   * 根据是否有组件编号渲染页面配置或组件配置
   * @param  {} id 组件编号
   */
  renderGui(id) {
    const { editor } = this.props;
    const { charts, page } = editor;
    const newCharts = charts.map(item => ({ ...item }));
    const target = newCharts.filter(item => item.id === id)[0];
    if (target) {
      return <Gui options={target} onConfigChange={this.handleConfigUpdate} />;
    }
    return <PageConfig options={page} onPageConfigChange={this.handlePageConfigUpdate} />;
  }

  render() {
    const { loading } = this.state;
    const { editor, dispatch } = this.props;
    const { charts, page } = editor;
    const {
      id,
      pos,
      zoom,
      isLeftToggleOn,
      isRightToggleOn,
      startX,
      startY,
      lines
    } = this.state;
    const { h, v } = lines;

    const mainLeftStyle = {
      transform: isLeftToggleOn ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)',
      width: isLeftToggleOn ? '208px' : '0'
    };
    const mainRightStyle = {
      transform: isRightToggleOn ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
      width: isRightToggleOn ? '355px' : '0'
    };
    const zoomSize = `${zoom * 100}%`;

    return (
      <Spin tip="大屏生成中..." spinning={loading}>
        <div className={styles.page}>
          <div className={styles.header}>
            <div className={styles.cancle}>
              <span className={styles.backBtn} onClick={this.handleGoBack} onKeyDown={this.handleGoBack} title="返回" />
              <span className={styles.title} />
            </div>
            <Menu onMenuItemClick={this.handleAddChartClick} />
            <HeaderOthers
              onSaveClick={this.handleSave}
              onPreviewClick={this.handlePreview}
              onDownloadClick={this.handleDownload}
            />
          </div>
          <div className={styles.main}>
            <div className={classNames('scrollbar', styles.mainLeft)} style={mainLeftStyle}>
              <Layer
                id={id}
                charts={charts}
                dispatch={dispatch}
                onLayerItemClick={this.setEditorState}
                onRemoveChartClick={this.handleRemoveChartClick}
              />
            </div>
            <div
              className={classNames(styles.mainCenter)}
              onClick={this.handleScreenClick}
              onKeyDown={this.handleScreenClick}
            >
              <ReactRuler
                scale={zoom}
                startX={startX}
                startY={startY}
                width={1342}
                height={948}
                horLineArr={h}
                verLineArr={v}
                cornerActive={rulerActive}
                palette={{
                  bgColor: 'rgba(37, 51, 60, 0.8)',
                  fgColor: '#496779',
                  fontColor: '#7a9baf',
                  lineColor: '#9db5c4',
                  borderColor: '#5a7f95',
                  cornerActiveColor: '#5a7f95'
                }}
                handleLine={this.handleLine}
              />
              <div className={classNames('scrollbar', styles.mainCenterCanvas)} id="screen" onScroll={this.handleScroll}>
                <div
                  className="editorContanier"
                  style={{
                    width: `${parseInt(page.width, 10) + 120}px`,
                    height: `${parseInt(page.height, 10) + 120}px`,
                    zoom: zoomSize
                  }}
                >
                  <Screen
                    id={id}
                    pos={pos}
                    editor={editor}
                    setEditorState={this.setEditorState}
                    onAddChartEntry={this.handleAddChartEntry}
                    onCloneChartClick={this.handleCloneChartClick}
                    onRemoveChartClick={this.handleRemoveChartClick}
                    onResize={this.handleResize}
                  />
                </div>
              </div>
              <div className={styles.mainCenterBottom}>
                <ScaleCanvas
                  min={0.1}
                  max={2}
                  zoom={zoom}
                  handleEditorZoomIn={this.handleEditorZoomIn}
                  handleEditorZoomOut={this.handleEditorZoomOut}
                />
              </div>
            </div>
            <div className={classNames('scrollbar', styles.mainRight)} style={mainRightStyle}>
              { this.renderGui(id) }
            </div>
            <ToggleControlBtn
              isLeftToggleOn={isLeftToggleOn}
              isRightToggleOn={isRightToggleOn}
              handleToggle={this.handleToggle}
            />
          </div>
        </div>
      </Spin>
    );
  }
}

export default connect(({ editor }) => ({
  editor
}))(Form.create()(Editor));
