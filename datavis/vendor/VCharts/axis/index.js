/*
 * @Author: xinni
 * @Date: 2017-11-29 18:12:04
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-08-10 13:49:00
 */

import * as d3 from 'd3';
import './axis.scss';

class Axis {
  constructor(myChart) {
    this.myChart = myChart;
  }

  validate(option = []) {
    const self = this;
    self.validateAxisOption(option);
  }

  /**
   * 验证xAxis yAxis配置项
   * @param {object} option vCharts配置
   * @memberof Axis
   */
  validateAxisOption(option) {
    this.validateAxisOptionByType(option, 'xAxis');
    this.validateAxisOptionByType(option, 'yAxis');
  }

  /**
   * 验证xAxis || yAxis配置项
   * @param {object} option vCharts配置
   * @param {string} axisType 轴类型
   * @memberof Axis
   */
  validateAxisOptionByType(option, axisType) {
    const self = this;
    const { myChart } = self;
    const tmpOption = option;
    tmpOption[axisType] = option[axisType] || [];
    if (option[axisType]) {
      option[axisType].forEach((axisOpt, axisIndex) => {
        tmpOption[axisType][axisIndex] =
         self.validateSingleAxisOption(axisOpt, axisType, axisIndex);
      });
    }
    myChart.option[axisType] = tmpOption[axisType];
  }

