/*
 * @Author: ruqichen
 * @Date: 2018-10-30 13:49:54
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-10-30 14:48:59
 * @Description: 控制页面两侧面板伸缩按钮组
 */
import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

function ToggleControlBtn(props) {
  const { isLeftToggleOn, isRightToggleOn, handleToggle } = props;

  return (
    <div className={styles.toggleControl}>
      <span
        className={styles.leftToggleBtn}
        onClick={handleToggle('isLeftToggleOn')}
        onKeyDown={handleToggle('isLeftToggleOn')}
      >
        <Icon
          type={isLeftToggleOn ? 'left-square-o' : 'right-square-o'}
          style={{ position: 'absolute', fontSize: '25px' }}
        />
      </span>
      <span
        className={styles.rightToggleBtn}
        onClick={handleToggle('isRightToggleOn')}
        onKeyDown={handleToggle('isRightToggleOn')}
      >
        <Icon
          type={isRightToggleOn ? 'right-square-o' : 'left-square-o'}
          style={{ position: 'absolute', fontSize: '25px' }}
        />
      </span>
    </div>
  );
}

export default ToggleControlBtn;
