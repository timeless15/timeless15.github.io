/*
 * @Author: Shiqi Han
 * @Date: 2018-11-25 15:14:00
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-15 16:00:15
 */
/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import SplitPane from 'react-split-pane';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {
  DataHeader, FieldPane, ViewPane, EncodingPane
} from 'components/Data';
import './Operator.less';

class Operate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originData: [],
      fieldDefs: []
    }
    this.handleGoBack = this.handleGoBack.bind(this);
    this.handlefieldTypeChange = this.handlefieldTypeChange.bind(this);
    this.handleEncodingChange = this.handleEncodingChange.bind(this);
  }

  componentDidMount() {
    const { match, dispatch, operator } = this.props;
    const { id } = match.params;
    if (!operator.data.length || operator.id !== +id ) {
      dispatch({
        type: 'operator/searchOperator',
        payload: id
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'operator/resetOperator'
    });
  }

  handleGoBack() {
    const { history } = this.props;
    history.push('/data');
  }

  /**
   * 处理字段type变化
   * @param {String} selectField 字段名称,
   * @param {String} newType 新的类型
   */
  handlefieldTypeChange(selectField, newType) {
    const { dispatch, operator } = this.props;
    const { fieldDefs } = operator;
    fieldDefs.forEach((f) => {
      if (f.field === selectField) {
        f.type = newType;
      }
    });
    dispatch({
      type: 'operator/changeFieldType',
      payload: {
        fieldDefs
      }
    });
  }

  /**
   * 处理encoding变化
   * @param {Object} fieldDef 字段, 可为空
   * @param {String} label encoding的label
   */
  handleEncodingChange(fieldDef, label) {
    const { dispatch } = this.props;
    dispatch({
      type: 'operator/changeEncoding',
      payload: {
        label,
        fieldDef
      }
    });
  }

  render() {
    const { operator } = this.props;
    const {
      name, fieldDefs, encoding, data
    } = operator;
    return (
      <div className="page">
        <DataHeader onBackClick={this.handleGoBack} name={name} />
        <SplitPane split="vertical" defaultSize={200} minSize={175} maxSize={350}>
          <FieldPane fieldDefs={fieldDefs} onfieldTypeChange={this.handlefieldTypeChange} />
          <SplitPane split="vertical" defaultSize={235} minSize={200} maxSize={350}>
            <EncodingPane encoding={encoding} onEncodingChange={this.handleEncodingChange} />
            <ViewPane data={data} fieldDefs={fieldDefs} encoding={encoding} />
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}

export default connect(({ operator }) => ({ operator }))(DragDropContext(HTML5Backend)(Operate));
