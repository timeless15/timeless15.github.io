/*
 * @Author: Shiqi Han
 * @Date: 2018-12-07 14:48:24
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-07 15:41:50
 */

import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';
import FieldBase from '../FieldBase';
import './index.less';

/** props
 * label,
 * encoding,
 * fieldDef,
 * onEncodingChange
*/
class EncodingBase extends Component {
  constructor(props) {
    super(props);
    this.handleFieldClose = this.handleFieldClose.bind(this);
  }

  /**
   * 处理在encoding中的fieldBase的点击关闭事件
   */
  handleFieldClose() {
    // fielBase -> EncodingBase -> EncodingPane -> Operator
    const { onEncodingChange, label } = this.props;
    onEncodingChange({}, label);
  }

  /**
   * 渲染fieldBase的placeholder
   */
  renderFieldPlaceholder() {
    const { item, isOver } = this.props;
    let style = '';
    if (isOver) {
      style = 'shelf-placeholder-over';
    } else if (item) {
      style = 'shelf-placeholder-active';
    } else {
      style = 'shelf-placeholder';
    }
    return (
      <span className={style}>Drop a field here</span>
    );
  }

  /**
   * 渲染fieldBase
   */
  renderField() {
    const { fieldDef } = this.props;
    return (
      <div className="shelf-fieldWrap">
        <FieldBase
          fieldDef={fieldDef}
          isInEncoding
          draggable
          onEncodingClose={this.handleFieldClose}
        />
      </div>
    );
  }

  render() {
    const { label, connectDropTarget, fieldDef } = this.props;
    return connectDropTarget(
      <div className="encoding-shelf">
        <div className="shelf-label">
          <span>{label}</span>
        </div>
        {fieldDef ? this.renderField() : this.renderFieldPlaceholder()}
      </div>
    );
  }
}

const encodingTarget = {
  drop(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }
    const { fieldDef } = monitor.getItem();
    const { label, onEncodingChange } = props;
    onEncodingChange(fieldDef, label);
  },
  canDrop(props, monitor) {
    const { encoding } = props;
    const { fieldDef, isInEncoding } = monitor.getItem();
    // 不在encoding中的fieldBase，如果已经加入encoding中，就不能再拖拽
    if (!isInEncoding && _.findKey(encoding, fieldDef)) {
      return false;
    }
    return true;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItem()
  };
}

export default DropTarget('encoding', encodingTarget, collect)(EncodingBase);
