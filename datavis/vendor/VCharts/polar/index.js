/*
 * @Author: Jiangang Lu
 * @Date: 2018-04-26 16:47:01
 * @Last Modified by: Jiangang Lu
 * @Last Modified time: 2018-08-16 17:16:25
 */

import * as d3 from 'd3';

import './polar.scss';

class Polar {
  constructor(myChart) {
    this.myChart = myChart;
  }

  validate(option = []) {
    const { myChart } = this;
    const tmpOption = option;
    tmpOption.polar = option.polar || [];

    if (!Array.isArray(option.polar)) {
      tmpOption.polar = [option.polar];
    }

    option.polar.forEach((radar, radarIndex) => {
      tmpOption.polar[radarIndex] = this.validateOption(radar, radarIndex);
    });
    myChart.option.polar = tmpOption.polar;
  }

  validateOption(radarOption, radarIndex) {
    const { myChart } = this;
    const defaultOption = {
      /**
       * radar.center | Array
       * [default: ['50%', '50%']]
       * 极坐标的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
       * 支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
       * 使用示例：
       * // 设置成绝对的像素值
       * center: [400, 300] // 暂不支持
       * // 设置成相对的百分比
       * center: ['50%', '50%']
       */
      center: ['50%', '50%'],
      /**
       * radar.radius | number // 暂不支持, string
       * [default: 75%]
       * 的半径，数组的第一项是内半径，第二项是外半径。
       * 支持设置成百分比，相对于容器高宽中较小的一项的一半
       */
      radius: '75%',
      /**
       * radar.name | Object
       * 雷达图每个指示器名称的配置项
       */
      name: {
        /**
         * radar.name.show | boolean
         * [default: true]
         * 是否显示指示器名称
         */
        show: true,
        /**
         * radar.name.formatter | string.Function
         *
         * 指示器名称显示的格式器。支持字符串和回调函数，如下示例：
         * // 使用字符串模板，模板变量为指示器名称{value}
         * formatter: '【{value}】' // 暂不支持
         * // 使用回调函数，第一个参数是指示器名称，第二个参数是指示器配置项
         * formatter: function(value, indicator) {
         *   return '【' + value + '】';
         * }
         */
        formatter: value => value,
        /**
         * radar.name.color | Color
         * [default: '#333']
         * 文字的颜色
         */
        color: '#333',
        /**
         * radar.name.fontStyle | string
         * [default: 'normal']
         * 文字字体的风格
         * 可选：
         * 'normal'
         * 'italic'
         * 'oblique'
         */
        fontStyle: 'normal',
        /**
         * radar.name.fontWeight | string
         * [default: normal]
         * 文字字体的粗细
         * 可选：
         * 'normal'
         * 'bold'
         * 'bolder'
         * 'lighter'
         * 100 | 200 | 300 | 400...
         */
        fontWeight: 'normal',
        /**
         * radar.name.fontFamily | string
         * [default: 'sans-serif']
         * 文字的字体系列
         * 还可以是 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
         */
        fontFamily: 'sans-serif',
        /**
         * [fontSize description]
         * @type {Number}
         */
        fontSize: 12
      },
      /**
       * radar.splitNumber | number
       * [default: 5]
       * 指示器轴的分割段数。
       */
      splitNumber: 5,
      /**
       * radar.axisLine | Object
       * 坐标轴轴线相关设置
       */
      axisLine: {
        /**
         * radar.axisLine.show | boolean
         * [default: true]
         * 是否显示坐标轴轴线
         */
        show: true,
        /**
         * radar.axisLine.lineStyle | Object
         */
        lineStyle: {
          /**
           * radar.axisLine.lineStyle.color | Color
           * [default: '#333']
           * 坐标轴线线的颜色
           */
          color: '#333',
          width: 1
        }
      },
      splitLine: {
        show: true,
        /**
         * radar.splitLine.lineStyle | Object
         */
        lineStyle: {
          /**
           * radar.splitLine.lineStyle.color | Array.string
           * [default: '#ccc']
           * 分隔线颜色
           */
          color: '#ccc'
        }
      },
      /**
       * radar.indicator[i] | Object
       * 雷达图的指示器，用来指定雷达图中的多个变量（维度），如下示例
       * indicator: [
            { name: '销售（sales）', max: 6500},
            { name: '管理（Administration）', max: 16000, color: 'red'}, // 标签设置为红色
            { name: '信息技术（Information Techology）', max: 30000},
            { name: '客服（Customer Support）', max: 38000},
            { name: '研发（Development）', max: 52000},
            { name: '市场（Marketing）', max: 25000}
          ]
        */
      indicator: [],

      levelCircle: false,
      axisLabel: true,
      areaLine: true,
      areaLinearGradient: false,
      areaLinearGradientOrientation: 'x',
      // areaColors: ['', ''],
      // How much farther than the radius of the outer circle should the labels be placed
      labelFactor: 1.1,
      // The number of pixels after which a label needs to be given a new line
      wrapWidth: 60,
      // The opacity of the area of the blob
      opacityArea: 0.35,
      // The size of the colored circles of each blog
      dotRadius: 3.5,
      // The opacity of the circles of each blob
      opacityCircles: 0.1,
      // The width of the stroke around each blob
      strokeWidth: 2,
      // If true the area and stroke will follow a round path (cardinal-closed)
      roundStrokes: false,
      radians: 2 * Math.PI,
      // Color function
      color: d3.scaleOrdinal(d3.schemeCategory10),
      radarCircle: true,
      radarCircleStyle: 'dashed', // hollow - 空心，dashed - 实心
      unit: ''
    };

    let currentOption = defaultOption;

    if (
      Object.prototype.hasOwnProperty.call(myChart.option, 'polar') &&
      myChart.option.polar[radarIndex]
    ) {
      currentOption = myChart.option.polar[radarIndex];
    }

    // 补全option缺失的值
    myChart.util.ObjectDeepAssign(currentOption, radarOption);
    return currentOption;
  }

