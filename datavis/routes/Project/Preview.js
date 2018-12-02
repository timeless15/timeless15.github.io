/*
 * @Author: ruqichen
 * @Date: 2018-08-16 17:28:16
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-11-02 15:44:11
 * @Description: 预览页面
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { searchEditor } from 'src/services/editor.js';
import Generate from 'src/utils/generate.js';
import './Preview.less';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { match, editor } = this.props;
    const { id } = match.params;
    // 如果页面刷新则重新获取charts
    if (!editor.charts.length) {
      searchEditor(id)
        .then((resp) => {
          const { data } = resp;
          this.setState({ loading: false });
          Generate({ charts: data.charts, page: data.page });
        });
    } else {
      Generate({ charts: editor.charts, page: editor.page });
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="preview-wrapper">
        <Spin tip="大屏生成中..." spinning={loading}>
          <div className="preview-container" />
        </Spin>
      </div>
    );
  }
}

export default connect(({ editor }) => ({
  editor
}))(Preview);
