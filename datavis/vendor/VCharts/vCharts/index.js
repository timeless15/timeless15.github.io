/*
 * @Author: xinni
 * @Date: 2017-08-23 17:43:45
 * @Last Modified by: Jiangang Lu
 * @Last Modified time: 2018-09-14 10:20:13
 */
import * as d3 from 'd3';
import './vCharts.scss';
import '../vcharts.less';
import 'babel-polyfill';
// util类
import Util from '../util/util.js';
// 图表的外层容器
import Grid from '../grid/index.js';
// 图例
import Legend from '../legend/index.js';
// 直角坐标系
import Axis from '../axis/index.js';
// 坐标轴指示器
// import ToolTip from '../toolTip';
// 雷达图坐标系
import Polar from '../polar/index.js';

class VChartsFactory {
  /**
   * 获取子组件构造函数
   * @param vcharts: VCharts实例
   * @param componentType: 子组件类型
   */
  async getComponent(componentType, componentPath) {
    const { prototype } = this.constructor;
    // 已缓存则取缓存
    if (!Object.prototype.hasOwnProperty.call(prototype, componentPath)) {
      // 加载
      const componentModule = await require(`../${componentPath}/index.js`);
      prototype[componentPath] = componentModule.default;
    }
    return { componentType, Component: prototype[componentPath] };
  }
}

class VCharts {
  constructor(wrap, theme) {
    // 缓存加载图表的元素的选择器
    this.wrapSelector = wrap;
    // 缓存加载图表的元素的d3选择器
    this.wrap = d3.select(wrap);
    this.wrap.style('position', 'relative');
    const { prototype } = this.constructor;
    this.theme = {};
    const { hasOwnProperty } = Object.prototype;
    if (hasOwnProperty.call(prototype, 'theme') && hasOwnProperty.call(prototype.theme, theme)) {
      this.theme = prototype.theme[theme];
    }
  }

  async setOption(optionOrigin) {
    const myChart = this;
    myChart.option = myChart.option || {};

    // 挂载util类
    myChart.util = myChart.util || new Util();
    const option = myChart.util.deepCopy(optionOrigin, {});
    myChart.cacheOption = optionOrigin;
    myChart.util.convertSeries(myChart, option);
    myChart.util.loadRequire(option);

    myChart.Grid = myChart.Grid || new Grid(myChart);
    myChart.Legend = myChart.Legend || new Legend(myChart);
    myChart.Axis = myChart.Axis || new Axis(myChart);
    // myChart.ToolTip = myChart.ToolTip || new ToolTip(myChart);
    myChart.Polar = myChart.Polar || new Polar(myChart);


    myChart.chartInstance = myChart.chartInstance || {};

    const vChartsFactory = new VChartsFactory();
    // 动态加载子组件
    const promises = [];
    Object.keys(option.series).forEach((componentType) => {
      if (!myChart.chartInstance[componentType]) {
        const componentPath = myChart.util.importPath(componentType);
        promises.push(vChartsFactory.getComponent(componentType, componentPath));
      }
    });
    await Promise.all(promises).then((components) => {
      components.forEach(({ componentType, Component }) => {
        myChart.chartInstance[componentType] = new Component(myChart);
      });
    });
    myChart.Grid.validate(option.grid);
    myChart.Grid.init();
    myChart.Legend.validate(option.legend);
    myChart.Axis.validate(option);
    // myChart.ToolTip.validate(option.tooltip);
    myChart.Polar.validate(option);

    Object.keys(myChart.chartInstance).forEach((componentType) => {
      if (typeof myChart.chartInstance[componentType].validate === 'function') {
        myChart.chartInstance[componentType].validate(option.series[componentType]);
      }
    });

    myChart.Legend.setLegendData();
    myChart.Axis.setAxisDomain();
    // myChart.ToolTip.setToolTipData(optionOrigin);

    myChart.Legend.init();
    myChart.Axis.init();
    myChart.Polar.init();
    Object.keys(myChart.chartInstance).forEach((componentType) => {
      if (typeof myChart.chartInstance[componentType].init === 'function') {
        myChart.chartInstance[componentType].init();
      }
    });
    // 最后加载，保证鼠标事件绑定的dom节点在图层的最上面
    // myChart.ToolTip.init();
  }

  /**
   * 改变图表尺寸，在容器大小发生改变时需要手动调用。
   * @memberof VCharts
   */
  resize() {
    const myChart = this;
    myChart.setOption(myChart.cacheOption);
  }
}

const vcharts = {
  // 初始化VCharts
  init(wrap, theme = '') {
    return new VCharts(wrap, theme);
  },

  registerTheme(themeName, themeData) {
    const { prototype } = VCharts;
    prototype.theme = prototype.theme || {};
    prototype.theme[themeName] = themeData;
  }
};

export default vcharts;
export { vcharts };
