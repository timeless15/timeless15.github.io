/*
 * @Author: Shiqi Han
 * @Date: 2018-11-21 12:05:01
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-03 17:17:20
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import Papa from 'papaparse';
import _ from 'lodash';
import {
  Button, Form, Modal, Select, Input, Icon, message, Spin
} from 'antd';
import './Listview.less';
import reactCss from 'reactcss';

const FormItem = Form.Item;
const { Option } = Select;
const dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;
const TYPES = {
  LINEAR: 'linear',
  CAT: 'cat',
  TIME: 'time'
};

class Listview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      file: {
        // TODO 获取上传文件信息，目前只用到了data，其他参数如果后续不用可删除
        name: '请上传文件',
        lastModified: '',
        size: '',
        type: '',
        data: []
      },
      spinning: false
    };
    this.fileInput = React.createRef();
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAddData = this.handleAddData.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.getDataField = this.getDataField.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'data/fetchList'
    });
  }

  /**
   * 根据第一条数据初步判断字段类型
   */
  getDataField() {
    const { file } = this.state;
    const data = file.data[0];
    const keys = Object.keys(data);
    const fieldDefs = [];
    keys.forEach((key) => {
      const value = data[key];
      let type = TYPES.LINEAR;
      if (_.isString(value)) {
        type = TYPES.CAT;
      // TODO 时间判断
      } else if (dateRegex.test(value)) {
        type = TYPES.TIME;
      }
      fieldDefs.push({
        field: key,
        type
      });
    });
    return fieldDefs;
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleCancel() {
    const { form } = this.props;
    this.setState({
      visible: false,
      file: {
        name: '请上传文件',
        lastModified: '',
        size: '',
        type: '',
        data: []
      }
    });
    form.resetFields();
  }

  /**
   * 监听input[type=file]的变化，上传文件后进行校验和处理数据
   */
  handleUploadFile(e) {
    const { files } = e.target;
    const { form } = this.props;
    const type = form.getFieldValue('type');
    // var reader = new FileReader();
    // var data;
    // reader.onload = function(evt) {
    //   data = evt.target.result;
    // }
    // reader.readAsArrayBuffer(file);
    // var view = new DataView(data);
    // view.getUint8(0).toString(16);
    // TODO: 文件类型校验
    if (files.length > 0) {
      const file = files[0];
      const self = this;
      if (new RegExp(`.${type}$`).test(file.name)) {
        this.setState({
          spinning: true
        });
        if (type === 'csv') {
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function comp(results) {
              // TODO: results.error数据有错误（一般是最后一行多余引起的，现在暂时直接处理
              const { data, errors } = results;
              if (errors.length > 0 && errors[0].code === 'TooFewFields' && errors[0].row === (data.length - 1)) {
                data.pop();
              }
              self.setState({
                spinning: false,
                file: {
                  name: file.name,
                  lastModified: file.lastModified,
                  size: file.size,
                  type: file.type,
                  data
                }
              });
            }
          });
        } else {
          const reader = new FileReader();
          reader.onload = function readerload(evt) {
            self.setState({
              spinning: false,
              file: {
                name: file.name,
                lastModified: file.lastModified,
                size: file.size,
                type: file.type,
                data: JSON.parse(evt.target.result)
              }
            });
          };
          reader.readAsText(file);
        }
      } else {
        const { input } = this.fileInput.current;
        message.warn(`上传文件必须为${type}类型`);
        input.value = '';
      }
    }
  }

  /**
   * 提交表单
   */
  handleAddData() {
    const { form, dispatch } = this.props;
    const id = new Date().getTime();
    form.validateFields(
      (err, values) => {
        if (!err) {
          const { file } = this.state;
          const { data } = file;
          const fieldDefs = this.getDataField();
          dispatch({
            type: 'data/addData',
            payload: {
              id,
              name: values.name,
              type: values.type,
              uploadTime: new Date().getTime()
            }
          }).then(() => {
            this.setState({
              visible: false,
              file: {
                name: '请上传文件',
                lastModified: '',
                size: '',
                type: '',
                data: []
              }
            });
            form.resetFields();
          });
          // 同时创建新的operator
          dispatch({
            type: 'operator/addOperator',
            payload: {
              id,
              name: values.name,
              data,
              fieldDefs,
              encoding: {}
            }
          });
        }
      }
    );
  }

  handleDelete(id) {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定要删除数据源？',
      onOk() {
        dispatch({
          type: 'data/removeData',
          payload: id
        });
      },
      okText: '确定',
      onCancel() {
      },
      cancelText: '取消'
    });
  }

  /**
   * 跳转到数据处理页面
   */
  handleEdit(id) {
    const { history } = this.props;
    history.push(`/data/${id}`);
  }

  render() {
    const { form, data } = this.props;
    const dataList = data.list;
    const { getFieldDecorator } = form;
    const { visible, file, spinning } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const uploadStyles = reactCss({
      default: {
        uploadWrap: {
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: '150px',
          margin: '10px 0px'
        },
        uploadCover: {
          display: spinning ? 'none' : 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          height: '100%',
          justifyContent: 'center',
          border: '1px solid #405171'
        },
        spinningCover: {
          display: spinning ? 'flex' : 'none',
          flexDirection: 'column',
          textAlign: 'center',
          height: '100%',
          justifyContent: 'center',
          border: '1px solid #405171'
        },
        uploadInput: {
          display: 'block',
          opacity: '0',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }
      }
    }, this.state);
    return (
      <div className="my-data">
        <div className="data-title">
          <div className="title-add">
            <Button type="primary" onClick={this.showModal}> +添加数据 </Button>
          </div>
          <div className="title-right">按修改时间排序</div>
        </div>
        <div className="data-list">
          {
            dataList.map(item => (
              <div className="main-storage" key={item.id}>
                <div className="storage-operate">
                  <div className="storage-delete" onClick={this.handleDelete.bind(this, item.id)} onKeyDown={this.handleDelete.bind(this, item.id)}>
                    <Icon className="delete-icon" type="delete" />
                  </div>
                  <div className="storage-edit" onClick={this.handleEdit.bind(this, item.id)} onKeyDown={this.handleEdit.bind(this, item.id)}>
                    <Icon className="edit-icon" type="edit" />
                  </div>
                </div>
                <div className="storage-info">
                  <div className="info-name">{item.name}</div>
                  <div className="info-time">{new Date(item.uploadTime).toLocaleString()}</div>
                </div>
              </div>
            ))
          }
        </div>
        <Modal
          title="添加数据"
          visible={visible}
          onOk={this.handleAddData}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form>
            <FormItem {...formItemLayout} label="类型">
              { getFieldDecorator('type', {
                rules: [{
                  required: true,
                  message: '请选择类型'
                }]
              })(
                <Select placeholder="选择类型">
                  <Option value="csv">CSV文件</Option>
                  <Option value="json">JSON文件</Option>
                </Select>
              ) }
            </FormItem>
            <FormItem {...formItemLayout} label="名称">
              { getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入数据源名称'
                }]
              })(
                <Input placeholder="自定义数据源名称" />
              ) }
            </FormItem>
            <FormItem {...formItemLayout} label="上传文件">
              { getFieldDecorator('file', {
                rules: [{
                  required: true,
                  message: '请上传文件'
                }]
              })(
                <div style={uploadStyles.uploadWrap}>
                  <div style={uploadStyles.uploadCover}>
                    <Icon type="file-add" />
                    <span>{file.name}</span>
                  </div>
                  <div style={uploadStyles.spinningCover}>
                    <Spin spinning={spinning} />
                    <span>正在上传</span>
                  </div>
                  <Input style={uploadStyles.uploadInput} type="file" onChange={this.handleUploadFile} ref={this.fileInput} />
                </div>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(({ data }) => ({ data }))(Form.create()(Listview));
