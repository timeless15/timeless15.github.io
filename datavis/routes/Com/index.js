import React from 'react';
import { connect } from 'dva';
import './index.less';

function Com() {
  return (
    <div className="my-component">我的组件</div>
  );
}

export default connect()(Com);
