/*
 * @Author: Jiangang Lu
 * @Date: 2018-09-25 13:28:25
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-11-06 11:16:35
 */
import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Rnd } from 'react-rnd';
import classNames from 'classnames';
import utils from 'src/utils/utils.js';
import NavigatorLine from './NavigatorLine';
import Item from './Item';

class Screen extends PureComponent {
  constructor(props) {
    super(props);
    this.handleAddChartEntry = this.handleAddChartEntry.bind(this);
    this.handleRndRef = this.handleRndRef.bind(this);
    this.handleRndClick = this.handleRndClick.bind(this);
    this.handleRndDragStart = this.handleRndDragStart.bind(this);
    this.handleRndDrag = this.handleRndDrag.bind(this);
    this.handleRndDragStop = this.handleRndDragStop.bind(this);
    this.handleRndResize = this.handleRndResize.bind(this);
  }

  /**
   * 设置State
   * @param  {Object} state 组件编号、组件位置信息
   */
  setEditorState(state) {
    const { setEditorState } = this.props;
    setEditorState(state);
  }

  /**
   * 设置组件实例
   * @param  {String} id 组件编号
   * @param  {Object} myChart 组件实例
   */
  handleAddChartEntry(id, myChart) {
    const { onAddChartEntry } = this.props;
    onAddChartEntry(id, myChart);
  }

  /**
   * 复制组件
   * @param  {String} id 组件编号
   */
  handleCloneChart(id) {
    const { onCloneChartClick } = this.props;
    onCloneChartClick(id);
  }

  /**
   * 删除组件
   * @param  {String} id 组件编号
   */
  handleRemoveChart(id) {
    const { onRemoveChartClick } = this.props;
    onRemoveChartClick(id);
  }

  /**
   * 组件重绘
   * @param  {String} id 组件编号
   * @param  {Object} styles 组件基本属性
   */
  handleResize(id, styles) {
    const { onResize } = this.props;
    onResize(id, styles);
  }

  /* 以下为拖拽框相关事件回调 */
  /**
   * 拖拽框缩放回调
   * @param {Objec} item 当前选中的拖拽框
   */
  handleRndResize(item) {
    return (...args) => {
      const [, , ref, , position] = args;
      const styles = {
        width: `${ref.style.width}`,
        height: `${ref.style.height}`,
        top: `${position.y}px`,
        left: `${position.x}px`
      };
      this.handleResize(item.id, styles);
    };
  }

  /**
   * 拖拽框ref回调, 修改ref指向当前拖拽框组件
   */
  handleRndRef(c) {
    this.rnd = c;
  }

  /**
   * 拖拽框点击回调, 设置当前被拖动
   * @param {Object} item 当前选中的拖拽框
   */
  handleRndClick(item) {
    return (...args) => {
      const [e] = args;
      e.stopPropagation();
      this.setEditorState({
        id: item.id
      });
    };
  }

  /**
   * 拖拽框拖动开始回调
   * @param {Object} item 当前选中的拖拽框
   */
  handleRndDragStart(item) {
    return (...args) => {
      const [, d] = args;
      this.setEditorState({
        id: item.id,
        pos: {
          left: Math.round(d.x),
          top: Math.round(d.y)
        }
      });
    };
  }

  /**
   * 拖拽框拖动进行中的回调，修改位置信息
   */
  handleRndDrag(...args) {
    const [, d] = args;
    this.setEditorState({
      pos: {
        left: Math.round(d.x),
        top: Math.round(d.y)
      }
    });
  }

  /**
   * 拖拽框结束时的回调，修改位置信息并执行resize操作
   */
  handleRndDragStop(item) {
    return (...args) => {
      const [, d] = args;
      const left = Math.round(d.lastX);
      const top = Math.round(d.lastY);
      // 使用lastX,lastY, 防止mouseUp时鼠标轻微移动造成的偏移
      this.setEditorState({
        pos: {
          left,
          top
        }
      });
      this.handleResize(item.id, { ...item.styles, left, top });
    };
  }

  render() {
    const { id, pos, editor } = this.props;
    const { page, charts } = editor;
    return (
      <div
        id="editor"
        className="editor"
        style={{
          width: page.width,
          height: page.height,
          backgroundColor: page.backgroundColor,
          backgroundImage: `url(${page.backgroundImage})`
        }}
      >
        {
          charts.map(item => (
            <Rnd
              className={classNames({ active: item.id === id })}
              ref={this.handleRndRef}
              size={{
                width: item.styles.width,
                height: item.styles.height
              }}
              position={{
                x: utils.stringToNumber(item.styles.left).value,
                y: utils.stringToNumber(item.styles.top).value
              }}
              dragGrid={[page.gridStep, page.gridStep]}
              minWidth={item.styles.minWidth || 300}
              minHeight={item.styles.minHeight || 190}
              bounds=".editor"
              onClick={this.handleRndClick(item)}
              onDragStart={this.handleRndDragStart(item)}
              onDrag={this.handleRndDrag}
              onDragStop={this.handleRndDragStop(item)}
              onResize={this.handleRndResize(item)}
              key={item.id}
            >
              <NavigatorLine
                show={item.id === id}
                pos={pos}
              />
              <Item item={item} cb={this.handleAddChartEntry} />
              <div className="fade">
                <div className="button-tip">
                  <span title="拷贝" onClick={this.handleCloneChart.bind(this, item.id)} onKeyDown={this.handleCloneChart.bind(this, item.id)}><Icon type="plus-square-o" /></span>
                  <span title="删除" onClick={this.handleRemoveChart.bind(this, item.id)} onKeyDown={this.handleRemoveChart.bind(this, item.id)}><Icon type="delete" /></span>
                </div>
                <div className="resize" />
              </div>
            </Rnd>
          ))
        }
      </div>
    );
  }
}

export default Screen;
