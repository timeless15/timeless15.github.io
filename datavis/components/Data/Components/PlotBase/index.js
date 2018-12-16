/*
 * @Author: Shiqi Han
 * @Date: 2018-12-15 16:40:45
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-15 20:48:47
 */

/* eslint-disable */
import React, {Component} from 'react';
import G2 from '@antv/g2';
import './index.less';

class PlotBase extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    const { id, dv } = this.props;
    const posArr = Object.keys(dv.rows[0]);
    const chart = new G2.Chart({
      id,
      width: 300,
      height: 290
    });
    chart.source(dv);
    chart.interval().position(posArr);
    chart.render();
  }

  render() {
    const {id} = this.props;
    return (
      <div className="plot-list-item" id={id}></div>
    )
  }
};

export default PlotBase;