  /**
   * 初始化xAxis|yAxis参数
   * @param {objecr} axisOpt 用户传的每一个单轴的配置
   * @param {string} axisType 轴类型
   * @param {number} axisIndex 轴索引
   * @returns 补全后的配置
   * @memberof Axis
   */
  validateSingleAxisOption(axisOpt, axisType, axisIndex) {
    const self = this;
    const { myChart } = self;
    const defaultOption = {
      // 是否显示
      show: true,
      // 位置 'xAxis' - 'bottom'|'top' 'yAxis' - 'left'|'right'
      // 缺失时 xAxis.position 默认为'bottom',yAxis.position 默认为'left'
      position: axisType === 'xAxis' ? 'bottom' : 'left',
      // 相对于初始位置的偏移长度，x 'bottom' + 下偏移，x 'top' + 上偏移， y 'left' + 左偏移，y 'right' + 右偏移
      offset: 0,
      // 坐标轴类型，'xAxis' - 'category'|'value' 'yAxis' - 'value'|'category'
      // 缺失时 xAxis.type 默认为'category',yAxis.type 默认为'value'
      type: axisType === 'xAxis' ? 'category' : 'value',
      // 轴标注
      name: '',
      // 坐标轴名称的文字样式。
      nameTextStyle: {
        // 坐标轴名称的颜色，默认取 axisLine.lineStyle.color。
        color: null,
        // 坐标轴名称文字字体的风格。 'normal'|'italic'|'oblique'
        fontStyle: 'normal',
        // 坐标轴名称文字字体的粗细 'normal'|'bold'|'bolder'|'lighter'|100 | 200 | 300 | 400...
        fontWeight: 'normal',
        // 坐标轴名称文字的字体系列  还可以是 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
        fontFamily: 'sans-serif',
        // 坐标轴名称文字的字体大小
        fontSize: 12
      },
      // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      // boundaryGap: true, 类目轴中 boundaryGap 可以配置为 true 和 false。
      // 默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
      // boundaryGap: ['10%', '10%'] 非类目轴，包括时间，数值，对数轴，boundaryGap是一个两个值的数组，
      // 分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比。
      boundaryGap: null,
      // 轴标注偏移长度，x + 右偏移，x - 左偏移，y + 上偏移，y - 下偏移
      nameGap: 15,
      // 坐标轴的分割段数，需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
      // 在类目轴中无效。
      splitNumber: 5,
      // 坐标轴轴线相关设置。
      axisLine: {
        // 是否显示坐标轴轴线。
        show: true,
        // 坐标轴线线的样式。
        lineStyle: {
          // 坐标轴线线的颜色。
          color: myChart.theme.mainColor || myChart.util.config.mainColor,
          // 坐标轴线线的宽度。
          width: 1,
          // 坐标轴线线的透明度。
          opacity: 1
        }
      },
      // 坐标轴刻度相关设置。
      axisTick: {
        // 是否显示坐标轴刻度。
        show: true,
        // 坐标轴刻度的长度。
        length: 5,
        // 刻度线的样式。
        lineStyle: {
          // 刻度线的颜色，默认取 axisLine.lineStyle.color。
          color: null,
          // 刻度线的宽度
          width: 1,
          // 刻度线的透明度
          opacity: 1
        }
      },
      // 坐标轴刻度标签的相关设置。
      axisLabel: {
        // 是否显示刻度标签。
        show: true,
        // 刻度标签与轴线之间的距离。
        margin: 12,
        // 刻度标签的内容格式器。
        formatter: d => d,
        // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。
        rotate: 0,
        // 刻度标签文字的颜色，默认取 axisLine.lineStyle.color。支持回调函数。
        color: null,
        // color: (d, i, nodes)=> {
        //   return i > 0 ? '#ff0000' : '#000';
        // },
        // 文字字体的风格 'normal'|'italic'|'oblique'
        fontStyle: 'normal',
        // 文字字体的粗细 'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 | 300 | 400...
        fontWeight: 'normal',
        // 文字的字体系列 [ default: 'sans-serif' ] 还可以是
        // 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
        fontFamily: 'sans-serif',
        // 文字的字体大小
        fontSize: 12
      },
      // 坐标轴在 grid 区域中的分隔线。
      splitLine: {
        // 是否显示分隔线。默认数值轴显示，类目轴不显示。
        show: null,
        // 分割线的样式。
        lineStyle: {
          // 分割线的颜色
          color: '#ccc',
          // 分割线的宽度
          width: 1,
          // 分割线的透明度
          opacity: 1
        }
      },
      // 坐标轴的值域
      data: []
    };

    // 无历史配置时取初始化配置
    let currentOption = defaultOption;

    // 有历史配置时取历史配置
    if (myChart.option[axisType] && myChart.option[axisType][axisIndex]) {
      // 清除domain(需重新计算)
      if (myChart.option[axisType][axisIndex].type !== 'category') {
        myChart.option[axisType][axisIndex].data = [];
      }
      currentOption = myChart.option[axisType][axisIndex];
    }

    // 补全axisOpt缺失的值
    myChart.util.ObjectsDeepAssign(true, currentOption, myChart.theme.axis || {}, axisOpt);

    if (Array.isArray(currentOption.data)) {
      if (currentOption.data.length > 0) {
        currentOption.type = 'category';
      } else {
        currentOption.type = 'value';
      }
    }

    if (currentOption.boundaryGap === null) {
      currentOption.boundaryGap = currentOption.type === 'category' ? true : ['10%', '10%'];
    }

    if (currentOption.splitLine.show === null) {
      currentOption.splitLine.show = false;
      if (currentOption.type === 'value') currentOption.splitLine.show = true;
    }

    if (currentOption.axisTick.lineStyle.color === null) {
      currentOption.axisTick.lineStyle.color = currentOption.axisLine.lineStyle.color;
    }

    if (currentOption.axisLabel.color === null) {
      currentOption.axisLabel.color = currentOption.axisLine.lineStyle.color;
    }

    if (currentOption.nameTextStyle.color === null) {
      currentOption.nameTextStyle.color = currentOption.axisLine.lineStyle.color;
    }

    return currentOption;
  }

  /**
   * 计算每条坐标轴的值域
   * @memberof Axis
   */
  setAxisDomain() {
    const self = this;
    const { myChart } = self;
    // 参与axis的domain计算的组件类型组成的数组
    const axisRequireConfig = myChart.util.config.axisRequire;

    axisRequireConfig.forEach((componentType) => {
      if (myChart.option.series[componentType]) {
        self.setAxisData(myChart.option.series[componentType]);
      }
    });

    self.setZeroScale();
  }

