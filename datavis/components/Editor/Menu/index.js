/*
 * @Author: Jiangang Lu
 * @Date: 2018-09-21 10:04:07
 * @Last Modified by: Jiangang Lu
 * @Last Modified time: 2018-11-02 14:01:29
 */
import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: require('vendor/iconfont/iconfont.js')
});

class Menu extends PureComponent {
  /**
   * 点击菜单组件
   * @param  {} type 组件类型
   * @param  {} requirePath 组件引用路径
   */
  handleClick(type, requirePath) {
    const { onMenuItemClick } = this.props;
    onMenuItemClick(type, requirePath);
  }

  render() {
    return (
      <div className={styles.componentsNav}>
        <ul className={styles.nav}>
          <li title="常规图表">
            <i className={styles.navIcon} />
            <span>图表</span>
            <ul>
              <li onClick={this.handleClick.bind(this, 'bar', 'VCharts/Bar')} onKeyDown={this.handleClick.bind(this, 'bar', 'VCharts/Bar')}>柱状图</li>
              <li onClick={this.handleClick.bind(this, 'line', 'VCharts/Line')} onKeyDown={this.handleClick.bind(this, 'line', 'VCharts/Line')}>折线图</li>
              <li onClick={this.handleClick.bind(this, 'pie', 'VCharts/Pie')} onKeyDown={this.handleClick.bind(this, 'pie', 'VCharts/Pie')}>饼图</li>
              <li onClick={this.handleClick.bind(this, 'scatter', 'VCharts/Scatter')} onKeyDown={this.handleClick.bind(this, 'scatter', 'VCharts/Scatter')}>散点图</li>
              <li onClick={this.handleClick.bind(this, 'radar', 'VCharts/Radar')} onKeyDown={this.handleClick.bind(this, 'radar', 'VCharts/Radar')}>雷达图</li>
              <li onClick={this.handleClick.bind(this, 'tornadoBar', 'VCharts/TornadoBar')} onKeyDown={this.handleClick.bind(this, 'tornadoBar', 'VCharts/TornadoBar')}>风暴图</li>
            </ul>
          </li>
          <li title="地图">
            <i className={styles.navIcon} />
            <span>地图</span>
            <ul>
              <li onClick={this.handleClick.bind(this, 'chinaMap', 'Map/ChinaMap')} onKeyDown={this.handleClick.bind(this, 'chinaMap', 'Map/ChinaMap')}>基础平面地图</li>
            </ul>
          </li>
          <li title="媒体">
            <Icon type="youtube" theme="outlined" />
            <span>媒体</span>
            <ul>
              <li onClick={this.handleClick.bind(this, 'picture', 'Media/Picture')} onKeyDown={this.handleClick.bind(this, 'picture', 'Media/Picture')}>单张图片</li>
              <li onClick={this.handleClick.bind(this, 'picture', 'Media/Carousel')} onKeyDown={this.handleClick.bind(this, 'picture', 'Media/Carousel')}>轮播图</li>
            </ul>
          </li>
          <li title="文字">
            <IconFont type="icon-font-size" width="40" height="40" />
            <span>文本</span>
            <ul>
              <li onClick={this.handleClick.bind(this, 'title', 'Text/Title')} onKeyDown={this.handleClick.bind(this, 'title', 'Text/Title')}>通用标题</li>
              <li onClick={this.handleClick.bind(this, 'table', 'Text/Table')} onKeyDown={this.handleClick.bind(this, 'table', 'Text/Table')}>表格</li>
              {/*
                <li
                  onClick={this.handleClick.bind(this, 'scrollTable', 'Text/ScrollTable')}
                  onKeyDown={this.handleClick.bind(this, 'scrollTable', 'Text/ScrollTable')}
                >滚动表格</li>
              */}
              <li onClick={this.handleClick.bind(this, 'timer', 'Text/Timer')} onKeyDown={this.handleClick.bind(this, 'timer', 'Text/Timer')}>时间器</li>
              <li onClick={this.handleClick.bind(this, 'editor', 'Text/Paragraph')} onKeyDown={this.handleClick.bind(this, 'editor', 'Text/Paragraph')}>多行文本</li>
              <li onClick={this.handleClick.bind(this, 'numberTitleFlop', 'Text/NumberTitleFlop')} onKeyDown={this.handleClick.bind(this, 'numberTitleFlop', 'Text/NumberTitleFlop')}>数字翻牌器</li>
              <li onClick={this.handleClick.bind(this, 'marquee', 'Text/Marquee')} onKeyDown={this.handleClick.bind(this, 'marquee', 'Text/Marquee')}>跑马灯</li>
            </ul>
          </li>
          <li title="索材">
            <Icon type="copy" theme="outlined" />
            <span>素材</span>
            <ul>
              <li onClick={this.handleClick.bind(this, 'border', 'Material/Border')} onKeyDown={this.handleClick.bind(this, 'border', 'Material/Border')}>边框</li>
              <li onClick={this.handleClick.bind(this, 'borderImage', 'Material/BorderImage')} onKeyDown={this.handleClick.bind(this, 'borderImage', 'Material/BorderImage')}>图画边框</li>
            </ul>
          </li>
          <li title="EChart图表">
            <IconFont type="icon-sketch" />
            <span>ECharts</span>
            <ul>
              <li className={styles.subMenu}>
                <span>折线图</span>
                <ul>
                  <li onClick={this.handleClick.bind(this, 'line', 'ECharts/Line')} onKeyDown={this.handleClick.bind(this, 'line', 'ECharts/Line')}>基本折线图</li>
                  <li onClick={this.handleClick.bind(this, 'line', 'ECharts/MultipleLine')} onKeyDown={this.handleClick.bind(this, 'line', 'ECharts/MultipleLine')}>双轴折线图</li>
                </ul>
              </li>
              <li className={styles.subMenu}>
                <span>柱状图</span>
                <ul>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/Bar')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/Bar')}>基本柱状图</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/Bar3')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/Bar3')}>基本柱状图(3个)</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/HorizontalBar')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/HorizontalBar')}>水平柱状图</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/HorizontalBar2')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/HorizontalBar2')}>水平柱状图2</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/HorizontalBar3')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/HorizontalBar3')}>正负水平柱状图</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/LineBar')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/LineBar')}>折柱混合图</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/LineBar2')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/LineBar2')}>折柱混合图2</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/StackBar')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/StackBar')}>堆叠柱状图</li>
                  <li onClick={this.handleClick.bind(this, 'bar', 'ECharts/GroupingBar')} onKeyDown={this.handleClick.bind(this, 'bar', 'ECharts/GroupingBar')}>分组柱状图</li>
                </ul>
              </li>
              <li onClick={this.handleClick.bind(this, 'pie', 'ECharts/Pie')} onKeyDown={this.handleClick.bind(this, 'pie', 'ECharts/Pie')}>饼图</li>
              <li className={styles.subMenu}>
                <span>散点图</span>
                <ul>
                  <li onClick={this.handleClick.bind(this, 'line', 'ECharts/Scatter')} onKeyDown={this.handleClick.bind(this, 'line', 'ECharts/Scatter')}>基本散点图</li>
                  <li onClick={this.handleClick.bind(this, 'line', 'ECharts/Bubble')} onKeyDown={this.handleClick.bind(this, 'line', 'ECharts/Bubble')}>气泡图</li>
                </ul>
              </li>
              <li onClick={this.handleClick.bind(this, 'radar', 'ECharts/Radar')} onKeyDown={this.handleClick.bind(this, 'radar', 'ECharts/Radar')}>雷达图</li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default Menu;
