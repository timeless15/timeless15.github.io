/*
 * @Author: xinni
 * @Date: 2017-11-29 14:15:31
 * @Last Modified by: yuxie
 * @Last Modified time: 2018-04-26 17:11:17
 */

class Grid {
  constructor(myChart) {
    this.myChart = myChart;
  }

  validate(option = {}) {
    const { myChart } = this;
    myChart.option.grid = this.validateOption(option);
  }

  validateOption(option) {
    const self = this;
    const { myChart } = self;

    const defaultOption = {
      // 是否显示grid
      show: true,
      // 网格背景色，默认透明。
      backgroundColor: myChart.theme.backgroundColor || 'transparent',
      // 网格的边框颜色。
      borderColor: '#ccc',
      // 网格的边框线宽。
      borderWidth: 0,
      // grid 组件离容器上侧的距离。
      top: 60,
      // grid 组件离容器左侧的距离。
      left: 80,
      // grid 组件离容器下侧的距离。
      bottom: 60,
      // grid 组件离容器右侧的距离。
      right: 80
    };

    let currentOption = defaultOption;
    if (myChart.option.grid) {
      currentOption = myChart.option.grid;
    }

    // 补全option缺失的值
    myChart.util.ObjectDeepAssign(currentOption, option);
    return currentOption;
  }

  init() {
    const self = this;
    const { myChart } = self;
    const option = myChart.option.grid;

    const containerWidth = parseFloat(myChart.wrap.style('width'));
    const containerHeight = parseFloat(myChart.wrap.style('height'));
    const left = self.countPadding(option.left, containerWidth);
    const right = self.countPadding(option.right, containerWidth);
    const top = self.countPadding(option.top, containerHeight);
    const bottom = self.countPadding(option.bottom, containerHeight);

    // 图表最外层的svg
    myChart.svg = myChart.svg || myChart.wrap.append('svg').classed('svg', true);
    myChart.svg.attr('width', containerWidth).attr('height', containerHeight);

    myChart.width = containerWidth - left - right;
    myChart.height = containerHeight - top - bottom;

    myChart.grid = myChart.grid || myChart.svg.append('g').classed('grid', true);

    myChart.grid
      .attr('transform', `translate(${left},${top})`)
      .style('display', () => (option.show ? '' : 'none'))
      .style('fill', option.backgroundColor)
      .style('stroke', option.borderColor)
      .style('stroke-width', option.borderWidth);

    // myChart.gridHtml =
    //   myChart.gridHtml ||
    //   myChart.wrap
    //     .append('div')
    //     .classed('grid-html', true)
    //     .style('position', 'absolute')
    //     .style('top', '0')
    //     .style('left', '0')
    //     .style('width', myChart.width + 'px')
    //     .style('height', myChart.height + 'px')
    //     .style('transform', 'translate(' + left + 'px,' + top + 'px)');
  }

  /**
   * 计算间距
   * @param {any} percent 60||'10%'
   * @param {any} length 容器的宽或高
   * @memberof Grid
   */
  countPadding(percent, length) {
    const self = this;
    const { myChart } = self;
    let realLength;
    const floatPercent = myChart.util.PercentToFloat(percent);
    if (percent.toString().indexOf('%') > -1) {
      realLength = floatPercent * parseFloat(length, 10);
    } else {
      realLength = floatPercent;
    }
    return realLength;
  }
}

export default Grid;