  init() {
    this.initPolar();
  }

  initPolar() {
    const self = this;
    const { myChart } = this;
    const { polar } = myChart.option;

    polar.forEach((item, polarIndex) => {
      self.draw(item, polarIndex);
    });
  }

  draw(polar, polarIndex) {
    const { myChart } = this;
    const { grid } = myChart;
    const { indicator } = polar;

    // If the supplied maxValue is smaller than the actual one, replace by the max in the data
    const maxValue = Math.max(0, d3.max(indicator, i => i.max));
    const allAxis = indicator.map(i => i.name); // Names of each axis
    const total = allAxis.length; // The number of different axes
    // Radius of the outermost circle
    const radius = (Math.min(myChart.width / 2) *
      myChart.util.PercentToFloat(polar.radius),
    (myChart.height / 2) * myChart.util.PercentToFloat(polar.radius));
    const angleSlice = (Math.PI * 2) / total; // The width in radians of each "slice"

    // Scale for the radius
    const rScale = d3
      .scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    let gRadar = grid.selectAll(`g.radar-${polarIndex}`).data(new Array(1));

    gRadar = gRadar
      .enter()
      .append('g')
      .merge(gRadar)
      .classed(`radar-${polarIndex}`, true);

    gRadar.exit().remove();

    if (polar.splitLine.show) {
      const levelFactors = d3
        .range(0, polar.splitNumber)
        .map(level => radius * ((level + 1) / polar.splitNumber));

      let levelGroups = grid
        .select(`g.radar-${polarIndex}`)
        .selectAll('g.level-group')
        .data(levelFactors);
      // var levelGroups = g.selectAll('g.level-group').data(levelFactors);

      levelGroups = levelGroups
        .enter()
        .append('g')
        .merge(levelGroups);

      levelGroups.exit().remove();

      levelGroups.attr('class', (d, i) => {
        if (i + 1 === polar.splitNumber) {
          return `level-group level-group-last level-group-${i}`;
        }
        return `level-group level-group-${i}`;
      });

      let levelLine = levelGroups
        .selectAll('.level')
        .data(levelFactor => d3.range(0, total).map(() => levelFactor));

      levelLine = levelLine
        .enter()
        .append('line')
        .merge(levelLine);
      levelLine.exit().remove();

      levelLine
        .attr('class', 'level')
        .attr('x1', (levelFactor, i) =>
          Polar.getHorizontalPosition(i, levelFactor, polar))
        .attr('y1', (levelFactor, i) =>
          Polar.getVerticalPosition(i, levelFactor, polar))
        .attr('x2', (levelFactor, i) =>
          Polar.getHorizontalPosition(i + 1, levelFactor, polar))
        .attr('y2', (levelFactor, i) =>
          Polar.getVerticalPosition(i + 1, levelFactor, polar))
        .attr('stroke', polar.splitLine.lineStyle.color)
        .attr(
          'transform',
          levelFactor =>
            `translate(${(myChart.width * myChart.util.PercentToFloat(polar.center[0])) - levelFactor}, ${(myChart.height * myChart.util.PercentToFloat(polar.center[1])) - levelFactor})`
        );
    } else {
      d3.selectAll('.level-group').remove();
    }

    // Append a g element
    let g = grid
      .select(`g.radar-${polarIndex}`)
      .selectAll('g.g-box')
      .data(new Array(1));

    g = g
      .enter()
      .append('g')
      .merge(g)
      .attr(
        'transform',
        `translate(${myChart.width *
          myChart.util.PercentToFloat(polar.center[0])},${myChart.height *
          myChart.util.PercentToFloat(polar.center[1])})`
      )
      .classed('g-box', 1);

    g.exit().remove();

    if (g.select('#glow')) {
      // Filter for the outside glow
      const filter = g
        .append('defs')
        .append('filter')
        .attr('id', 'glow');
      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '2.5')
        .attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    if (polar.areaLinearGradient) {
      const linearGradient = g
        .append('defs')
        .append('linearGradient')
        .attr('id', 'radarLinearGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      if (polar.areaLinearGradientOrientation.toLowerCase() === 'y') {
        linearGradient.attr('x2', '0%').attr('y2', '100%');
      }

      linearGradient
        .append('stop')
        .attr('offset', '0%')
        .style('stop-color', polar.color(0));

      linearGradient
        .append('stop')
        .attr('offset', '100%')
        .style('stop-color', polar.color(1));
    }

    // Wrapper for the grid & axes
    let axisGrid = g.selectAll('g.axisWrapper').data(new Array(1));

    axisGrid = axisGrid
      .enter()
      .append('g')
      .merge(axisGrid)
      .attr('class', 'axisWrapper');

    axisGrid.exit().remove();

    // Draw the background circles
    if (polar.levelCircle) {
      axisGrid
        .selectAll('.levels')
        .data(d3.range(1, polar.splitNumber + 1).reverse())
        .enter()
        .append('circle')
        .attr('class', 'gridCircle')
        .attr('r', d => (radius / polar.splitNumber) * d)
        // .style('fill', '#cdcdcd')
        .style('stroke', '#cdcdcd')
        .style('fill-opacity', polar.opacityCircles)
        .style('transform', 'scale(.7)');
      // .style('filter', 'url(#glow)');
    }

    if (!polar.axisLine.show) {
      allAxis.length = 0;
    }

    // Create the straight lines radiating outward from the center
    let axis = axisGrid
      .selectAll('.axis')
      .data(allAxis);

    axis = axis.enter()
      .append('g')
      .merge(axis)
      .attr('class', 'axis');

    // Append the axislines
    if (polar.axisLine.show) {
      let line = axis.selectAll('.line').data(new Array(1));

      line = line
        .enter()
        .append('line')
        .merge(line)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('class', 'line')
        // .style('stroke', '#667c9f')
        .style('stroke', polar.axisLine.lineStyle.color)
        .style('stroke-width', `${polar.axisLine.lineStyle.width}px`);

      d3.selectAll('.line')
        .attr(
          'x2',
          (d, i) =>
            rScale(maxValue * 1.0) * Math.cos((angleSlice * i) - (Math.PI / 2))
        )
        .attr(
          'y2',
          (d, i) =>
            rScale(maxValue * 1.0) * Math.sin((angleSlice * i) - (Math.PI / 2))
        );

      line.exit().remove();
    } else {
      d3.select('.axisWrapper').remove();
    }

    axis.exit().remove();

    // Append the labels at each axis
    if (polar.name.show) {
      let legend = axis.selectAll('.legend').data(new Array(1));

      legend = legend
        .enter()
        .append('text')
        .merge(legend)
        .attr('class', 'legend')
        .style('font-style', polar.name.fontStyle)
        .style('font-weight', polar.name.fontWeight)
        .style('font-family', polar.name.fontFamily)
        .style('font-size', polar.name.fontSize)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('stroke-width', 0)
        .attr('fill', polar.name.color);

      legend.exit().remove();

      d3.selectAll('.legend')
        .text((d, i) => polar.name.formatter(allAxis[i]))
        .attr('x', (d, i) =>
          Polar.getTextX(rScale, maxValue, polar, angleSlice, i))
        .attr('y', (d, i) =>
          Polar.getTextY(rScale, maxValue, polar, angleSlice, i))
        .attr('text-anchor', (d, i) => {
          if (i === 0 || i === total / 2) {
            return 'middle';
          } else if (i < total / 2) {
            return 'start';
          }
          return 'end';
        });
    } else {
      d3.selectAll('.legend').remove();
    }
  }

  static getTextX(rScale, maxValue, polar, angleSlice, index) {
    return (
      rScale(maxValue * polar.labelFactor) *
      Math.cos((angleSlice * index) - (Math.PI / 2))
    );
  }

  static getTextY(rScale, maxValue, polar, angleSlice, index) {
    return (
      rScale(maxValue * polar.labelFactor) *
      Math.sin((angleSlice * index) - (Math.PI / 2))
    );
  }

  static getPosition(i, range, polar, factor, func) {
    const tmpFactor = typeof factor !== 'undefined' ? factor : 1;
    return (
      range * (1 - (tmpFactor * func((i * polar.radians) / (polar.indicator.length))))
    );
  }

  static getHorizontalPosition(i, range, polar, factor) {
    return Polar.getPosition(i, range, polar, factor, Math.sin);
  }

  static getVerticalPosition(i, range, polar, factor) {
    return Polar.getPosition(i, range, polar, factor, Math.cos);
  }
}

export default Polar;
