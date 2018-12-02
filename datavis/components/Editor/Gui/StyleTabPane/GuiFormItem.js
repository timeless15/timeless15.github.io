/*
 * @Author: Jiangang Lu
 * @Date: 2018-09-21 14:55:51
 * @Last Modified by: Jiangang Lu
 * @Last Modified time: 2018-10-30 12:50:40
 */
import React, { Component } from 'react';
import {
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Slider,
  Row,
  Col
} from 'antd';
import ColorPicker from 'components/Editor/Gui/Template/ColorPicker.js';
import Image from 'components/Editor/Gui/Template/Image.js';
import utils from 'utils/utils';
import 'components/Editor/Gui/Template/template.less';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 16 }
  }
};

class GuiFormItem extends Component {
  handleConfigChange(strKey, value) {
    const { onConfigChange } = this.props;
    onConfigChange(strKey, value);
  }

  handleConfigNumberChange(strKey, unit = '', value) {
    const { onConfigChange } = this.props;
    onConfigChange(strKey, value, unit);
  }

  handleInputChange(strKey, e) {
    this.handleConfigChange(strKey, e.target.value);
  }

  renderSeries(item, char) {
    if ({}.hasOwnProperty.call(item, 'default')) {
      if (!Array.isArray(item.default)) {
        Object.assign(item, { default: [item.default] });
      }

      return (
        <Collapse bordered={false} defaultActiveKey={['0']} accordion>
          {
            item.default.map((d, i) => {
              const newIndex = i;
              if (!Array.isArray(item.children)) {
                Object.assign(item, { children: [item.children] });
              }
              return (
                <Panel header={`系列${(i + 1)}`} key={newIndex}>
                  { this.renderSeriesItem((item.children[i] ? item.children[i] : item.children[0]), d, `${char}.default[${i}]`) }
                </Panel>
              );
            })
          }
        </Collapse>
      );
    }

    return null;
  }

  renderSeriesItem(children, data, char) {
    // console.log('renderSeriesItem', children, data);
    return Object.keys(children).map((item, index) => {
      const newIndex = index;
      const newChar = `${char}.${item}`; // 用于更新的key字符串 如：chartConfig.xAxis.children.name.default
      if ({}.hasOwnProperty.call(children[item], 'children')) {
        if ({}.hasOwnProperty.call(children[item], 'name')) {
          if (children[item].type === 'array') {
            return data[item].map((dataItem, dataIndex) => {
              const newDataIndex = dataIndex;
              return (
                <Collapse bordered={false} key={newDataIndex}>
                  <Panel header={children[item].name + (newDataIndex + 1)} key={newIndex}>
                    { this.renderSeriesItem(children[item].children, dataItem, `${newChar}[${dataIndex}]`) }
                  </Panel>
                </Collapse>
              );
            });
          }
          if (children[item].type === 'group') {
            return (
              <Collapse bordered={false} key={newIndex}>
                <Panel header={children[item].name} key={newIndex}>
                  { this.renderSeriesItem(children[item].children, data[item], newChar) }
                </Panel>
              </Collapse>
            );
          }
        } else {
          return this.renderSeriesItem(children[item].children, data[item], newChar);
        }
      } else {
        return this.renderItemType(children[item], data[item], index, newChar);
      }
      return null;
    });
  }

  renderFormItem(children, char) {
    return Object.keys(children).map((item, index) => {
      const newIndex = index;
      let newChar = `${char}.${item}`; // 用于更新的key字符串 如：chartConfig.xAxis.children.name.default
      if ({}.hasOwnProperty.call(children[item], 'children')) {
        newChar += '.children';
        if ({}.hasOwnProperty.call(children[item], 'name')) {
          return (
            <Collapse bordered={false} key={newIndex}>
              <Panel header={children[item].name} key={newIndex}>
                { this.renderFormItem(children[item].children, newChar) }
              </Panel>
            </Collapse>
          );
        }
        return this.renderFormItem(children[item].children, newChar);
      }
      if ({}.hasOwnProperty.call(children[item], 'default')) {
        newChar += '.default';
        return this.renderItemType(children[item], children[item].default, index, newChar);
      }
      return null;
    });
  }

  /**
   * 根据type类型渲染配置项
   * @param  {Object} item 配置项对象
   * @param  {Object} data 初始值
   * @param  {Object} index 索引
   * @param  {String} newChar 配置项字段字符串，用于配置修改对应对象值
   */
  renderItemType(item, data, index, newChar) {
    const selectChildren = [];
    const radioChildren = [];
    let newData = 0;
    switch (item.type) {
      case 'text':
        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            <Input
              value={data}
              onChange={this.handleInputChange.bind(this, newChar)}
            />
          </FormItem>
        );
      case 'number':
        newData = utils.stringToNumber(data);
        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            <InputNumber
              min={item.min}
              max={item.max}
              step={item.step}
              value={newData.value}
              onChange={this.handleConfigNumberChange.bind(this, newChar, newData.unit)}
            />
          </FormItem>
        );
      case 'sliderNumber':
        newData = utils.stringToNumber(data);
        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={newData.value}
                  onChange={this.handleConfigNumberChange.bind(this, newChar, newData.unit)}
                />
              </Col>
              <Col span={10}>
                <InputNumber
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  style={{ marginLeft: 16 }}
                  value={newData.value}
                  onChange={this.handleConfigNumberChange.bind(this, newChar, newData.unit)}
                />
              </Col>
            </Row>
          </FormItem>
        );
      case 'color':
        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            <ColorPicker
              color={data}
              onConfigChange={this.handleConfigChange.bind(this)}
              prop={newChar}
            />
          </FormItem>
        );
      case 'colorArray':
        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            {
              data.map((color, i) => {
                const key = `colorArray-${i}`;
                return (
                  <Row key={key}>
                    <Col>
                      <ColorPicker color={color} onConfigChange={this.handleConfigChange.bind(this)} prop={`${newChar}[${i}]`} />
                    </Col>
                  </Row>
                );
              })
            }
          </FormItem>
        );
      case 'select':
        if ({}.hasOwnProperty.call(item, 'options')) {
          item.options.forEach((option) => {
            selectChildren.push(
              <Option key={option.value} value={option.value}>{option.name}</Option>
            );
          });
        }

        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            <Select
              value={data}
              style={{ width: 120 }}
              onChange={this.handleConfigChange.bind(this, newChar)}
            >
              {selectChildren}
            </Select>
          </FormItem>
        );
      case 'radio':
        if ({}.hasOwnProperty.call(item, 'options')) {
          item.options.forEach((option) => {
            radioChildren.push(
              <Radio key={option.value} value={option.value}>{option.name}</Radio>
            );
          });
        }

        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            <RadioGroup name="radiogroup" value={data} onChange={this.handleInputChange.bind(this, newChar)}>
              {radioChildren}
            </RadioGroup>
          </FormItem>
        );
      case 'image':
        return (
          <FormItem
            key={index}
            {...formItemLayout}
            label={item.name}
          >
            <Image
              imgSrc={data}
              onConfigChange={this.handleConfigChange.bind(this)}
              prop={newChar}
            />
          </FormItem>
        );
      default:
        return null;
    }
  }

  render() {
    const { item, char } = this.props;
    // console.log('item', item);
    if (item.type === 'group') {
      return this.renderFormItem(item.children, char);
    }
    if (item.type === 'array') {
      return this.renderSeries(item, char);
    }
    return null;
    // else {
    //  return this.renderItemType(
    //   item,
    //   item.default,
    //   this.props.key,
    //   handleChange, `${char}.default`
    // );
    // }
  }
}

export default GuiFormItem;
