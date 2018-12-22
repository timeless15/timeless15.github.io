import React, { Component } from 'react';
import { DataSet } from '@antv/data-set';
import _ from 'lodash';
import CONSTANTS from '../../Tools/DataProcess/constants.js';
import PlotBase from '../../Components/PlotBase';
import './index.less';

const { TYPES } = CONSTANTS;

/*eslint-disable*/
class ViewPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new DataSet()
    };
    this.countStatistics = this.countStatistics.bind(this);
    this.generateSpcificView = this.generateSpcificView.bind(this);
    this.generateRelatedView = this.generateRelatedView.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  shouldComponentUpdate(nextProps) {
    // 初始时geom为''，来区分后续和第一次的更新
    // TODO 减少更新
    // if (!_.isEmpty(this.props.spec.geom) && _.isEmpty(nextProps.spec.encoding)) {
    //   return false;
    // }
    return true;
  }

  // 根据每个字段的类型进行count统计
  countStatistics(fieldDef) {
    const { data, schema } = this.props;
    const { ds } = this.state;
    const { field, type } = fieldDef;
    // const expanFieldDef = _.cloneDeep(fieldDef);
    const fieldSchema = schema[field];
    let dv;
    if(!ds.views[field]) {
      dv = ds.createView(field).source(data);
      if (type === TYPES.QUANTITATIVE) {
        const binWidth = Math.round((fieldSchema.stats.max - fieldSchema.stats.min) / 9)
        dv.transform({
          type: 'bin.histogram',
          field,             // 对应数轴上的一个点
          bins: 9, 
          binWidth,           // 分箱步长（会覆盖bins选项）
          offset: 0,              // 分箱偏移量
          as: [ field, 'count' ],
        });
        // expanFieldDef.fn = 'bin';
      } else if (type === TYPES.NOMINAL) {
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
      } else if (type === TYPES.TIME) {
        const { timeStats } = fieldSchema;
        const { unique } = timeStats;
        dv.transform({
          type: 'map',
          callback: function(row) {
            const time = new Date(row[field]);
            row[field] = time[unique.func]();
            return row;
          }
        });
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
        // expanFieldDef.fn = unique.unit;
      }
    } else {
      dv = ds.views[field].source(data);
    }
    return dv;
  }

  generateRelatedView() {
    const { fieldDefs, schema } = this.props;
    let plotList = [];
    fieldDefs.forEach((fieldDef, index) => {
      const dv = this.countStatistics(fieldDef);
      let expanFieldDef = _.cloneDeep(fieldDef);
      const { field, type } = fieldDef;
      if(type === TYPES.TIME) {
        expanFieldDef.type = TYPES.QUANTITATIVE;
        expanFieldDef.fn = `${schema[field].timeStats.unique.unit}`;
      } else if (type === TYPES.QUANTITATIVE) {
        expanFieldDef.fn = 'bin'
      }
      const spec = {
        geom: 'interval',
        encoding: {
          x: expanFieldDef,
          y: {field: 'count', type: TYPES.QUANTITATIVE, fn: 'count'}
        }
      }
      plotList.push(<PlotBase key={fieldDef.field} id={`plot${index}`} dv={dv} spec={spec}></PlotBase>)
    });
    return plotList;
  }

  generateSpcificView() {
    const { data, spec } = this.props;
    const { ds } = this.state;
    let dv;
    if (ds) {
      if (ds.views['specific']) {
        dv = ds.views['specific'].source(data);
      } else {
        dv = ds.createView('specific').source(data);
      }
      // encoding非空时，才生成图表
      if (!_.isEmpty(spec.encoding)) {
        const { encoding } = spec;
        const copySpec = _.cloneDeep(spec);
        // TODO 当x和y都空时，说明字段在其他通道，所以为了画出图，必须要把其他通道的字段给position
        if(_.isUndefined(encoding.x)) {
          copySpec.encoding.x = { field: '*', type: 'identity'}
        }
        if(_.isUndefined(encoding.y)) {
          copySpec.encoding.y = { field: '*', type: 'identity'}
        }
        return (<PlotBase id="plot-specific" dv={dv} spec={copySpec}></PlotBase>)
      }
    }
    return ;
  }

  render() {
    return (
      <div className='view-wrap'>
        <div className='specific-view'>
          <h2>Specific Views</h2>
          <div className="plot-list">
            {this.generateSpcificView()}
          </div>
        </div>
        <div className='realted-view'>
          <h2>Related Views</h2>
          <div className="plot-list">
            {this.generateRelatedView()}
          </div>
        </div>
      </div>
    );
  }
};

export default ViewPane;
