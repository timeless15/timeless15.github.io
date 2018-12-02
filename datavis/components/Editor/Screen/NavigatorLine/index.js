import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';

class NavigatorLine extends PureComponent {
  render() {
    const { pos, show } = this.props;
    return (
      <div className={classNames({ show }, styles.navigatorLine)}>
        <div className={styles.navigatorLineLeft} style={{ width: (pos.left + 60) }} />
        <div className={styles.navigatorLineTop} style={{ height: (pos.top + 60) }} />
        <div className={styles.navigatorLineCount}>
          <span>{pos.left}</span>
          <span>, </span>
          <span>{pos.top}</span>
        </div>
      </div>
    );
  }
}

export default NavigatorLine;
