/*
 * @Author: Shiqi Han
 * @Date: 2018-11-25 15:14:00
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-02 22:05:55
 */
/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import SplitPane from 'react-split-pane';
import _ from 'lodash';
import {
  DataHeader, FieldPane, ViewPane, EncodingPane
} from 'components/Data';
import './Operator.less';

class Operate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originData: [],
      fields: []
    }
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  componentDidMount() {
    const { match, dispatch, operator } = this.props;
    const { id } = match.params;
    if(!operator.data.length || operator.id !== +id ){
      dispatch({
        type: 'operator/searchOperator',
        payload: id
      });
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.operator !== prevProps.operator) {
      this.setState({
        originData: this.props.operator.data,
        fields: this.props.operator.fields
      });
    }
  }

  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'operator/resetOperator'
    });
  }

  handleGoBack() {
    const { history } = this.props;
    history.push('/data');
  }

  render() {
    const { name, fields } = this.props.operator;
    return (
      <div className="page">
        <DataHeader onBackClick={this.handleGoBack} name={name}/>
        <SplitPane split="vertical" defaultSize={200} minSize={175} maxSize={350}>
          <FieldPane fields={fields} />
          <SplitPane split="vertical" defaultSize={235} minSize={200} maxSize={350}>
            <EncodingPane />
            <ViewPane />
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}

export default connect(({ operator }) => ({ operator }))(Operate);
