/*
 * @Author: Jiangang Lu
 * @Date: 2018-08-14 21:34:49
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-10-30 15:57:29
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Modal
} from 'antd';

import './Template.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

/** 图片加载错误时，显示默认图片 */
function handleImageError(e) {
  e.target.onerror = null;
  e.target.src = 'assets/img/template/default.png';
}

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      templateIndex: 0
    };
    this.handleGoBack = this.handleGoBack.bind(this);
    this.showCreateModel = this.showCreateModel.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.listClassName = this.listClassName.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取模板列表信息
    dispatch({
      type: 'template/fetchList'
    });
  }

  handleGoBack() {
    const { history } = this.props;
    history.goBack();
  }

  showCreateModel() {
    this.setState({
      visible: true
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  /**
   * 切换选择模板的class
   * @param  {Number} index 模板编号
   */
  listClassName(index) {
    const { templateIndex } = this.state;
    return index === templateIndex ? 'template-item active' : 'template-item';
  }

  /**
   * 模板tab点击事件
   * @param  {Number} index 模板编号
   */
  handleClick(index) {
    this.setState({
      templateIndex: index
    });
    // 模板增加删除操作，只是为了维护模板列表，后期可删除
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'template/addTemplate',
    //   payload:{
    //     name: '空白',
    //     desc: ['尺寸自定'],
    //     img: "assets/img/template/123.png",
    //     tdesc: "在空白画布上尽情施展您的创意吧！",
    //     charts: []
    //   }
    // })
    // dispatch({
    //   type: 'template/removeTemplate',
    //   payload: 6
    // })
  }

  /**
   * 创建模板
   */
  handleCreate() {
    const {
      form,
      dispatch,
      history,
      editor,
      template
    } = this.props;
    const { templateIndex } = this.state;
    const id = new Date().getTime();

    form.validateFields(
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'screen/addScreen',
            payload: {
              ...values,
              id
            }
          }).then(() => {
            dispatch({
              type: 'editor/addEditor',
              payload: {
                id,
                charts: template.list[templateIndex].charts, // 根据选中的模板获取charts
                page: editor.page
              }
            }).then(() => {
              history.push(`/screen/${id}`);
            });
          });
        }
      }
    );
  }

  render() {
    const { form, template } = this.props;
    const { getFieldDecorator } = form;
    const { templateIndex, visible } = this.state;
    const templateList = template.list;

    return (
      <div>
        <div className="header-tmpl">
          <span className="cancle" onClick={this.handleGoBack} onKeyDown={this.handleGoBack} />
          <h3>选择模板</h3>
        </div>
        <div className="main-tmpl">
          <div className="main-tmpl-list">
            <div className="template-list">
              {
                templateList.map((item, index) => (
                  <span
                    className={this.listClassName(index)}
                    key={item.id}
                    onClick={this.handleClick.bind(this, index)}
                    onKeyDown={this.handleClick.bind(this, index)}
                  >
                    <div className="template-img">
                      <img src={item.img} onError={handleImageError} alt="模板图片" />
                    </div>
                    <div className="template-des">
                      <div className="des-name">{item.name}</div>
                      <div className="des-info">
                        {/* 假设只有两个描述语句，如若有新增或者其他格式，则需改为map */}
                        <p>{item.desc[0]}</p>
                        <p>{item.desc[1]}</p>
                      </div>
                    </div>
                  </span>))
              }
            </div>
          </div>
          <div className="main-tmpl-body">
            <div className="tmpl-info">
              <div className="tmpl-img">
                {/* 防止刚加载时还未读取到数据 */}
                { templateList.length > 0 && <img src={templateList[templateIndex].img} onError={handleImageError} alt="模板图片" /> }
                <div className="img-mask">
                  <Button type="primary" onClick={this.showCreateModel}>创建</Button>
                </div>
              </div>
              <div className="tmpl-content">
                { templateList.length > 0 && <div className="tmpl-desc">{templateList[templateIndex].tdesc}</div> }
              </div>
            </div>
            <Modal
              title="数据大屏名称"
              visible={visible}
              onOk={this.handleCreate}
              onCancel={this.handleCancel}
              okText="创建"
              cancelText="取消"
            >
              <Form>
                <FormItem {...formItemLayout} label="数据大屏名称">
                  { getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: '请输入大屏名称'
                    }]
                  })(
                    <Input placeholder="请输入大屏名称" />
                  ) }
                </FormItem>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ screen, editor, template }) => ({
  screen, editor, template
}))(Form.create()(Template));
