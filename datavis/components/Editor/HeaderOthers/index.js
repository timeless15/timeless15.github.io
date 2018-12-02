import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';

class HeaderOthers extends PureComponent {
  constructor(props) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
  }

  /** 下载 */
  handleDownload() {
    const { onDownloadClick } = this.props;
    onDownloadClick();
  }

  /** 保存 */
  handleSave() {
    const { onSaveClick } = this.props;
    onSaveClick();
  }

  /** 预览 */
  handlePreview() {
    const { onPreviewClick } = this.props;
    onPreviewClick();
  }

  render() {
    return (
      <div className={styles.navRight}>
        <ul className={styles.btnGroup}>
          <li><Button onClick={this.handleDownload} onKeyDown={this.handleDownload}>下载</Button></li>
          <li><Button onClick={this.handleSave} onKeyDown={this.handleSave}>保存</Button></li>
          <li><Button onClick={this.handlePreview} onKeyDown={this.handleSave}>预览</Button></li>
        </ul>
      </div>
    );
  }
}

export default HeaderOthers;
