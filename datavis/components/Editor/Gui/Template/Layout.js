/*
 * @Author: ruqichen
 * @Date: 2018-08-10 15:16:18
 * @Last Modified by: Jiangang Lu
 * @Last Modified time: 2018-10-24 17:04:04
 * @Description: 图表布局组件
 */
import React, { PureComponent } from 'react';
import { Form, InputNumber } from 'antd';
import utils from 'utils/utils';
import styles from './template.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 16 }
  }
};

class Layout extends PureComponent {
  // /**
  //  * 更新图表配置
  //  * @param {string} strKey 属性键名
  //  * @param {(string|number)} unit 值单位 '', px, %
  //  * @param {(string|number|boolean)} value 属性键值
  //  */
  // handleConfigChange(strKey, unit = 'px', value) {
  //   this.props.onConfigChange(strKey, value, unit);
  // }

  /**
   * 更新图表配置
   * @param {string} strKey 属性键名
   * @param {(string|number)} unit 值单位 '', px, %
   * @param {(string|number|boolean)} value 属性键值
   */
  handleConfigChange(strKey, unit = '', value) {
    const { onConfigChange } = this.props;
    onConfigChange(strKey, value, unit);
  }

  render() {
    const {
      width,
      height,
      minWidth,
      minHeight,
      top,
      left
    } = this.props;
    const newWidth = utils.stringToNumber(width);
    const newHeight = utils.stringToNumber(height);
    const newTop = utils.stringToNumber(top);
    const newLeft = utils.stringToNumber(left);

    return (
      <div className={styles.guiGroupContainer}>
        <div className={styles.guiGroupController}>
          <FormItem
            {...formItemLayout}
            label="图表尺寸"
          >
            <div className={styles.guiController}>
              <div className={styles.guiNumbersSingle}>
                <InputNumber
                  min={minWidth || 300}
                  value={newWidth.value}
                  onChange={this.handleConfigChange.bind(this, 'styles.width', newWidth.unit || 'px')}
                />
                <div className={styles.guiNumbersSingleName}>宽度</div>
              </div>
              <div className={styles.guiNumbersSingle}>
                <InputNumber
                  min={minHeight || 190}
                  value={newHeight.value}
                  onChange={this.handleConfigChange.bind(this, 'styles.height', newHeight.unit || 'px')}
                />
                <div className={styles.guiNumbersSingleName}>高度</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="图表位置"
          >
            <div className={styles.guiController}>
              <div className={styles.guiNumbersSingle}>
                <InputNumber
                  min={0}
                  value={newLeft.value}
                  onChange={this.handleConfigChange.bind(this, 'styles.left', newLeft.unit || 'px')}
                />
                <div className={styles.guiNumbersSingleName}>横坐标</div>
              </div>
              <div className={styles.guiNumbersSingle}>
                <InputNumber
                  min={0}
                  value={newTop.value}
                  onChange={this.handleConfigChange.bind(this, 'styles.top', newTop.unit || 'px')}
                />
                <div className={styles.guiNumbersSingleName}>纵坐标</div>
              </div>
            </div>
          </FormItem>
        </div>
      </div>
    );
  }
}

export default Layout;
