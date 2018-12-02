/*
 * @Author: ruqichen
 * @Date: 2018-10-11 13:22:36
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-10-24 16:22:58
 */
import React, { PureComponent } from 'react';
import { Form, InputNumber, Button } from 'antd';
import ColorPicker from 'components/Editor/Gui/Template/ColorPicker.js';
import Image from 'components/Editor/Gui/Template/Image.js';
import utils from 'src/utils/utils.js';
import styles from './index.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 16 }
  }
};

/** 显示默认背景图 */
function handleImageError(e) {
  e.target.onerror = null;
  e.target.src = 'assets/img/template/default.png';
}

class PageConfig extends PureComponent {
  /**
   * 更新页面配置
   * @param  {} strKey 属性键名
   * @param {(string|number|boolean)} value 属性键值
   */
  handlePageConfChange(strKey, value) {
    const { onPageConfigChange } = this.props;
    onPageConfigChange(strKey, value);
  }

  render() {
    const { options } = this.props;
    const {
      width,
      height,
      backgroundColor,
      backgroundImage,
      gridStep,
      thumbnail
    } = options;
    return (
      <div className={styles.pageConfig}>
        <div className={styles.pageConfigHeader}>页面设置</div>
        <Form>
          <div className="guiGroupContainer">
            <div className="guiGroupController">
              <FormItem
                {...formItemLayout}
                label="屏幕大小"
              >
                <div className="guiController">
                  <div className="guiNumbersSingle">
                    <InputNumber
                      min={0}
                      value={utils.stringToNumber(width).value}
                      onChange={this.handlePageConfChange.bind(this, 'width')}
                    />
                    <div className="guiNumbersSingleName">宽度</div>
                  </div>
                  <div className="guiNumbersSingle">
                    <InputNumber
                      min={0}
                      value={utils.stringToNumber(height).value}
                      onChange={this.handlePageConfChange.bind(this, 'height')}
                    />
                    <div className="guiNumbersSingleName">高度</div>
                  </div>
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="背景颜色"
              >
                <ColorPicker color={backgroundColor} onConfigChange={this.handlePageConfChange.bind(this)} prop="backgroundColor" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="背景图"
              >
                <Image imgSrc={backgroundImage} onConfigChange={this.handlePageConfChange.bind(this)} prop="backgroundImage" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="栅格间距"
              >
                <InputNumber
                  min={0}
                  value={utils.stringToNumber(gridStep).value}
                  onChange={this.handlePageConfChange.bind(this, 'gridStep')}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="缩略图"
              >
                <Button onClick={this.handlePageConfChange.bind(this, 'thumbnail', '')}>截取封面</Button>
                <div className="screenPreview">
                  <img src={thumbnail} onError={handleImageError} alt="缩略图" />
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="重置"
              >
                <Button onClick={this.handlePageConfChange.bind(this, 'reset', '')}>恢复默认背景</Button>
              </FormItem>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default PageConfig;
