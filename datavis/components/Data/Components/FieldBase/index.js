/*
 * @Author: Shiqi Han
 * @Date: 2018-12-07 14:46:33
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-09 21:44:40
 */

import React, { Component } from 'react';
import { Popover, Icon, Radio } from 'antd';
import { DragSource } from 'react-dnd';
import { LetterIcon, NumberIcon } from '../../../../assets/icon';
import './index.less';

/** props
 * fieldDef,
 * isInEncoding,
 * draggable,
 * onfieldTypeChange,
 * onEncodingClose
*/
class FieldBase extends Component {
  constructor(props) {
    super(props);
    this.renderFieldAction = this.renderFieldAction.bind(this);
  }

  getTypeIcon() {
    const { fieldDef } = this.props;
    switch (fieldDef.type) {
      case 'cat':
        return <LetterIcon />;
      case 'time':
        return <Icon type="calendar" />;
      case 'linear':
        return <NumberIcon />;
      default:
        return <NumberIcon />;
    }
  }

  /**
   * 改变当前字段的type
   * @param  {String} selectField 字段名称
   */
  fieldTypeChange(selectField, e) {
    //  fielBase -> FieldPane -> Operator
    const { onfieldTypeChange } = this.props;
    const newType = e.target.value;
    onfieldTypeChange(selectField, newType);
    // TODO change type时无法触发子组件更新，只能用forceUpdate暂时处理
    this.forceUpdate();
  }

  /**
   * 生成每个字段的popover
   * @param  {Object} fieldDef 字段对象
   */
  popContent(fieldDef) {
    return (
      <Radio.Group onChange={this.fieldTypeChange.bind(this, fieldDef.field)} value={fieldDef.type}>
        <Radio value="linear">数值</Radio>
        <Radio value="cat">分类</Radio>
      </Radio.Group>
    );
  }

  renderFieldAction(action) {
    const { fieldDef, isInEncoding, onEncodingClose } = this.props;
    let renderEle;
    switch (action) {
      case 'caret-down':
        if (!isInEncoding) {
          renderEle = (
            <Popover title="TYPE" content={this.popContent(fieldDef)} placement="bottomLeft" trigger="click">
              <Icon type="caret-down" />
            </Popover>
          );
        }
        break;
      case 'filter-add':
        if (!isInEncoding) {
          renderEle = (
            <span>
              <span className="field-filter"><Icon type="filter" /></span>
              <span className="field-add"><Icon type="plus" /></span>
            </span>
          );
        }
        break;
      case 'close':
        if (isInEncoding) {
          renderEle = (
            <span className="field-close" onClick={onEncodingClose} onKeyDown={onEncodingClose}>
              <Icon type="close" />
            </span>
          );
        }
        break;
      default:
    }
    return renderEle;
  }

  render() {
    const { fieldDef, connectDragSource } = this.props;
    return connectDragSource(
      <div className="field-list-item">
        <div>
          <span className="field-pill">
            <span className="field-type">
              {this.renderFieldAction('caret-down')}
              {this.getTypeIcon()}
            </span>
            <span className="field-text">{fieldDef.field}</span>
            {this.renderFieldAction('filter-add')}
            {this.renderFieldAction('close')}
          </span>
        </div>
      </div>
    );
  }
}

const fieldSource = {
  beginDrag(props) {
    return {
      fieldDef: props.fieldDef,
      isInEncoding: props.isInEncoding
    };
  },
  endDrag(props, monitor) {
    const { isInEncoding } = props;
    if (monitor.didDrop() && isInEncoding) {
      props.onEncodingClose();
    }
  },
  canDrag(props) {
    return props.draggable;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

export default DragSource('encoding', fieldSource, collect)(FieldBase);
