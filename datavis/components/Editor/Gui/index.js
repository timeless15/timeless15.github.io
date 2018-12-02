/*
 * @Author: Jiangang Lu
 * @Date: 2018-08-16 22:21:42
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-11-01 15:07:10
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Tabs } from 'antd';
import StyleTabPane from './StyleTabPane';
import DataTabPane from './DataTabPane';

const { TabPane } = Tabs;

export default class Gui extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 1
    };
    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  /**
   * 更新图表配置
   * @param {string} strKey 属性键名
   * @param {(string|number|boolean)} value 属性键值
   * @param {(string|number)} unit 值单位 '', px, %
   */
  handleConfigChange(strKey, value, unit = '') {
    const { onConfigChange } = this.props;
    return onConfigChange(strKey, value, unit);
  }

  handleTabChange(key) {
    this.setState({
      activeTabKey: key
    });
  }

  render() {
    const { options } = this.props;
    const { id } = options;
    const { activeTabKey } = this.state;
    // 获取图表类型
    const type = typeof id === 'string' && id.split('-')[0];
    if (!type) {
      return null;
    }
    return (
      <Tabs onChange={this.handleTabChange}>
        <TabPane tab={<span className={classNames('ant-tab-icon', { active: Number(activeTabKey) === 1 })}>样式</span>} key="1">
          <StyleTabPane options={options} onConfigChange={this.handleConfigChange} />
        </TabPane>
        <TabPane tab={<span className={classNames('ant-tab-icon', { active: Number(activeTabKey) === 2 })}>数据</span>} key="2">
          <DataTabPane options={options} onConfigChange={this.handleConfigChange} />
        </TabPane>
        <TabPane tab={<span className={classNames('ant-tab-icon', { active: Number(activeTabKey) === 3 })}>事件</span>} key="3" />
      </Tabs>
    );
  }
}
