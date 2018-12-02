/*
 * @Author: ruqichen
 * @Date: 2017-02-27 14:00:00
 */

import * as d3 from 'd3';
import Event from '../api/event.js';

class TornadoBar {
  constructor(myChart) {
    this.myChart = myChart;
  }
  /*
   * 补全缺省的options并缓存，将options挂载到实例上
   * @param {array} options 该种类型图形的数据集合
   */
  validate(options = []) {
    const { myChart } = this;
    this.barGapData = {};
    const $options = options;
    options.forEach((option, index) => {
      $options[index] = this.$validateOption(option, index, options.length);
    });
    myChart.option.series = myChart.option.series || {};
    myChart.option.series.tornadoBar = $options;
    this.$countBarGapData();
  }

  $validateOption(option, index, length) {
    const { myChart } = this;
    const defaultOption = {
      type: 'tornadoBar',
      name: `tornadoBar-${index}`,
      stack: 'bar',
      // 使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
      xAxisIndex: 0,
      // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: this.myChart.util.defaultColor(index, myChart.theme.color),
          borderColor: '#000',
          borderWidth: 0,
          opacity: 1
        }
      },
      barWidth: 1 / (length * 2),
      barGap: '30%',
      data: [],
      formatter: d => d.value
    };
    let currentOption = defaultOption;
    // 检查配置是否已缓存。
    // 根据实例上一次挂载的配置是否存在判断，
    // 若存在，则将上一次配置作为本次配置的初始值, 并且清空当前的data
    if (this.myChart.option.series && Array.isArray(this.myChart.option.series.tornadoBar)) {
      for (let i = 0; i < this.myChart.option.series.tornadoBar.length; i++) {
        if (this.myChart.option.series.tornadoBar[i].name === option.name) {
          this.myChart.option.series.tornadoBar[i].data = [];
          currentOption = this.myChart.option.series.tornadoBar[i];
          break;
        }
      }
    }

    if (option.name === undefined) {
      Object.assign(option, { name: `tornadoBar-${index}` });
    }
    // 合并配置项
    this.myChart.util.ObjectDeepAssign(currentOption, option);

    // 生成barGapData 以计算barGap
    if (this.myChart.option.xAxis[currentOption.xAxisIndex].type === 'category') {
      this.barGapData.xAxis = this.barGapData.xAxis || {};
      if (this.barGapData.xAxis[currentOption.xAxisIndex] === undefined) {
        this.barGapData.xAxis[currentOption.xAxisIndex] = {
          barGap: this.myChart.util.PercentToFloat(currentOption.barGap)
        };
      }
    } else if (this.myChart.option.yAxis[currentOption.yAxisIndex].type === 'category') {
      this.barGapData.yAxis = this.barGapData.yAxis || {};

      if (this.barGapData.yAxis[currentOption.yAxisIndex] === undefined) {
        this.barGapData.yAxis[currentOption.yAxisIndex] = {
          barGap: this.myChart.util.PercentToFloat(currentOption.barGap)
        };
      }
    }

    // 图例
    currentOption.legendColor = currentOption.itemStyle.normal.color;

    // 处理data
    currentOption.dataSource = currentOption.data;

    currentOption.data = currentOption.dataSource.map((d, i) => {
      if (this.myChart.util.isObject(d)) {
        return currentOption.formatter(d, i);
      }
      return d;
    });

    return currentOption;
  }


  $countBarGapData() {
    const { myChart } = this;
    // 以第一类柱形图配置为准
    const tornadoBarOption = myChart.option.series.tornadoBar[0];
    // 根据龙卷风图的特性，y轴是类目型，因此对y轴进行BarGap计算
    this.$countBarPosition(tornadoBarOption, 'yAxis');
  }

  $countBarPosition(option, axisType) {
    const { myChart } = this;
    const axisIndex = `${axisType}Index`;
    if (
      myChart.option[axisType].length > 0 &&
      myChart.option[axisType][option[axisIndex]].type === 'category'
    ) {
      const barGapObj = this.barGapData[axisType][option[axisIndex]];
      barGapObj.barWidths = barGapObj.barWidths || [];
      barGapObj.barGaps = barGapObj.barGaps || [];
      // 柱形宽度占类目宽度的比例
      barGapObj.barWidths.push(myChart.util.PercentToFloat(option.barWidth));
      // 柱形间隔占类目宽度的比例
      barGapObj.barGaps.push(myChart.util.PercentToFloat(option.barWidth) * barGapObj.barGap);
    }
  }

  static countBarStarts(barPosition) {
    const totalBarWidth = d3.sum(barPosition.barWidths);
    const totalBarGap =
      d3.sum(barPosition.barGaps) - barPosition.barGaps[barPosition.barGaps.length - 1];
    // 左间距 使图形居中
    const paddingLeft = (1 - totalBarWidth - totalBarGap) / 2;
    Object.assign(barPosition, { barStarts: [] });
    // barPosition.barStarts = [];
    Object.keys(barPosition.barWidths).forEach((barWidth, index) => {
      let currentBarStart;
      if (index === 0) {
        currentBarStart = paddingLeft;
      } else {
        const preBarStart = barPosition.barStarts[index - 1];
        const preBarWidth = barPosition.barWidths[index - 1];
        const preBarGap = barPosition.barGaps[index - 1];
        currentBarStart = preBarStart + preBarWidth + preBarGap;
      }
      barPosition.barStarts.push(currentBarStart);
    });
  }

  init() {
    this.$initBar();
    // this._initToolTip();
  }
  _initToolTip() {
    const { myChart } = this;
    const wrap = document.getElementById(myChart.wrapSelector.substr(1));

    if (!myChart.toolTip) {
      myChart.toolTip = document.createElement('div');

      wrap.appendChild(myChart.toolTip);
    }

    const gNode = wrap.firstChild.firstChild;

    myChart.toolTip.classList.add('tooltip');

    Event.create('tornadoBar').remove('mousemove');
    Event.create('tornadoBar').remove('mouseleave');

    Event.create('tornadoBar').listen('mousemove', (d, name) => {
      const [x, y] = d3.mouse(gNode);
      myChart.toolTip.classList.add('show');
      myChart.toolTip.style.left = `${x + 90}px`;
      myChart.toolTip.style.top = `${y + 90}px`;
      const html = `<p>${name}</p><p>学生占比（%）：${d.value}</p>`;
      myChart.toolTip.innerHTML = html;
    });
    Event.create('tornadoBar').listen('mouseleave', () => {
      myChart.toolTip.classList.remove('show');
    });
  }
  $initBar() {
    const { myChart } = this;

    myChart.grid
      .selectAll('g.tornadoBars')
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('tornadoBars', true);

    myChart.option.series.tornadoBar.forEach((option) => {
      this.$initSingleBar(option, option.yAxisIndex);
    });
  }
  $initSingleBar(option, index) {
    const { myChart } = this;
    const itemName = myChart.util.AsciiToUnicode(option.name);

    myChart.grid
      .select('g.tornadoBars')
      .selectAll(`g.tornadoBar-item#tornadoBar-item${itemName}`)
      .data(new Array(1))
      .enter()
      .append('g')
      .classed('tornadoBar-item', true)
      .attr('id', `tornadoBar-item${itemName}`, true);

    const barItem = myChart.grid
      .select('g.tornadoBars')
      .select(`g.tornadoBar-item#tornadoBar-item${itemName}`);

    // 对同类(name相同)数据进行处理
    const barsAttribute = option.data.map((d, i, data) => {
      const barAttribute = { value: d };

      // height
      barAttribute.height = myChart.yScale[index].bandwidth()
        * myChart.util.PercentToFloat(option.barWidth);
      // width
      const xScale = myChart.xScale[index];
      barAttribute.width = d < 0 ? (xScale(0) - xScale(d)) : (xScale(d) - xScale(0));

      // fill
      if (typeof option.itemStyle.normal.color === 'function') {
        barAttribute.fill = option.itemStyle.normal.color(d, i, data);
      } else {
        barAttribute.fill = option.itemStyle.normal.color;
      }

      // 合并option.itemStyle的配置
      Object.assign(barAttribute, option.itemStyle.normal);

      // x
      barAttribute.x = d < 0 ? xScale(d) : xScale(0);

      // y
      const yScale = myChart.yScale[index];
      const scaledY = yScale(myChart.option.yAxis[option.yAxisIndex].data[i]);
      const barPosition = this.barGapData.yAxis[option.yAxisIndex];
      if (!Object.prototype.hasOwnProperty.call(barPosition, 'barStarts')) {
        TornadoBar.countBarStarts(barPosition);
      }

      const offsetY = barPosition.barStarts[0] * yScale.step();

      barAttribute.y = scaledY + offsetY;

      return barAttribute;
    });

    let bars = barItem.selectAll('rect.tornadoBar').data(barsAttribute);

    bars.exit().remove();

    bars.enter()
      .append('rect')
      .classed('tornadoBar', true)
      .attr('height', d => d.height)
      .attr('width', 0)
      .attr('y', d => d.y)
      .attr('x', myChart.xScale[option.xAxisIndex](0))
      .style('fill', d => d.fill)
      .style('stroke', d => d.borderColor)
      .style('stroke-width', d => d.borderWidth)
      .style('opacity', d => d.opacity)
      .on('mousemove', d => Event.create('tornadoBar').trigger('mousemove', d, option.name))
      .on('mouseleave', d => Event.create('tornadoBar').trigger('mouseleave', d));

    bars = barItem.selectAll('rect.tornadoBar');
    bars.transition()
      .duration(myChart.util.config.transitionDurationTime)
      .ease(d3.easeExpInOut)
      .attr('height', d => d.height)
      .attr('width', d => d.width)
      .attr('y', d => d.y)
      .attr('x', d => d.x)
      .style('fill', d => d.fill)
      .style('stroke', d => d.borderColor)
      .style('stroke-width', d => d.borderWidth)
      .style('opacity', d => d.opacity);
  }
}

export default TornadoBar;
