/*
 * @Author: Jiangang Lu
 * @Date: 2018-09-19 10:56:36
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-01 15:14:55
 */
import React, { Component } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: require('vendor/iconfont/iconfont.js')
});

class Layer extends Component {
  shouldComponentUpdate(nextProps) {
    const { charts, id } = this.props;
    if (
      nextProps.charts.length === charts.length
      && nextProps.id === id
    ) {
      for (let i = 0; i < nextProps.charts.length; i++) {
        // 判断数组顺序是否一致
        if (
          (nextProps.charts[i].id !== charts[i].id)
          || (nextProps.charts[i].myChart !== charts[i].myChart)
        ) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  /**
   * 设置组件编号
   * @param  {} id 组件编号
   */
  setChartId(id) {
    const { onLayerItemClick } = this.props;
    onLayerItemClick({ id });
  }

  /**
   * 删除组件
   * @param  {} id 组件编号
   */
  handleRemoveChart(id) {
    const { onRemoveChartClick } = this.props;
    onRemoveChartClick(id);
  }

  /**
   * 数组项替换
   * @param  {Array} arr 目标数组
   * @param  {Number} index1 替换前，位置下标
   * @param  {Number} index2 替换后，位置下标
   */
  handleSwapItem(arr, index1, index2) {
    const { dispatch } = this.props;
    const [value1] = arr.splice(index2, 1, arr[index1]);
    arr[index1] = value1;
    dispatch({
      type: 'editor/setChart',
      payload: {
        charts: _.cloneDeep(arr).reverse()
      }
    });
  }

  /**
   * 上移一层
   * @param  {Array} arr 目标数组
   * @param  {Number} index 位置下标
   */
  handleMoveUp(arr, index) {
    if ((arr.length > 1) && (index !== 0)) {
      this.handleSwapItem(arr, index, (index - 1));
    }
  }

  /**
   * 下移一层
   * @param  {Array} arr 目标数组
   * @param  {Number} index 位置下标
   */
  handleMoveDown(arr, index) {
    if ((arr.length > 1) && (index !== (arr.length - 1))) {
      this.handleSwapItem(arr, index, (index + 1));
    }
  }

  /**
   * 置顶
   * @param  {Array} arr 目标数组
   * @param  {Number} index 位置下标
   */
  handleMoveToTop(arr, index) {
    if ((arr.length > 1) && (index !== 0)) {
      this.handleSwapItem(arr, index, 0);
    }
  }

  /**
   * 置底
   * @param  {Array} arr 目标数组
   * @param  {Number} index 位置下标
   */
  handleMoveToBottom(arr, index) {
    if ((arr.length > 1) && (index !== (arr.length - 1))) {
      this.handleSwapItem(arr, index, (arr.length - 1));
    }
  }

  render() {
    const { id, charts } = this.props;
    const disabled = (id === ''); // 是否可编辑
    // console.log('id', id, 'disabled', disabled);
    let newCharts = _.cloneDeep(charts);
    newCharts = newCharts.reverse(); // 第一个为最近添加组件
    const chartIndex = _.findIndex(newCharts, item => item.id === id);

    return (
      <div className="layer">
        <div className="layer-head">图层</div>
        <div className="layer-toolbar-top">
          <a title="置顶" disabled={disabled} onClick={this.handleMoveToTop.bind(this, newCharts, chartIndex)} onKeyDown={this.handleMoveToTop.bind(this, newCharts, chartIndex)}>
            <IconFont type="icon-vertical-align-top" theme="outlined" />
          </a>
          <a title="置底" disabled={disabled} onClick={this.handleMoveToBottom.bind(this, newCharts, chartIndex)} onKeyDown={this.handleMoveToBottom.bind(this, newCharts, chartIndex)}>
            <IconFont type="icon-vertical-align-bottom" theme="outlined" />
          </a>
          <a title="上移一层" disabled={disabled} onClick={this.handleMoveUp.bind(this, newCharts, chartIndex)} onKeyDown={this.handleMoveUp.bind(this, newCharts, chartIndex)}>
            <IconFont type="icon-arrowup" theme="outlined" />
          </a>
          <a title="下移一层" disabled={disabled} onClick={this.handleMoveDown.bind(this, newCharts, chartIndex)} onKeyDown={this.handleMoveDown.bind(this, newCharts, chartIndex)}>
            <IconFont type="icon-arrowdown" theme="outlined" />
          </a>
        </div>
        <div className="layer-body">
          <div className="layer-list scrollbar">
            <ul>
              { newCharts.map(item => (
                <li
                  key={item.id}
                  className={classNames('layer-item', { selected: item.id === id })}
                  onClick={this.setChartId.bind(this, item.id)}
                  onKeyDown={this.setChartId.bind(this, item.id)}
                >
                  {/* <img className="layer-item-thumbail"
                    src="assets/img/screen/layer/layer-item-thumbail.png"/>
                  */}
                  <span className="layer-item-icon" />
                  <div className="layer-item-text">
                    <span className="layer-item-span">{item.alias || '组件'}</span>
                  </div>
                </li>
              )) }
            </ul>
          </div>
        </div>
        <div className="layer-toolbar-bottom">
          {/* <a title="成组" disabled={disabled}>
            <Icon type="to-top" theme="outlined" />
          </a> */}
          <a title="删除" disabled={disabled} onClick={this.handleRemoveChart.bind(this, id)} onKeyDown={this.handleRemoveChart.bind(this, id)}>
            <Icon type="delete" />
          </a>
          {/* <a title="锁定" disabled={disabled}>
            <Icon type="to-top" theme="outlined" />
          </a>
          <a title="隐藏" disabled={disabled}>
            <Icon type="to-top" theme="outlined" />
          </a> */}
        </div>
      </div>
    );
  }
}

export default Layer;
