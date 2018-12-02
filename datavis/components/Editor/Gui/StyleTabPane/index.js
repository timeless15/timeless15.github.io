/*
 * @Author: Jiangang Lu
 * @Date: 2018-09-21 13:55:19
 * @Last Modified by: Jiangang Lu
 * @Last Modified time: 2018-10-24 17:19:58
 */
import React, { PureComponent } from 'react';
import { Form, Collapse } from 'antd';
import Layout from 'components/Editor/Gui/Template/Layout';
import GuiFormItem from 'components/Editor/Gui/StyleTabPane/GuiFormItem';

const { Panel } = Collapse;

class StyleTabPane extends PureComponent {
  constructor(props) {
    super(props);
    this.handleConfigChange = this.handleConfigChange.bind(this);
  }

  getChartComponent(chartConfig, char) {
    const form = Object.keys(chartConfig).map((name) => {
      const item = chartConfig[name];
      let newChar;
      if ((item.type === 'group') || (item.type === 'array')) {
        newChar = (item.type === 'group') ? `${char}.${name}.children` : `${char}.${name}`;
        return (
          <Panel header={chartConfig[name].name} key={name}>
            <GuiFormItem
              key={name}
              char={newChar}
              item={chartConfig[name]}
              onConfigChange={this.handleConfigChange}
            />
          </Panel>
        );
      }
      return null;
      // else {
      //   newChar = `${char}.${name}`;
      //   return <GuiFormItem
      //            key={`item${index + 1}`}
      //            char={newChar}
      //            item={chartConfig[name]}
      //            handleChange={handleChange} />
      // }
    });

    return form;
  }

  /**
   * 更新图表配置
   * @param {string} strKey 属性键名
   * @param {(string|number|boolean)} value 属性键值
   * @param {(string|number)} unit 值单位 '', px, %
   */
  handleConfigChange(strKey, value, unit = '') {
    const { onConfigChange } = this.props;
    onConfigChange(strKey, value, unit);
  }

  render() {
    const { options } = this.props;
    const { styles, chartConfig } = options;

    return (
      <Form>
        <Collapse defaultActiveKey={['0']} accordion>
          <Panel header="基础属性" key={0}>
            <Layout {...styles} onConfigChange={this.handleConfigChange} />
          </Panel>
          { this.getChartComponent(chartConfig, 'chartConfig') }
        </Collapse>
      </Form>
    );
  }
}

export default StyleTabPane;