  /**
   * 有负值出现时把所有value类型的轴的正负值设为等比例以保证0刻度线出现在同一条直线上
   * @param {object} option VCharts配置
   * @memberof Axis
   */
  setZeroScale() {
    const self = this;
    const { myChart } = self;
    Axis.syncZeroScale(myChart.option.xAxis);
    Axis.syncZeroScale(myChart.option.yAxis);
  }
  /**
   * 检测option.xAxis | option.yAxis ，有负值时同步所有的相应轴的正负比例
   * @param {array} axisOpts VCharts配置里的xAxis配置或yAxis配置
   * @memberof Axis
   */
  static syncZeroScale(axisOpts) {
    // 负轴和正轴的长度比
    let minScale = 0;
    axisOpts.forEach((axisOpt) => {
      if (axisOpt.type === 'value' && axisOpt.data[0] < 0) {
        minScale = d3.min([minScale, axisOpt.data[0] / axisOpt.data[1]]);
      }
    });

    axisOpts.forEach((axisOpt) => {
      if (axisOpt.type === 'value' && axisOpt.data.length > 1) {
        if (axisOpt.data[1] > 0) {
          Object.assign(axisOpt, { data: [minScale * axisOpt.data[1], axisOpt.data[1]] });
          // axisOpt.data[0] = minScale * axisOpt.data[1];
        } else {
          Object.assign(axisOpt, { data: [axisOpt[0], axisOpt.data[0] / minScale] });
          // axisOpt.data[1] = axisOpt.data[0] / minScale;
        }
      }
    });
  }

  /**
   * 设置每个相应坐标轴(x,y轴)的domain
   * @param {object} option VCharts配置
   * @param {array} typeSeries 每种类型的组件对应的数据集合
   * @memberof Axis
   */
  setAxisData(typeSeries) {
    const self = this;
    const { myChart } = self;
    typeSeries.forEach((d) => {
      // d.data为二维数组时的处理
      if (Array.isArray(d.data[0])) {
        const xAxisData = [];
        const yAxisData = [];
        d.data.forEach((itemData) => {
          xAxisData.push(itemData[0]);
          yAxisData.push(itemData[1]);
        });
        Axis.updateAxisData(myChart.option.xAxis[d.xAxisIndex], xAxisData);
        Axis.updateAxisData(myChart.option.yAxis[d.yAxisIndex], yAxisData);
      } else if ( // x轴为'value' y轴为'category'时图形顺时针旋转90°
        myChart.option.xAxis.length > 0 &&
          myChart.option.xAxis[d.xAxisIndex].type !== 'category'
      ) {
        Axis.updateAxisData(myChart.option.xAxis[d.xAxisIndex], d.data);
      } else if (
        myChart.option.yAxis.length > 0 &&
          myChart.option.yAxis[d.yAxisIndex].type !== 'category'
      ) {
        Axis.updateAxisData(myChart.option.yAxis[d.yAxisIndex], d.data);
      }
    });
  }

  /**
   * 更新非category轴的值域
   * @param {object} axis option.xAxis[i]或 option.yAxis[i]
   * @param {array} data 单一类目的数据
   * @memberof Axis
   */
  static updateAxisData(axis, data) {
    let minData;
    let maxData;
    let tmpData = data;
    if (axis.data) {
      tmpData = axis.data.concat(data);
    }
    minData = d3.min(tmpData);
    maxData = d3.max(tmpData);
    if (minData > 0) minData = 0;
    if (maxData < 0) maxData = 0;
    Object.assign(axis, { data: [minData, maxData] });
    // axis.data = [minData, maxData];
  }

  init() {
    this.initAxis('xAxis');
    this.initAxis('yAxis');
    this.initZeroLine();
  }

  /**
   * 生成x|y轴
   * @param {string} axisType 轴类型
   * @memberof Axis
   */
  initAxis(axisType) {
    const self = this;
    const { myChart } = self;
    const axisOpts = myChart.option[axisType];
    if (axisOpts.length === 0) {
      return;
    }
    self.scaleType = {
      xAxis: 'xScale',
      yAxis: 'yScale'
    };

    // scale缓存
    myChart[self.scaleType[axisType]] = [];

    self.axis = self.axis || myChart.grid.append('g').classed('axis', true);
    // 删除多余的轴
    self.axis
      .selectAll(`g.${axisType}`)
      .data(axisOpts)
      .exit()
      .remove();
    axisOpts.forEach((axisOpt, axisIndex) => {
      self.initSingleAxis(axisOpt, axisType, axisIndex);
      self.initAxisName(axisOpt, axisType, axisIndex);
      self.initAxisLine(axisOpt, axisType, axisIndex);
      self.initAxisTick(axisOpt, axisType, axisIndex);
      self.initAxisLabel(axisOpt, axisType, axisIndex);
      self.initSplitLine(axisOpt, axisType, axisIndex);
    });
  }

