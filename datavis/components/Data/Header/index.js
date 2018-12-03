/*
 * @Author: Shiqi Han
 * @Date: 2018-11-25 17:05:34
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-03 09:45:28
 */

import React, { PureComponent } from 'react';
import styles from './index.less';

class DataHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  handleGoBack() {
    const { onBackClick } = this.props;
    onBackClick();
  }

  render() {
    const { name } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.cancel}>
          <span className={styles.btnBack} onClick={this.handleGoBack} onKeyDown={this.handleGoBack} title="返回" />
          <span className={styles.title}>
            {name}
            {'数据编辑'}
          </span>
        </div>
      </div>
    );
  }
}

export default DataHeader;
