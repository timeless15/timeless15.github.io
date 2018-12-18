/*
 * @Author: Shiqi Han
 * @Date: 2018-12-15 16:40:45
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-18 16:13:31
 */

/* eslint-disable */
import React, {Component} from 'react';
import G2 from '@antv/g2';
import './index.less';

class PlotBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: null
    };
    this.renderChart = this.renderChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      this.updateChart();
    }
  }

  // 初始化chart
  // TODO width和height的计算
  renderChart() {
    const { id, dv, field } = this.props;
    const chart = new G2.Chart({
      id,
      width: 300,
      height: 290
    });
    const posArr = Object.keys(dv.rows[0]); // [field, 'count']
    const margin = 1 / dv.rows.length;
    chart.source(dv, {
      range: [margin / 4, 1 - margin / 4]
    });
    chart.interval().position(posArr);
    chart.scale('count', {
      alias: 'Number of Records'
    });
    chart.axis(field, {
      title: true
    });
    chart.axis('count', {
      title: true
    });
    chart.render();
    this.setState({
      chart
    });
  }
  
  // 数据源更新时，更新chart
  updateChart() {
    const { chart } = this.state;
    const { dv } = this.props;
    chart.source(dv);
    chart.repaint();
  }

  render() {
    const {id} = this.props;
    return (
      <div className="plot-list-item" id={id}></div>
    )
  }
};

export default PlotBase;