  /**
   * 生成单轴
   * @param {object} axisOpt 单轴的配置项
   * @param {string} axisType 单轴的类型('xAxis','yAxis')
   * @param {number} axisIndex 单轴在数组中的索引值
   * @memberof Axis
   */
  initSingleAxis(axisOpt, axisType, axisIndex) {
    const self = this;
    const { myChart } = self;
    let scale = null;

    if (axisOpt.type === 'value') {
      scale = d3.scaleLinear();
      if (Array.isArray(axisOpt.boundaryGap) && axisOpt.data.length > 1) {
        // 数值轴的domain依据boundaryGap做相应缩放
        const { data } = axisOpt;
        data[0] *= 1 + myChart.util.PercentToFloat(axisOpt.boundaryGap[0]);
        data[1] *= 1 + myChart.util.PercentToFloat(axisOpt.boundaryGap[1]);
        Object.assign(axisOpt, { data });
      }
    } else if (axisOpt.type === 'category') {
      if (axisOpt.boundaryGap === false) {
        scale = d3.scalePoint();
      } else {
        scale = d3.scaleBand();
      }

      scale.padding(0);
    }
    scale.domain(axisOpt.data);
    if (axisType === 'xAxis') {
      scale.range([0, myChart.width]);
    } else {
      scale.range([myChart.height, 0]);
    }
    if (axisOpt.type === 'value' && axisOpt.data.length > 1) {
      if (axisOpt.data[0] >= 0) {
        scale.nice(axisOpt.splitNumber);
        scale.tickValues = Axis.computeTickValues(scale.domain(), axisOpt.splitNumber - 1);
      } else {
        Axis.niceDomain(scale, axisOpt.splitNumber - 1);
      }

      scale.step = () => d3.tickStep(0, myChart.height, scale.ticks().length);
    }
    scale.type = axisOpt.type;
    myChart[self.scaleType[axisType]].push(scale);

    let axis = null;
    let translate = null;
    const offset = parseFloat(axisOpt.offset);
    switch (axisOpt.position) {
      case 'top':
        axis = d3.axisTop(scale);
        translate = [0, offset * -1];
        break;
      case 'bottom':
        axis = d3.axisBottom(scale);
        translate = [0, myChart.height + offset];
        break;
      case 'left':
        axis = d3.axisLeft(scale);
        translate = [offset * -1, 0];
        break;
      case 'right':
        axis = d3.axisRight(scale);
        translate = [myChart.width + offset, 0];
        break;
      default:
        axis = d3.axisTop(scale);
        translate = [0, offset * -1];
    }

    if (axisOpt.type === 'value' && axisOpt.data.length > 1) {
      axis.tickValues(scale.tickValues);
    }

    self.axis
      .selectAll(`g.${axisType}.${axisType}-${axisIndex}`)
      .data(new Array(1))
      .enter()
      .append('g')
      .classed(`${axisType} ${axisType}-${axisIndex} ${axisOpt.position}`, true);

    self.axis
      .select(`g.${axisType}.${axisType}-${axisIndex}`)
      .classed('no-boundary-gap', axisOpt.type === 'value' || axisOpt.boundaryGap === false)
      .attr('transform', `translate(${translate[0]},${translate[1]})`)
      .call(axis)
      // show
      .style('display', axisOpt.show === false ? 'none' : '');

    self.axis.classed(axisOpt.position, true);
  }

