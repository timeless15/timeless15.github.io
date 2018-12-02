import React, { Component } from 'react';
import { Form, Input, Icon } from 'antd';

const FormItem = Form.Item;

export default class EditNameForm extends Component {
  constructor(props) {
    super(props);
    this.editInput = React.createRef();
  }

  render() {
    const { onEditName, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem label="">
          {
            getFieldDecorator('name', {
              rules: [{
                require: true,
                message: '请输入新的大屏名称'
              }]
            })(
              <div>
                <Input
                  placeholder="请输入新的大屏名称"
                  onPressEnter={onEditName}
                  ref={this.editInput}
                />
                <Icon type="check" theme="outlined" onClick={onEditName} />
                <Icon type="close" theme="outlined" onClick={onCancel} />
              </div>
            )
          }
        </FormItem>
      </Form>
    );
  }
}
