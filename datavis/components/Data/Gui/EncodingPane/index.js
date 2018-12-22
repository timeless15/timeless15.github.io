/*
 * @Author: Shiqi Han
 * @Date: 2018-12-07 14:51:28
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-19 17:10:07
 */

import React, { Component } from 'react';
import { Select } from 'antd';
import EncodingBase from '../../Components/EncodingBase';
import './index.less';

/** props
 * encoding
 * onEncodingChange
 */
/* eslint-disable */
const { Option } = Select;

class EncodingPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // labels中各个对象是传到fieldBase中的fieldDef
      labels: {
        x: null,
        y: null,
        size: null,
        color: null,
        shape: null,
        row: null,
        column: null
      }
    };
    this.handleGeomSelect = this.handleGeomSelect.bind(this);
    this.setFieldDef = this.setFieldDef.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setFieldDef();
    }
  }

  /**
   * 根据encoding的变化对state中的label作相应变化
   */
  setFieldDef() {
    const { spec } = this.props;
    const { encoding } = spec;
    const { labels } = this.state;
    const keys = Object.keys(labels);
    keys.forEach((key) => {
      if (encoding && encoding[key]) {
        labels[key] = encoding[key];
      } else {
        labels[key] = null;
      }
    });
    this.setState({
      labels
    });
  }

  handleGeomSelect(value) {
    const { onGeomTypeChange } = this.props;
    onGeomTypeChange(value);
  }

  render() {
    const { onEncodingChange, spec } = this.props;
    const { encoding, geom } = spec;
    const { labels } = this.state;
    return (
      <div className="encoding-wrap">
        <h2>Encoding</h2>
        <div className="encoding-shelf-group">
          <div className="encoding-geom">
            <Select defaultValue={geom || 'auto'} onChange={this.handleGeomSelect}>
              <Option value="auto">auto</Option>
              <Option value="point">point</Option>
              <Option value="line">line</Option>
              <Option value="area">area</Option>
              <Option value="interval">interval</Option>
            </Select>
          </div>
          <h3>Geom</h3>
        </div>
        <div className="encoding-shelf-group">
          <h3>Attr</h3>
          <EncodingBase label="x" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.x} />
          <EncodingBase label="y" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.y} />
          <EncodingBase label="size" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.size} />
          <EncodingBase label="color" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.color} />
          <EncodingBase label="shape" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.shape} />
        </div>

        <div className="encoding-shelf-group">
          <h3>Facet</h3>
          <EncodingBase label="row" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.row} />
          <EncodingBase label="column" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.column} />
        </div>
      </div>
    );
  }
}

export default EncodingPane;