  static niceDomain(scale, splitNumber) {
    const domain = scale.domain();
    let y1 = domain[1];
    let y2 = domain[0] * -1;
    const n = splitNumber;
    let y1SplitNumber = Axis.computeSplitNumber(y1, y2, n);
    let y2SplitNumber = Axis.computeSplitNumber(y2, y1, n);
    if (!Axis.isInteger(y1SplitNumber) && n > 1) {
      y1SplitNumber = Axis.computeSplitNumber(y1, y2, n - 1);
      y2SplitNumber = Axis.computeSplitNumber(y2, y1, n - 1);

      if (Axis.isInteger(y1SplitNumber)) {
        const Y1SplitNumber = y1SplitNumber + 1;
        y1 *= Y1SplitNumber / y1SplitNumber;
        y1SplitNumber = Y1SplitNumber;
      } else {
        const Y1SplitNumber = Math.ceil(y1SplitNumber);
        const Y2SplitNumber = Math.ceil(y2SplitNumber);
        y1 *= Y1SplitNumber / y1SplitNumber;
        y2 *= Y2SplitNumber / y2SplitNumber;
        [y1SplitNumber, y2SplitNumber] = [Y1SplitNumber, Y2SplitNumber];
      }
    }

    y1 = parseInt(y1, 10);
    y2 = parseInt(y2, 10);
    const y1TickValues = Axis.computeTickValues([0, y1], y1SplitNumber);
    const y2TickValues = Axis.computeTickValues([-y2, 0], y2SplitNumber);

    const tickValues = [...new Set(y2TickValues.concat(y1TickValues))];
    Object.assign(scale, { tickValues });
    scale.domain([-y2, y1]);
  }

  static computeTickValues(range = [], count = 1) {
    const tickValues = [];
    if (range.length < 2) {
      return false;
    }

    const gap = (range[1] - range[0]) / count;
    tickValues.push(range[0]);
    for (let i = 1; i < count; i++) {
      const val = parseInt(range[0] + (i * gap), 10);
      tickValues.push(val);
    }

    tickValues.push(range[1]);
    return tickValues;
  }

  static computeSplitNumber(x, y, n) {
    return (x / (x + y)) * n;
  }

  static isInteger(value) {
    return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value;
  }

  /**
   * 生成坐标轴名称
   * @param {object} axisOpt 单轴的配置项
   * @param {string} axisType 单轴的类型('xAxis','yAxis')
   * @param {number} axisIndex 单轴在数组中的索引值
   * @memberof Axis
   */
  initAxisName(axisOpt, axisType, axisIndex) {
    const self = this;
    let translate = null;

    if (axisType === 'xAxis') {
      translate = [self.myChart.width + axisOpt.nameGap, 6];
    } else {
      translate = [0, axisOpt.nameGap * -1];
    }

    const nameGap = parseInt(axisOpt.nameGap, 10);
    Object.assign(axisOpt, { nameGap });
    self.myChart.grid
      .select(`g.${axisType}.${axisType}-${axisIndex}`)
      .selectAll('text.label')
      .data(new Array(1))
      .enter()
      .append('text')
      .classed('label', true);

    self.myChart.grid
      .select(`g.${axisType}.${axisType}-${axisIndex}`)
      .select('text.label')
      .attr('transform', `translate(${translate[0]},${translate[1]})`)
      .text(axisOpt.name)
      .style('text-anchor', axisOpt.position === 'left' ? 'end' : 'start')
      .style('fill', axisOpt.nameTextStyle.color)
      .style('font-family', axisOpt.nameTextStyle.fontFamily)
      .style('font-weight', axisOpt.nameTextStyle.fontWeight)
      .style('font-style', axisOpt.nameTextStyle.fontStyle)
      .style('font-size', axisOpt.nameTextStyle.fontSize);
  }

  /**
   * 控制轴线的样式
   * @param {object} axisOpt 单轴的配置项
   * @param {string} axisType 单轴的类型('xAxis','yAxis')
   * @param {number} axisIndex 单轴在数组中的索引值
   * @memberof Axis
   */
  initAxisLine(axisOpt, axisType, axisIndex) {
    const self = this;
    const { myChart } = self;
    myChart.svg
      .select(`g.${axisType}.${axisType}-${axisIndex}`)
      .select('path.domain')
      .style('stroke', axisOpt.axisLine.lineStyle.color)
      .style('stroke-width', axisOpt.axisLine.lineStyle.width)
      .style('opacity', axisOpt.axisLine.lineStyle.opacity)
      .style('display', axisOpt.axisLine.show === false ? 'none' : '');
  }

