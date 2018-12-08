/*
 * @Author: Shiqi Han
 * @Date: 2018-12-07 14:51:28
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-07 15:24:34
 */

import React, { Component } from 'react';
import EncodingBase from '../../Components/EncodingBase';
import './index.less';

/** props
 * encoding
 * onEncodingChange
 */
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
        shape: null
      }
    };
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
    const { encoding } = this.props;
    const { labels } = this.state;
    const keys = Object.keys(labels);
    keys.forEach((key) => {
      if (encoding[key]) {
        labels[key] = encoding[key];
      } else {
        labels[key] = null;
      }
    });
    this.setState({
      labels
    });
  }

  render() {
    const { onEncodingChange, encoding } = this.props;
    const { labels } = this.state;
    return (
      <div className="encoding-wrap">
        <h2>Encoding</h2>
        <div className="encoding-shelf-group">
          <EncodingBase label="x" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.x} />
          <EncodingBase label="y" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.y} />
        </div>
        <div className="encoding-shelf-group">
          <h3>Mark</h3>
          <EncodingBase label="size" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.size} />
          <EncodingBase label="color" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.color} />
          <EncodingBase label="shape" encoding={encoding} onEncodingChange={onEncodingChange} fieldDef={labels.shape} />
        </div>
      </div>
    );
  }
}

export default EncodingPane;
