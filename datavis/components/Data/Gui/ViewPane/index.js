import React, { Component } from 'react';
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import './index.less';

/*eslint-disable*/
class ViewPane extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      // this.renderChart();
    }
  }

  renderChart() {
    console.log(this.props.data);
    const dv = new View();
    dv.source(this.props.data);
    const chart = new G2.Chart({
      id: 'mountNode',
      width: 600,
      height: 400
    });
    chart.source(dv);
    chart.line().position('date*price').label;
    chart.render();
  }

  render() {
    return (
      <div className='view-wrap'>
        <div id='mountNode'></div>
      </div>
    );
  }
};

export default ViewPane;