  /**
   * 控制轴刻度的样式
   * @param {object} axisOpt 单轴的配置项
   * @param {string} axisType 单轴的类型('xAxis','yAxis')
   * @param {number} axisIndex 单轴在数组中的索引值
   * @memberof Axis
   */
  initAxisTick(axisOpt, axisType, axisIndex) {
    const self = this;
    const { myChart } = self;
    const x2Basic = {
      left: -1,
      right: 1,
      top: 0,
      bottom: 0
    };
    myChart.svg
      .select(`g.${axisType}.${axisType}-${axisIndex}`)
      .selectAll('g.tick > line')
      .style('stroke', axisOpt.axisTick.lineStyle.color)
      .style('stroke-width', axisOpt.axisTick.lineStyle.width)
      .style('opacity', axisOpt.axisTick.lineStyle.opacity)
      .attr('x2', parseInt(axisOpt.axisTick.length, 10) * x2Basic[axisOpt.position])
      .style('display', axisOpt.axisTick.show === false ? 'none' : '');
  }

  /**
   * 控制刻度标签的样式
   * @param {object} axisOpt 单轴的配置项
   * @param {string} axisType 单轴的类型('xAxis','yAxis')
   * @param {number} axisIndex 单轴在数组中的索引值
   * @memberof Axis
   */
  initAxisLabel(axisOpt, axisType, axisIndex) {
    const self = this;
    const { myChart } = self;
    const labelPosition = {
      left: ['x', parseInt(axisOpt.axisLabel.margin, 10) * -1],
      right: ['x', parseInt(axisOpt.axisLabel.margin, 10)],
      top: ['y', parseInt(axisOpt.axisLabel.margin, 10) * -1],
      bottom: ['y', parseInt(axisOpt.axisLabel.margin, 10)]
    };
    myChart.svg
      .select(`g.${axisType}.${axisType}-${axisIndex}`)
      .selectAll('g.tick > text')
      .text(axisOpt.axisLabel.formatter)
      .attr(labelPosition[axisOpt.position][0], labelPosition[axisOpt.position][1])
      .style('fill', (d, i, nodeList) => {
        if (typeof axisOpt.axisLabel.color === 'function') {
          return axisOpt.axisLabel.color(d, i, nodeList);
        }
        return axisOpt.axisLabel.color;
      })
      .style('font-style', axisOpt.axisLabel.fontStyle)
      .style('font-weight', axisOpt.axisLabel.fontWeight)
      .style('font-family', axisOpt.axisLabel.fontFamily)
      .style('font-size', axisOpt.axisLabel.fontSize)
      .style('display', axisOpt.axisLabel.show === false ? 'none' : '')
      .style('transform', `rotate(${axisOpt.axisLabel.rotate}deg)`)
      .style('-webkit-transform', `rotate(${axisOpt.axisLabel.rotate}deg)`)
      .style('-ms-transform', `rotate(${axisOpt.axisLabel.rotate}deg)`)
      .style('-moz-transform', `rotate(${axisOpt.axisLabel.rotate}deg)`)
      .style('-o-transform', `rotate(${axisOpt.axisLabel.rotate}deg)`);
  }

