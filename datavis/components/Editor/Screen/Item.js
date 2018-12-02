/*
 * @Author: Jiangang Lu
 * @Date: 2018-10-31 16:43:18
 * @Last Modified by: Jiangang Lu
 * @Last Modified time: 2018-11-01 09:54:20
 */
import React, { Component } from 'react';
import utils from 'utils/utils';

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.myChart = null;
  }

  componentDidMount() {
    const { item, cb } = this.props;
    let data = {};
    let dataFields = {};

    // 指定图表的配置项和数据，此处为柱状图配置
    const options = utils.convertOption(true, {}, item.chartConfig);
    // 根据数据源自定义字段属性转换数据
    data = this.initData(item.apis);
    dataFields = Object.keys(data);
    data = (dataFields.length > 1) ? data : data[dataFields[0]];
    // 基于准备好的容器，初始化vcharts实例
    const Base = require(`brickComponents/${item.requirePath}/index.js`);
    const Chart = Base.default;
    this.myChart = new Chart(item.id, options);

    // 使用刚指定的配置项和数据显示图表。
    this.myChart.render(data);
    cb(item.id, this.myChart);
  }

  componentWillUnmount() {
    if (this.myChart.destroy) {
      this.myChart.destroy();
    }
  }

  initData(apis, data = {}) {
    const { item } = this.props;
    Object.keys(apis).forEach((name) => {
      data[name] = utils.convertData(apis[name].fields, item.apiData[name]);
      if (apis[name].children) {
        return this.initData(apis[name].children, data);
      }
    });

    return data;
  }

  render() {
    const { item } = this.props;

    return (
      <div id={item.id} style={{ width: item.styles.width, height: item.styles.height, overflow: 'hidden' }} />
    );
  }
}
