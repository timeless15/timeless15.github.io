/*
 * @Author: Shiqi Han
 * @Date: 2018-12-15 16:40:45
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-21 15:25:35
 */

/* eslint-disable */
import React, {Component} from 'react';
import G2 from '@antv/g2';
import _ from 'lodash';
import './index.less';

class PlotBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: null
    };
    this.renderChart = this.renderChart.bind(this);
    this.initChart = this.initChart.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps) {
    //TODO 减少不必要的渲染和更细
    // console.log(prevProps.spec.encoding === this.props.spec.encoding);
    this.renderChart();
  }

  initChart() {
    const { id } = this.props;
    let { chart } = this.state;
    if (!chart && id) {
      chart = new G2.Chart({
        id,
        width: 300,
        height: 290
      });
      this.setState({
        chart
      });
    }
    return chart;
  }

  renderChart() {
    const { dv, spec } = this.props;
    const { encoding } = spec;
    let { geom } = spec;
    const chart = this.initChart();
    const { x, y } = encoding;
    let defs = {};
    defs[x.field] = {
      type: x.type,
      alias: this.handleFieldAlias(x)
    }
    defs[y.field] = {
      type: y.type,
      alias: this.handleFieldAlias(y)
    }
    // TODO auto geom
    if ( geom === 'auto' ) {
      geom = 'point';
    }
    chart.clear();
    chart.source(dv, defs);
    const geomObj = chart[geom]();
    geomObj.position(`${x.field}*${y.field}`);
    chart.axis(x.field, {
      title: true
    });
    chart.axis(y.field, {
      title: true
    });
    chart.render();
  }

  handleFieldAlias(fieldDef) {
    const { fn } = fieldDef;
    if (fn === 'count') {
      return 'Number of Records'
    } else if (_.isEmpty(fn)) {
      return fieldDef.field;
    } else {
      return `${fieldDef.field} (${fn})`
    }
  }

  render() {
    const {id} = this.props;
    return (
      <div>
        <div className="plot-list-item" id={id}></div>
      </div>
      
    )
  }
};

export default PlotBase;