import React, { Component } from 'react';
import { DataSet } from '@antv/data-set';
import PlotBase from '../../Components/PlotBase';
import './index.less';

/*eslint-disable*/
class ViewPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: null
    };
    this.countStatistics = this.countStatistics.bind(this);
  }

  componentDidMount() {
    this.countStatistics();
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      this.countStatistics();
    }
  }

  // 创建dataset，根据每个字段的类型进行count统计
  countStatistics() {
    const { fieldDefs, data } = this.props;
    const ds = new DataSet();
    fieldDefs.forEach((fieldDef) => {
      const { field, type } = fieldDef;
      const dv = ds.createView(field).source(data);
      if (type === 'linear') {
        dv.transform({
          type: 'bin.histogram',
          field,             // 对应数轴上的一个点
          binWidth: 10,           // 分箱步长（会覆盖bins选项）
          offset: 0,              // 分箱偏移量
          as: [ field, 'count' ],
        })
      } else if (type === 'cat') {
        dv.transform({
          type: 'aggregate',
          operations: ['count'],
          as: ['count'],
          groupBy: [field]
        });
        dv.transform({
          type: 'pick',
          fields: [field, 'count']
        });
      } else if (type === 'time') {
        
      }
    });
    this.setState({
      ds
    });
  }

  renderPlotBaseList() {
    const { ds } = this.state;
    let plotList;
    if (ds) {
      const { views } = ds;
      plotList = Object.keys(views).map( (key, index) => (
        <PlotBase key={key} id={`plot${index}`} dv={views[key]}></PlotBase>
      ));
    }
    return plotList;
  }

  render() {
    
    return (
      <div className='view-wrap'>
        <h2>Related Views</h2>
        <div className="plot-list">
          {this.renderPlotBaseList()}
        </div>
      </div>
    );
  }
};

export default ViewPane;
