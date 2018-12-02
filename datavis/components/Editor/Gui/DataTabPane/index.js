/*
 * @Author: Jiangang Lu
 * @Date: 2018-09-14 14:32:53
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-10-26 14:59:39
 */
import React, { Component } from 'react';
import {
  Form,
  Collapse,
  Tooltip,
  Input,
  Select,
  Button,
  Modal,
  message
} from 'antd';
import classNames from 'classnames';
import {
  UnControlled as CodeMirror,
  Controlled as CodeMirror2
} from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mbo.css';
import './codemirror.less';

const { Panel } = Collapse;
const { Option } = Select;

class DataTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attrStatus: {}, // 属性字段状态
      dataSourceTypes: [
        {
          name: '静态数据',
          value: 'apiData'
        },
        {
          name: 'Data Service',
          value: 'api'
        }
      ],
      visible: false, // 是否显示数据响应结果标识符
      resultData: ''
    };
    this.handleDataSourceCancel = this.handleDataSourceCancel.bind(this);
  }

  componentDidMount() {
    const { options } = this.props;
    this.handleDataAttrChecked(options);
  }

  /**
   * 获取当前数据源类型
   * @param  {Object} apis 数据源配置
   * @param  {String} attrKey 数据源字段属性
   * @returns {String} dataType 数据源类型 apiData || api
   */
  getDataSourceType(apis, attrKey) {
    if ({}.hasOwnProperty.call(apis, attrKey)) {
      return apis[attrKey].type;
    }
    return Object.keys(apis).map((item) => {
      if ({}.hasOwnProperty.call(apis[item], 'children')) {
        return this.getDataSourceType(apis[item].children, attrKey);
      }
      return null;
    }).filter(item => item != null)[0];
  }

  /**
   * 数据源类型切换
   * @param  {String} attrKey 数据源字段属性
   * @param  {String} value 数据源类型 apiData || api
   */
  handleDataTypeChange(attrKey, value) {
    // console.log('handleDataTypeChange', attrKey, value);
    const { onConfigChange } = this.props;
    // let data = null;
    // if (value === 'apiData') {
    //   data = options[value].source;
    // } else if (value === 'api') {
    //   data = options[value].url;
    // }

    onConfigChange(`apis.${attrKey}.type`, value);
  }

  /**
   * 检测接口字段与数据字段是否匹配
   * @param  {object} apis 接口数据字段属性
   * @param  {object} apiData 数据
   */
  handleDataAttrChecked(chart, attrStatus = {}) {
    const { apis, apiData, api } = chart;
    const newAttrStatus = attrStatus; // 用于存储数属性匹配状态
    let mapping = null;
    let data = null;

    Object.keys(apis).forEach((item) => {
      newAttrStatus[item] = {};

      if (
        {}.hasOwnProperty.call(apiData, item)
        && {}.hasOwnProperty.call(api, item)
      ) {
        if (apis[item].type === 'apiData') {
          data = apiData[item];
        } else if (apis[item].type === 'api') {
          data = api[item].source;
        }
      }

      if (apis[item] && apis[item].fields) {
        const { fields } = apis[item];
        Object.keys(fields).forEach((name) => {
          mapping = fields[name].mapping ? fields[name].mapping : name;
          if (apiData && Array.isArray(data)) {
            data.forEach((o) => {
              if ({}.hasOwnProperty.call(o, mapping)) {
                newAttrStatus[item][name] = '匹配成功';
              } else {
                newAttrStatus[item][name] = '未找到字段';
              }
            });
          } else {
            newAttrStatus[item][name] = '未找到字段';
          }
        });
      }

      if (apis[item] && apis[item].children) {
        this.handleDataAttrChecked({ apis: apis[item].children, apiData, api }, newAttrStatus);
      }
    });
    this.setState({ attrStatus: newAttrStatus });
  }

  /**
   * 更新字段映射
   * @param  {} item 原字段映射
   * @param  {} oldAttr 原字段映射
   * @param  {} e  Input对象
   */
  handleDataAttrChange(item, oldAttr, e) {
    const { options, onConfigChange } = this.props;
    onConfigChange(`apis.${item}.fields.${oldAttr}.mapping`, e.target.value);
    this.handleDataAttrChecked(options);
  }

  /**
   * 数据编辑器
   * @param  {String} attrKey 数据源字段属性
   * @param  {Object} editor CodeMirror对象
   */
  handleEditorFocusChange(attrKey, editor) {
    let newData = null;
    const { options, onConfigChange } = this.props;
    const { alias, apis } = options;
    const data = editor.getValue();
    const dataType = this.getDataSourceType(apis, attrKey);

    try {
      if (dataType === 'apiData') {
        newData = JSON.parse(data);
        onConfigChange(`apiData.${attrKey}`, newData);
      } else if (dataType === 'api') {
        if (data !== '' && !(/^(http|https):\/\/([^# ]*)/.test(data))) {
          message.error(`${alias}接口: url must contains protocol field, like http:`);
        } else if (data !== '') {
          onConfigChange(`api.${attrKey}.url`, data);
        }
      }
      this.handleDataAttrChecked(options);
    } catch (error) {
      this.handleDataAttrChecked();
    }
  }

  /**
   * 显示查看数据响应结果模态框
   * @param  {any} resultData 结果数据
   */
  showDataSourceModal(resultData) {
    this.setState({
      visible: true,
      resultData
    });
  }

  // 关闭数据响应结果模态框
  handleDataSourceCancel() {
    this.setState({
      visible: false
    });
  }

  // 渲染数据面板内容
  renderDataSourceContent(fields, dataType, item, strKey = item) {
    const { options } = this.props;
    const { apiData, api } = options;
    const { attrStatus, dataSourceTypes } = this.state;
    let newData = apiData[item];
    let resultData = options[dataType][item];
    let fieldAttr = null;

    if (dataType === 'apiData') {
      newData = newData ? JSON.stringify(newData, null, 2) : '';
      resultData = resultData ? JSON.stringify(resultData, null, 2) : '';
    } else if (dataType === 'api') {
      newData = api[item].url ? api[item].url : '';
      resultData = resultData.source ? JSON.stringify(resultData.source, null, 2) : '';
    }

    if (!fields) {
      return null;
    }
    return (
      <div>
        <div className="data-attr-table-warpper">
          <table className="data-attr-table">
            <thead className="table-head">
              <tr>
                <td className="column-item attr-name">字段</td>
                <td className="column-item attr-value">映射</td>
                <td className="column-item attr-status">状态</td>
              </tr>
            </thead>
            <tbody className="table-body">
              {
                Object.keys(fields).map((attr) => {
                  fieldAttr = fields[attr];
                  return (
                    <tr key={attr}>
                      <td className="column-item attr-name">
                        <Tooltip placement="leftTop" title={fieldAttr.description}>
                          {attr}
                        </Tooltip>
                      </td>
                      <td className="column-item attr-value">
                        <Input
                          value={fieldAttr.mapping}
                          onChange={this.handleDataAttrChange.bind(this, strKey, attr)}
                        />
                      </td>
                      <td className="column-item attr-status">
                        <div>
                          <i className={classNames('attr-status-icon', { failed: (attrStatus[item] && attrStatus[item][attr]) !== '匹配成功' })} />
                          <span className="attr-status-text">{(attrStatus[item] && attrStatus[item][attr]) || '未找到字段'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        <div className="data-source-wrapper">
          <div className="data-source-selector">
            <label htmlFor="dataSourceType">
              <span>数据源类型</span>
              <div className="data-source-select">
                <Select id="dataSourceType" value={dataType} onChange={this.handleDataTypeChange.bind(this, strKey)}>
                  {
                    dataSourceTypes.map(dataSourceTypeItem => (
                      <Option key={dataSourceTypeItem.value} value={dataSourceTypeItem.value}>
                        {dataSourceTypeItem.name}
                      </Option>
                    ))
                  }
                </Select>
              </div>
            </label>
          </div>
          <div className="data-source-editor">
            <CodeMirror
              value={newData}
              options={{
                theme: 'mbo',
                mode: 'javascript',
                tabSize: 2,
                lineNumbers: true
              }}
              onBlur={this.handleEditorFocusChange.bind(this, item)}
            />
            <div className="data-source-result">
              <Button type="primary" onClick={this.showDataSourceModal.bind(this, resultData)}>查看数据响应结果</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染子数据面板
  renderChildDataSource(children = {}, strKey) {
    if (children) {
      return (
        <Collapse bordered={false} accordion>
          {
            Object.keys(children).map(item => (
              <Panel key={item} header={children[item].description || '基础接口'}>
                {
                  this.renderDataSourceContent(children[item].fields, children[item].type, item, `${strKey}.children.${item}`)
                }
              </Panel>
            ))
          }
        </Collapse>
      );
    }
    return null;
  }

  // 渲染数据面板
  renderDataSource() {
    const { options } = this.props;
    const { apis } = options;
    const { resultData, visible } = this.state;
    let dataType = null;

    return (
      <div>
        <Collapse defaultActiveKey={[Object.keys(apis)[0]]} accordion>
          {
            Object.keys(apis).map((item) => {
              dataType = apis[item].type;
              // resultData = options[apis[item].type][item];
              return (
                <Panel key={item} header={apis[item].description || '基础接口'}>
                  { this.renderChildDataSource(apis[item].children, item) }
                  { this.renderDataSourceContent(apis[item].fields, dataType, item) }
                </Panel>
              );
            })
          }
        </Collapse>
        <Modal
          title="数据响应结果"
          visible={visible}
          onCancel={this.handleDataSourceCancel}
          footer={null}
          destroyOnClose
        >
          <CodeMirror2
            value={resultData}
            options={{
              theme: 'mbo',
              mode: 'javascript',
              tabSize: 2,
              lineNumbers: true
            }}
          />
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Form>
        { this.renderDataSource() }
      </Form>
    );
  }
}

export default DataTabPane;
