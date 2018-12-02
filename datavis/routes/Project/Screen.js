/*
 * @Author: Jiangang Lu
 * @Date: 2018-08-14 16:33:59
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-11-02 15:32:07
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Icon, Modal, message, Select, Input, Spin
} from 'antd';
import ScreenList from 'components/ScreenList';
import { searchEditor } from 'src/services/editor.js';
import classNames from 'classnames';
import styles from './Screen.less';

const { confirm } = Modal;
const { Option } = Select;
const { Search } = Input;

class Screen extends Component {
  constructor(props) {
    super(props);
    this.handleNewScreen = this.handleNewScreen.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditor = this.handleEditor.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'screen/fetchList'
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  /** 新建大屏 */
  handleNewScreen() {
    const { history } = this.props;
    history.push('/screen_create');
  }

  /**
   * 删除大屏页面
   * @param  {Object} screen 大屏页面配置
   */
  handleDelete(screen) {
    const { dispatch } = this.props;

    confirm({
      title: `${screen.name} 删除后无法恢复，确认删除？`,
      onOk() {
        dispatch({
          type: 'screen/removeScreen',
          payload: screen.id
        });
      },
      okText: '确定',
      onCancel() {
      },
      cancelText: '取消'
    });
  }

  /**
   * 跳转到大屏页面
   * @param  {String} id 大屏编号
   */
  handleEditor(id) {
    const { history } = this.props;
    history.push(`/screen/${id}`);
  }

  /**
   * 复制大屏页面
   * @param  {Object} screen 大屏页面配置
   */
  handleCopy(screen) {
    const { dispatch } = this.props;
    const { name } = screen;
    const newId = new Date().getTime();

    confirm({
      title: `确认复制数据大屏 "${name}" 吗？`,
      onOk() {
        dispatch({
          type: 'screen/addScreen',
          payload: {
            name,
            id: newId
          }
        });
        searchEditor(screen.id)
          .then((resp) => {
            // 获取原配置
            const { data } = resp;
            const newChart = _.cloneDeep(data.charts);
            newChart.map((item) => {
              item.id = `${item.id.split('-')[0]}-${new Date().getTime()}`;
            });
            dispatch({
              type: 'editor/addEditor',
              payload: {
                id: newId,
                charts: newChart,
                page: data.page
              }
            });
          });
      },
      okText: '确定',
      onCancel() {},
      cancelText: '取消'
    });
  }

  /** 修改大屏名称 */
  handleEditName(id, formRef) {
    const { dispatch } = this.props;
    const { form } = formRef.props;

    form.validateFields(
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'screen/editScreen',
            payload: {
              ...values,
              id
            }
          });
          message.info('修改成功！', 2);
        }
      }
    );
  }

  render() {
    const { loading } = this.state;
    const { screen } = this.props;
    const { list } = screen;

    return (
      <div>
        <div className={styles.mainHeader}>
          <div className={styles.mainTitle}>
            <h2>我的可视化项目</h2>
            <span className={styles.mainTitleTag}>
              <span>已创建</span>
              <span className={styles.mainTitleTagNum}>{list.length}</span>
            </span>
          </div>
          <div className={styles.mainManager}>
            <div className={styles.select}>
              <Select defaultValue="0" style={{ width: 195 }} dropdownStyle={{ background: '#1d262e' }}>
                <Option value="0">按创建时间排序</Option>
                <Option value="1">按修改时间排序</Option>
              </Select>
            </div>
            <div className={styles.search}>
              <Search
                placeholder="搜索"
                style={{ width: 195 }}
              />
            </div>
          </div>
        </div>
        <div className={styles.mainBody}>
          <div className={classNames(styles.mainScroll, 'scrollbar')}>
            <Spin tip="项目加载中..." spinning={loading}>
              <div className="screen-list-box">
                <div className="screen">
                  <div className="screen-new-wrap" onClick={this.handleNewScreen} onKeyDown={this.handleNewScreen}>
                    <span className="screen-new-link">
                      <Icon type="plus" />
                      <span>新建可视化</span>
                    </span>
                  </div>
                </div>
                { list.map(item => (
                  <ScreenList
                    key={item.id}
                    item={item}
                    onDeleteClick={this.handleDelete}
                    onEditorClick={this.handleEditor}
                    onCopyClick={this.handleCopy}
                    onNameClick={this.handleEditName}
                  />)) }
              </div>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ screen }) => ({
  screen
}))(Screen);