  /**
   * 控制坐标轴在 grid 区域中的分隔线的样式
   * @param {object} axisOpt 单轴的配置项
   * @param {string} axisType 单轴的类型('xAxis','yAxis')
   * @param {number} axisIndex 单轴在数组中的索引值
   * @memberof Axis
   */
  initSplitLine(axisOpt, axisType, axisIndex) {
    if (axisOpt.splitLine.show === false) {
      return;
    }
    const self = this;
    const { myChart } = self;
    let splitLineOffset = null;
    let splitLineLength = null;
    switch (axisOpt.position) {
      case 'top':
        splitLineOffset = ['y1', axisOpt.offset];
        splitLineLength = ['y2', myChart.height + axisOpt.offset];
        break;
      case 'bottom':
        splitLineOffset = ['y1', axisOpt.offset * -1];
        splitLineLength = ['y2', (myChart.height * -1) - axisOpt.offset];
        break;
      case 'left':
        splitLineOffset = ['x1', axisOpt.offset];
        splitLineLength = ['x2', myChart.width + axisOpt.offset];
        break;
      case 'right':
        splitLineOffset = ['x1', axisOpt.offset * -1];
        splitLineLength = ['x2', (myChart.width * -1) - axisOpt.offset];
        break;
      default:
        splitLineOffset = ['y1', axisOpt.offset];
        splitLineLength = ['y2', myChart.height + axisOpt.offset];
    }
    myChart.svg
      .select(`g.${axisType}.${axisType}-${axisIndex}`)
      .selectAll('g.tick')
      .classed('split-line', true)
      .classed('min', (d) => {
        const scale = myChart[self.scaleType[axisType]][axisIndex];
        return axisOpt.type === 'value' && d === scale.domain()[0];
      })
      .classed('max', (d) => {
        const scale = myChart[self.scaleType[axisType]][axisIndex];
        return axisOpt.type === 'value' && d === scale.domain()[1];
      })
      .selectAll('line')
      .attr(splitLineOffset[0], splitLineOffset[1])
      .attr(splitLineLength[0], splitLineLength[1])
      .style('stroke', axisOpt.splitLine.lineStyle.color)
      .style('stroke-width', axisOpt.splitLine.lineStyle.width)
      .style('opacity', axisOpt.splitLine.lineStyle.opacity)
      .style('display', d => (axisOpt.type === 'value' && d === 0 ? 'none' : ''));
  }

  /**
   * 画0刻度线
   * @memberof Axis
   */
  initZeroLine() {
    const self = this;
    if (self.axis) {
      self.axis.selectAll('path.zero-line').remove();
    }
    self.initZeroLineByAxisType('xAxis');
    self.initZeroLineByAxisType('yAxis');
  }

  /**
   * x|y轴的0刻度线
   * @param {any} axisType 轴类型
   * @memberof Axis
   */
  initZeroLineByAxisType(axisType) {
    const self = this;
    const { myChart } = self;
    const axisOpts = myChart.option[axisType];
    for (let axisIndex = 0; axisIndex < axisOpts.length; axisIndex++) {
      const axisOpt = axisOpts[axisIndex];
      if (axisOpt.type === 'value' && axisOpt.data[0] < 0) {
        const scale = myChart[self.scaleType[axisType]][axisIndex];
        let zeroLinePoints = null;
        switch (axisType) {
          case 'xAxis': {
            let y1;
            let y2;
            if (axisOpt.position === 'top') {
              y1 = axisOpt.offset;
              y2 = myChart.height + y1;
            } else {
              y1 = 0;
              y2 = -(myChart.height + y1);
            }
            zeroLinePoints = [{ x: scale(0), y: y1 }, { x: scale(0), y: y2 }];
            break;
          }
          case 'yAxis': {
            let x1;
            let x2;
            if (axisOpt.position === 'left') {
              x1 = axisOpt.offset;
              x2 = myChart.width + x1;
            } else {
              x1 = 0;
              x2 = -(myChart.width + x1);
            }
            zeroLinePoints = [{ x: x1, y: scale(0) }, { x: x2, y: scale(0) }];
            break;
          }
          default: {
            let y1;
            let y2;
            if (axisOpt.position === 'top') {
              y1 = axisOpt.offset;
              y2 = myChart.height + y1;
            } else {
              y1 = 0;
              y2 = -(myChart.height + y1);
            }
            zeroLinePoints = [{ x: scale(0), y: y1 }, { x: scale(0), y: y2 }];
          }
        }

        const zeroLineBuilder = d3
          .line()
          .x(d => d.x)
          .y(d => d.y);

        myChart.grid
          .select(`g.${axisType}.${axisType}-${axisIndex}`)
          .append('path')
          .classed(`zero-line ${axisType}-${axisIndex}-zero-line`, true)
          .datum(zeroLinePoints)
          .attr('d', zeroLineBuilder)
          .style('stroke', axisOpt.axisLine.lineStyle.color)
          .style('stroke-width', axisOpt.axisLine.lineStyle.width)
          .style('opacity', 0)
          .transition()
          .duration(myChart.util.config.transitionDurationTime)
          .style('opacity', axisOpt.axisLine.lineStyle.opacity);
        break;
      }
    }
  }
}

export default Axis;
