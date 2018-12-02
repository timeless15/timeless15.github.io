/*
 * @Author: ruqichen
 * @Date: 2018-10-29 18:08:51
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-11-05 17:21:34
 * @Description: 放大缩小画布组件
 */

import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

function ScaleCanvas(props) {
  const {
    min = 0, max = 1.5, zoom, handleEditorZoomOut, handleEditorZoomIn
  } = props;
  const scale = `${Math.round(zoom * 100)}%`;

  return (
    <div className={styles.sliderWrapper}>
      <Icon type="minus-square" theme="outlined" className={styles.sliderIconMinus} onClick={handleEditorZoomOut(min)} />
      <span className={styles.sliderContent}>{scale}</span>
      <Icon type="plus-square" theme="outlined" className={styles.sliderIconPlus} onClick={handleEditorZoomIn(max)} />
    </div>
  );
}

export default ScaleCanvas;
