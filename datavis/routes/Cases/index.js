import React from 'react';
import { connect } from 'dva';
import './index.less';

function Cases() {
  return (
    <div className="my-cases">优秀案例和教程</div>
  );
}

export default connect()(Cases);
