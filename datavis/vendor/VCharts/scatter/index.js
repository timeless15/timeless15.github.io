/*
 * @Author: ruqichen
 * @Date: 2017-02-27 14:00:00
 */

import * as d3 from 'd3';
import Event from '../api/event.js';

class Scatter {
  constructor(myChart) {
    this.myChart = myChart;
  }
  /*
   * 补全缺省的options并缓存，将options挂载到实例上
   * @param {array} options 该种类型图形的数据集合
   */
  validate(options = []) {
    const { myChart } = this;
    const $options = options;
    options.forEach((option, index) => {
      $options[index] = this.$validateOption(option, index, options.length);
    });
    myChart.option.series = myChart.option.series || {};
    myChart.option.series.scatter = $options;
  }

  $validateOption(option, index) {
    const { myChart } = this;
    const defaultOption = {
      type: 'scatter',
      name: `scatter-${index}`,
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: this.myChart.util.defaultColor(index, myChart.theme.color),
          borderColor: '#000',
          borderWidth: 0,
          opacity: 1,
          // 图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
          shadowBlur: 0,
          shadowColor: this.myChart.util.defaultColor(index, myChart.theme.color),
          // 阴影水平方向上的偏移距离。
          shadowOffsetX: 0,
          // 阴影垂直方向上的偏移距离。
          shadowOffsetY: 0
        }
      },
      // 标记的图形, 目前只支持圆形
      symbol: 'circle',
      // 标记的大小，可以设置成诸如 10 这样单一的数字
      // 如果需要每个数据的图形大小不一样，可以设置为如下格式的回调函数
      // (value: Array|number, params: Object) => number|Array
      // 其中第一个参数 value 为 data 中的数据值。第二个参数params 是其它的数据项参数。
      symbolSize: 10,
      data: []
    };

    let currentOption = defaultOption;
    // 检查配置是否已缓存。
    // 根据实例上一次挂载的配置是否存在判断，
    // 若存在，则将上一次配置作为本次配置的初始值, 并且清空当前的data
    if (this.myChart.option.series && Array.isArray(this.myChart.option.series.scatter)) {
      for (let i = 0; i < this.myChart.option.series.scatter.length; i++) {
        if (this.myChart.option.series.scatter[i].name === option.name) {
          this.myChart.option.series.scatter[i].data = [];
          currentOption = this.myChart.option.series.scatter[i];
          break;
        }
      }
    }

    if (option.name === undefined) {
      Object.assign(option, { name: `scatter-${index}` });
      // option.name = `scatter-${index}`;
    }
    // 合并配置项
    this.myChart.util.ObjectDeepAssign(currentOption, option);

    // 图例
    currentOption.legendColor = currentOption.itemStyle.normal.color;

    // 处理data
    currentOption.dataSource = currentOption.data;

    return currentOption;
  }

  init() {
    this.$initScatter();
    this.$initToolTip();
  }
  /* ToolTip方法 */
  $initToolTip() {
    const { myChart } = this;
    const wrap = document.getElementById(myChart.wrapSelector.substr(1));
    // 判断是否存在toolTip
    if (!myChart.toolTip) {
      myChart.toolTip = document.createElement('div');

      wrap.appendChild(myChart.toolTip);
    }
    // 取鼠标坐标时用到的相对画布节点
    const gNode = wrap.firstChild.firstChild;

    myChart.toolTip.classList.add('tooltip');
    // 清除监听器
    Event.create('scatter').remove('mousemove');
    Event.create('scatter').remove('mouseleave');
    // 添加监听器
    Event.create('scatter').listen('mousemove', (d, name) => {
      // 鼠标相对画布的x,y坐标
      const [x, y] = d3.mouse(gNode);
      myChart.toolTip.classList.add('show');
      myChart.toolTip.style.left = `${x + 90}px`;
      myChart.toolTip.style.top = `${y + 90}px`;
      const html = `<p>地点：${name}</p><p>日期：${d.value[0]}日</p><p>AQI指数: ${
        d.value[1]
      }</p><p>PM2.5指数: ${d.value[2]}</p>`;
      myChart.toolTip.innerHTML = html;
    });
    Event.create('scatter').listen('mouseleave', () => {
      myChart.toolTip.classList.remove('show');
    });
  }
  $initScatter() {
    const { myChart } = this;
    myChart.grid
      .selectAll('g.scatters')
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('scatters', true);

    myChart.option.series.scatter.forEach((option) => {
      this.$initSingleScatter(option);
    });
  }

  $initSingleScatter(option) {
    const { myChart } = this;
    const itemName = myChart.util.AsciiToUnicode(option.name);
    const { symbol } = option;
    const { shadowBlur, shadowOffsetX, shadowOffsetY } = option.itemStyle.normal;

    myChart.grid
      .select('g.scatters')
      .selectAll(`g.scatter-item#scatter-item${itemName}`)
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('scatter-item', true)
      .attr('id', `scatter-item${itemName}`, true);

    const scatterItem = myChart.grid
      .select('g.scatters')
      .select(`g.scatter-item#scatter-item${itemName}`);

    // 插入滤镜filter
    scatterItem
      .selectAll('defs')
      .data(new Array(1))
      .enter()
      .append('defs')
      .append('filter')
      .attr('id', `shadow${itemName}`)
      .attr('width', '120%')
      .attr('height', '120%')
      .append('feOffset')
      .attr('in', 'SourceAlpha')
      .attr('dx', shadowOffsetX)
      .attr('dy', shadowOffsetY);

    const filter = scatterItem.select('defs').select('filter');

    filter
      .selectAll('feGaussianBlur')
      .data(new Array(1))
      .enter()
      .append('feGaussianBlur')
      .attr('stdDeviation', shadowBlur)
      .attr('result', 'blurOut');

    filter
      .selectAll('feMerge')
      .data(new Array(1))
      .enter()
      .append('feMerge');

    const dataMergeNode = [{ in: 'blurOut' }, { in: 'SourceGraphic' }];

    filter
      .select('feMerge')
      .selectAll('feMergeNode')
      .data(dataMergeNode)
      .enter()
      .append('feMergeNode')
      .attr('in', d => d.in);

    // 对同类(name相同)数据进行处理
    const scattersAttribute = option.data.map((d, i, data) => {
      const scatterAttribute = { value: d };
      // x轴坐标x, y轴坐
      const [x, y] = d;

      // fill
      if (typeof option.itemStyle.normal.color === 'function') {
        scatterAttribute.fill = option.itemStyle.normal.color(d, i, data);
      } else {
        scatterAttribute.fill = option.itemStyle.normal.color;
      }

      // 合并option.itemStyle的配置
      Object.assign(scatterAttribute, option.itemStyle.normal);

      // x轴坐标
      const xScale = myChart.xScale[option.xAxisIndex];
      const scaledX = xScale(x);
      scatterAttribute.x = scaledX;

      // y轴坐标
      const yScale = myChart.yScale[option.yAxisIndex];
      const scaledY = yScale(y);
      scatterAttribute.y = scaledY;

      // 对单个点的半径进行计算
      if (myChart.util.isFunction(option.symbolSize)) {
        scatterAttribute.r = option.symbolSize(d);
      } else {
        scatterAttribute.r = option.symbolSize;
      }

      return scatterAttribute;
    });

    // 绘制同类散点图
    let scatters = scatterItem.selectAll(`${symbol}.point`).data(scattersAttribute);

    scatters.exit().remove();

    scatters
      .enter()
      .append(symbol)
      .classed('point', true)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0)
      .style('fill', d => d.fill)
      .style('stroke', d => d.strokeColor)
      .style('stroke-width', d => d.strokeWidth)
      .style('opacity', d => d.opacity)
      .on('mousemove', (d) => {
        Event.create('scatter').trigger('mousemove', d, option.name, option);
      })
      .on('mouseleave', (d) => {
        Event.create('scatter').trigger('mouseleave', d);
      });

    scatters = scatterItem.selectAll(`${symbol}.point`);
    scatters
      .transition()
      .duration(myChart.util.config.transitionDurationTime)
      .ease(d3.easeExpInOut)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .style('fill', d => d.fill)
      .style('stroke', d => d.strokeColor)
      .style('stroke-width', d => d.strokeWidth)
      .style('opacity', d => d.opacity)
      .attr('filter', `url(#shadow${itemName})`);
  }
}

export default Scatter;
