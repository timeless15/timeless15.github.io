import React, { Component } from 'react';
import {
  Button,
  Icon,
  Tooltip,
  Form
} from 'antd';
import EditNameForm from './EditNameForm';

const ScreenEditNameForm = Form.create()(EditNameForm);

class ScreenList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editShow: 'none'
    };
    this.saveFormRef = this.saveFormRef.bind(this);
    this.showEditName = this.showEditName.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /**
   * 删除大屏页面
   * @param  {Object} screen 大屏页面配置
   */
  handleDelete(screen) {
    const { onDeleteClick } = this.props;
    onDeleteClick(screen);
  }

  /**
   * 跳转到大屏页面
   * @param  {String} id 大屏编号
   */
  handleEditor(id) {
    const { onEditorClick } = this.props;
    onEditorClick(id);
  }

  /**
   * 复制大屏页面
   * @param  {Object} screen 大屏页面配置
   */
  handleCopy(item) {
    const { onCopyClick } = this.props;
    onCopyClick(item);
  }

  /** 显示修改名称 */
  showEditName() {
    this.setState({
      editShow: 'block'
    });
    const { input } = this.formRef.editInput.current;
    input.value = '';
    // setTimeout is required, input is focused after open
    setTimeout(() => {
      input.focus();
    }, 0);
  }

  /**
   * 修改大屏页面名称
   * @param  {String} id 大屏编号
   */
  handleEditName(id, formRef) {
    const { onNameClick } = this.props;
    onNameClick(id, formRef);
    this.handleCancel();
  }

  // 取消修改名称
  handleCancel() {
    this.setState({
      editShow: 'none'
    });
  }

  saveFormRef(formRef) {
    this.formRef = formRef;
  }

  render() {
    const { item } = this.props;
    const { editShow } = this.state;

    return (
      <div className="screen">
        <div className="screen-image-wrap">
          <div className="mask">
            <div className="edit-wrap"><Button type="primary" onClick={this.handleEditor.bind(this, item.id)}>编辑</Button></div>
            <div className="delete" onClick={this.handleDelete.bind(this, item)} onKeyDown={this.handleDelete.bind(this, item)}>
              <Icon type="delete" />
            </div>
          </div>
        </div>
        <div className="screen-bottom-wrap">
          <div className="screen-name-wrap">
            <div className="screen-name-show" onClick={this.showEditName} onKeyDown={this.showEditName}>
              <Tooltip title="点击修改名称" placement="topLeft">
                <p>{item.name}</p>
              </Tooltip>
            </div>
            <div className="screen-name-edit" style={{ display: editShow }}>
              <ScreenEditNameForm
                wrappedComponentRef={this.saveFormRef}
                onCancel={this.handleCancel}
                onEditName={this.handleEditName.bind(this, item.id, this.formRef)}
              />
            </div>
          </div>
          <div className="screen-actions-wrap">
            <ul>
              <li
                onClick={this.handleCopy.bind(this, item)}
                onKeyDown={this.handleCopy.bind(this, item)}
              >
                <Icon type="plus-square-o" />
                <span>复制</span>
              </li>
              <li>
                <Icon type="arrows-alt" />
                <span>预览</span>
              </li>
              <li>
                <Icon type="cloud-download-o" />
                <span>下载</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenList;
