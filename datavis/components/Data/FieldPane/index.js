/*
 * @Author: Shiqi Han
 * @Date: 2018-12-01 15:27:19
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-12-02 22:58:50
 */
/*eslint-disable*/
import React, { Component } from 'react';
import { Popover, Icon, Radio } from 'antd';
import './index.less';

const LetterSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M832 896h-101.44l-72.576-210.24H361.856L293.44 896H192L462.848 128h98.24L832 896zM629.504 598.976L522.112 279.68c-3.392-10.176-7.04-28.096-11.008-53.504H508.8c-3.392 23.168-7.232 40.96-11.456 53.504L390.784 598.976h238.72z" p-id="1252"></path>
  </svg>
);
const NumberSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M911.6 337.9l-25.9 103.7c-2.1 7.4-6.9 11.1-14.3 11.1H719.9l-29.6 118.5h144c4.7 0 8.5 1.9 11.6 5.6 3.1 4.3 4 8.7 2.8 13l-26.1 103.7c-1.6 7.4-6.3 11.1-14.3 11.1H656.9l-37.5 151.9c-2.1 7.4-6.9 11.1-14.3 11.1H501.4c-5 0-9-1.9-12.1-5.6-2.8-3.7-3.7-8-2.8-13l36.1-144.4H405.1l-37.5 151.9c-2.1 7.4-6.9 11.1-14.3 11.1H249c-4.7 0-8.5-1.9-11.6-5.6-2.8-3.7-3.7-8-2.8-13l36.1-144.3h-144c-4.7 0-8.5-1.9-11.6-5.6-2.8-3.7-3.7-8-2.8-13l26-103.9c2.1-7.4 6.9-11.1 14.3-11.1H304l29.6-118.5H189.7c-4.7 0-8.5-1.9-11.6-5.6-3.1-4.3-4-8.7-2.8-13l26-103.8c1.6-7.4 6.3-11.1 14.3-11.1H367l37.5-151.9c2.1-7.4 7.1-11.1 14.8-11.1H523c4.7 0 8.5 1.9 11.6 5.6 2.8 3.7 3.7 8 2.8 13l-36.1 144.4H619l37.5-151.9c2.1-7.4 7.1-11.1 14.8-11.1H775c4.7 0 8.5 1.9 11.6 5.6 2.8 3.7 3.7 8 2.8 13l-36.1 144.4h144c4.7 0 8.5 1.9 11.6 5.6 2.7 3.9 3.7 8.2 2.7 13.2zM556 571.2l29.6-118.5H468l-29.6 118.5H556z" p-id="8108"></path>
  </svg>
);
const LetterIcon = props => (
  <Icon component = {LetterSvg} {...props} />
);
const NumberIcon = props => (
  <Icon component = {NumberSvg} {...props} />
);

class FieldPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentField: {
        field: '',
        type: ''
      }
    }
    this.fieldTypeChange = this.fieldTypeChange.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props){
      this.renderFieldsList();
    }
  }

  fieldTypeChange(e) {
    this.setState({
      currentField: {
        field: this.state.currentField.field,
        type: e.target.value,
      }
    });
  }

  getCurrentField(selectField) {
    const { fields } = this.props;
    const currentField = fields.filter(f => f.field === selectField)[0];
    console.log(currentField);
    this.setState({
      currentField
    })
  }

  renderFieldsList() {
    const content = (
      <Radio.Group name="fieldType" onChange={this.fieldTypeChange} value={this.state.currentField.type}>
        <Radio value='linear'>数值</Radio>
        <Radio value='cat'>分类</Radio>
      </Radio.Group>
    );
    const { fields } = this.props;
    let fieldsList;
    if (fields) {
      fieldsList = (
        fields.map(item => {
          let typeIcon;
          switch(item.type) {
            case 'cat': 
              typeIcon = <LetterIcon />;
              break;
            case 'time':
              typeIcon = <Icon type="calendar" />;
              break;
            case 'linear':
              typeIcon = <NumberIcon />;
              break;
            default: 
              typeIcon = <NumberIcon />;
          }
          return (
            <div className="field-list-item" key={item.field}>
              <div>
                <span className="field-pill">
                  <span className="field-type">
                    <Popover title="TYPE" content={content} placement="bottomLeft" trigger="click" >
                      <Icon type="caret-down" onClick={this.getCurrentField.bind(this, item.field)}/>
                    </Popover>
                    {typeIcon}
                  </span>
                  <span className="field-text">{item.field}</span>
                  <span className="field-filter"><Icon type="filter" /></span>
                  <span className="field-add"><Icon type="plus" /></span>
                </span>
              </div>
            </div>
          )
        })
      );
    }
    return fieldsList;
  }

  render() {   
    return (
      <div className="field-wrap">
        <h2>Data</h2>
        <div className="field-section">
          <h3>Fields</h3>
          <div className="field-list">
            {this.renderFieldsList()}
          </div>
        </div>
      </div>
    );
  }
}

export default FieldPane;
