/*
 * @Author: Shiqi Han
 * @Date: 2018-12-01 15:27:19
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-09 21:42:43
 */

import React, { Component } from 'react';
import FieldBase from '../../Components/FieldBase';
import './index.less';

/** props
 * fieldDefs,
 * onfieldTypeChange
 */
class FieldPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      // this.renderFieldsList();
    }
  }

  /**
   * 根据fieldDefs渲染fieldList
   */
  renderFieldsList() {
    const { fieldDefs, onfieldTypeChange } = this.props;
    let fieldsList;
    if (fieldDefs) {
      fieldsList = fieldDefs.map(item => (
        <FieldBase
          fieldDef={item}
          isInEncoding={false}
          draggable
          key={item.field}
          onfieldTypeChange={onfieldTypeChange}
        />));
    }
    return fieldsList;
  }

  render() {
    return (
      <div className="field-wrap">
        <h2>Data</h2>
        <div className="field-section">
          <h3>Fields</h3>
          <div className="field-list">
            {this.renderFieldsList()}
          </div>
        </div>
      </div>
    );
  }
}

export default FieldPane;
