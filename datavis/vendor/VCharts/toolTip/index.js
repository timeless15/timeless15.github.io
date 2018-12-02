import * as d3 from 'd3';

import './tooltip.scss';

import * as Utils from './TooltipUtils';
import TooltipContent from './TooltipContent';

function findIndex(arr, fn) {
  return Array.isArray(arr) ? arr.findIndex(fn) : null;
}

function unique(arr) {
  return Array.from(new Set(arr));
}

function sort(arr) {
  return arr.sort((a, b) => a - b);
}

class ToolTip {
  constructor(myChart) {
    this.myChart = myChart;
  }

  validate(option = []) {
    const { myChart } = this;
    let $option = option;
    if (!Array.isArray(option)) {
      $option = [option];
    }
    $option.forEach((tooltipOpt, tooltipIndex) => {
      $option[tooltipIndex] = this.$validateOption(tooltipOpt, tooltipIndex);
    });
    myChart.option.tooltip = $option;
  }

  $validateOption(tooltipOpt, tooltipIndex) {
    const { myChart } = this;
    const defaultOption = {
      // 是否显示提示框组件，包括提示框浮层和 axisPointer。
      show: true,
      // 触发类型，可选'item', 'axis', 'none'
      // 'item': 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
      // 'axis': 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
      // 'none': 什么都不触发。
      trigger: 'item',
      // 坐标轴指示器配置项。
      // 注意： tooltip.axisPointer 中诸配置项的优先级低于轴上的 axisPointer 的配置项。
      axisPointer: {
        // 指示器类型, 可选'line', 'shadow', 'cross'
        // 'line': 直线指示器
        // 'shadow': 阴影指示器
        // 'cross': 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
        type: 'line',
        // 指示器的坐标轴。
        // 默认情况，坐标系会自动选择显示哪个轴的 axisPointer（默认取类目轴或者时间轴）。
        // 可以是 'x', 'y', 'radius', 'angle'。
        axis: 'auto',
        // 坐标轴指示器的文本标签。
        label: {
          // 是否显示文本标签。如果 tooltip.axisPointer.type 设置为 'cross' 则默认显示标签，否则默认不显示。
          show: false,
          // 文本标签文字的格式化器。
          formatter: null,
          // label距离轴的距离
          margin: 3
        },
        // 当axisPointer.type为'line'时有效
        lineStyle: {
          // 线的颜色
          color: '#555',
          // 线的宽度
          width: 1,
          // 线的类型， 可选'solid', 'dashed', 'dotted'
          type: 'solid'
        },
        // 当axisPointer.type为'shadow'时有效
        shadowStyle: {
          // 填充的颜色
          color: 'rgba(150,150,150,0.3)'
        },
        // 当axisPointer.type为'cross'时有效,表示与axis的type为value轴正交的线
        crossStyle: {
          // 线的颜色,
          color: '#555',
          // 线的宽度
          width: 0.5,
          // 线的类型，可选'solid', 'dashed', 'dotted'
          type: 'dashed'
        }
      },
      formatter: null
    };
    let currentOption = defaultOption;

    if (this.myChart.option.tooltip && myChart.option.tooltip[tooltipIndex]) {
      myChart.option.tooltip[tooltipIndex].data = [];
      currentOption = myChart.option.tooltip[tooltipIndex];
    }

    // 判断类目轴
    let categoryAxis = null;
    if (myChart.option.xAxis.length && myChart.option.yAxis.length) {
      let index = findIndex(myChart.option.xAxis, item => item.type === 'category');
      if (index > -1) {
        categoryAxis = { name: 'xAxis', index };
      } else {
        index = findIndex(myChart.option.yAxis, item => item.type === 'category');
        if (index > -1) {
          categoryAxis = { name: 'yAxis', index };
        }
      }
    }
    const isCategoryAxis = categoryAxis !== null;
    currentOption.isCategoryAxis = isCategoryAxis;
    currentOption.categoryAxis = categoryAxis;

    // 判断数值轴
    let isValueAxis = false;
    if (myChart.option.xAxis.length > 0 && myChart.option.yAxis.length > 0) {
      isValueAxis = myChart.option.xAxis.every(item => item.type === 'value')
                    && myChart.option.yAxis.every(item => item.type === 'value');
    }
    currentOption.isValueAxis = isValueAxis;


    myChart.util.ObjectDeepAssign(currentOption, tooltipOpt);

    const { show, trigger, axisPointer } = currentOption;
    // 判断启用坐标轴指示器
    currentOption.initAxisPointer = show && (trigger === 'axis' || axisPointer.type === 'cross');
    // 判断启用数据项指示器
    currentOption.initItemPointer = show && trigger === 'item';

    return currentOption;
  }

  setToolTipData(opt) {
    const { myChart } = this;
    const {
      isValueAxis,
      isCategoryAxis,
      initAxisPointer,
      initItemPointer
    } = myChart.option.tooltip[0];
    // 判断触发类型-坐标轴(axis)/数据项(item)
    if (initAxisPointer) {
      // 判断类目轴/数值轴，从而采取不同的数据结构策略
      if (isCategoryAxis) {
        this.$setAxisPointerCategoryData(opt);
      } else if (isValueAxis) {
        this.$setAxisPointerValueData(opt);
      }
    } else if (initItemPointer) {
      if (isCategoryAxis) {
        this.$setItemPointerCategoryData();
      } else if (isValueAxis) {
        this.$setItemPointerValueData();
      } else {
        this.$setItemPointerData();
      }
    }
  }
  /* 处理坐标轴指示器(axis)类目轴类型(category)的数据
   * [
   *  [
        {
          xAxisName: '2016-1',
          content: [
            {
              name: '2016年降水量',
              value: '250'
            },
            {
              name: '2016年降雪量',
              value: '200'
            }
          ]

        },
        {
          xAxisName: '2015-1',
          content: [
            {
              name: '2015年降水量',
              value: '240'
            },
            {
              name: '2015年降雪量',
              value: '400'
            }
          ]
        }
      ]
    ]
   */
  $setAxisPointerCategoryData(opt) {
    const { myChart } = this;
    const { series } = opt;
    // 坐标轴类型
    const categoryAxis = myChart.option.tooltip[0].categoryAxis.name;

    if (categoryAxis !== 'none') {
      let $axis = opt[categoryAxis] ? opt[categoryAxis] : myChart.option[categoryAxis];
      $axis = Array.isArray($axis) ? $axis : [$axis];

      const item = [];
      myChart.option.tooltip[0].data = item;
      // 创建数据结构
      for (let i = 0; i < $axis.length; i++) {
        $axis[i].data.forEach((v, k) => {
          const $item = {};
          $item.axisName = v;
          $item.content = [];

          if (Array.isArray(item[k])) {
            item[k].push($item);
          } else {
            item[k] = [];
            item[k].push($item);
          }
        });
      }
      // 填充数据
      if (Array.isArray(series)) {
        for (let j = 0; j < series.length; j++) {
          series[j].data.forEach((v, k) => {
            const $content = {};
            // 数据所在的图形没有名字时给予默认名字$type-$index
            $content.name = series[j].name ? series[j].name : `${series[j].type}-${j}`;
            $content.value = myChart.util.isObject(v) ? series[j].formatter(v) : v;
            // 数据对应的图形颜色
            const $legend = myChart.option.legend[0].data.find(m => m.name === $content.name);
            $content.color = $legend.iconStyle.backgroundColor;

            const $axisIndex = series[j][`${categoryAxis}Index`] ? series[j][`${categoryAxis}Index`] : 0;
            item[k][$axisIndex].content.push($content);
          });
        }
      }
    }
  }
  /* 处理坐标轴指示器(axis)数值轴(value)类型的数据 */
  $setAxisPointerValueData(opt) {
    const { myChart } = this;
    const { series } = opt;
    let xData = [];
    // 不考虑x双轴散点图
    const $callback = v => xData.push(v[0]);
    for (let i = 0, { length } = series; i < length; i++) {
      series[i].data.forEach($callback);
    }
    // 去重
    xData = unique(xData);
    // 排序
    xData = sort(xData);

    myChart.option.tooltip[0].xData = xData;

    const item = [];
    myChart.option.tooltip[0].data = item;
    // 创建数据结构
    xData.forEach((v, k) => {
      const $item = {};
      $item.axisName = v;
      $item.content = [];

      item[k] = $item;
    });

    if (Array.isArray(series)) {
      for (let j = 0; j < series.length; j++) {
        series[j].data.forEach((v, k) => {
          const $content = {};
          // 数据所在的图形没有名字时给予默认名字$type-$index
          $content.name = series[j].name ? series[j].name : `${series[j].type}-${j}`;
          [, $content.y] = v;
          // 数据对应的图形颜色
          const $legend = myChart.option.legend[0].data.find(m => m.name === $content.name);
          $content.color = $legend.iconStyle.backgroundColor;

          item[k].content.push($content);
        });
      }
    }
  }
  /* 处理数据项指示器(item)数值轴类型(value)的数据 */
  $setItemPointerValueData() {
    const { myChart } = this;
    const { series } = myChart.option;
    const $itemPointerData = {};
    myChart.option.tooltip[0].itemPointerData = $itemPointerData;

    // 图表类型key, 同类图表数组item
    for (const [key, item] of Object.entries(series)) {
      $itemPointerData[key] = $itemPointerData[key] ? $itemPointerData[key] : [];
      for (let i = 0; i < item.length; i++) {
        item[i].data.forEach((v) => {
          $itemPointerData[key][i] = $itemPointerData[key][i] ? $itemPointerData[key][i] : [];
          $itemPointerData[key][i].data = $itemPointerData[key][i].data ?
            $itemPointerData[key][i].data : [];

          const $dataItem = {
            axisName: v[0], // 数据名
            content: {
              name: item[i].name, // 系列名称
              value: v[1],
              color: item[i].legendColor
            }
          };
          $itemPointerData[key][i].data.push($dataItem);
        });
      }
    }
  }
  /* 处理数据项指示器(item)类目轴类型(category)的数据 */
  $setItemPointerCategoryData() {
    const { myChart } = this;
    const { series } = myChart.option;
    const $itemPointerData = {};
    myChart.option.tooltip[0].itemPointerData = $itemPointerData;

    // 图表类型key, 同类图表数组item
    for (const [key, item] of Object.entries(series)) {
      $itemPointerData[key] = $itemPointerData[key] ? $itemPointerData[key] : [];
      for (let i = 0; i < item.length; i++) {
        item[i].data.forEach((v, k) => {
          $itemPointerData[key][i] = $itemPointerData[key][i] ? $itemPointerData[key][i] : [];
          $itemPointerData[key][i].data = $itemPointerData[key][i].data ?
            $itemPointerData[key][i].data : [];
          // 类目轴是x轴还是y轴
          const categoryAxis = myChart.option.tooltip[0].categoryAxis.name;
          // 获得对应类目轴
          const $axis = myChart.option[categoryAxis][item[i].xAxisIndex];
          // 类目名
          const $axisName = $axis.data[k];
          // 系列名称
          const $axisValue = item[i].name;
          const $dataItem = {
            axisName: $axisName,
            content: {
              name: $axisValue,
              value: item[i].data[k],
              color: item[i].legendColor
            }
          };
          $itemPointerData[key][i].data.push($dataItem);
        });
      }
    }
  }
  /* 处理数据项指示器(item)无轴类型的数据 */
  $setItemPointerData() {
    const { myChart } = this;
    const { series } = myChart.option;
    const $itemPointerData = {};
    myChart.option.tooltip[0].itemPointerData = $itemPointerData;

    for (const [key, item] of Object.entries(series)) {
      $itemPointerData[key] = $itemPointerData[key] ? $itemPointerData[key] : [];
      for (let i = 0; i < item.length; i++) {
        item[i].data.forEach((v) => {
          $itemPointerData[key][i] = $itemPointerData[key][i] ? $itemPointerData[key][i] : [];
          $itemPointerData[key][i].data = $itemPointerData[key][i].data ?
            $itemPointerData[key][i].data : [];

          const $dataItem = {
            axisName: '访问来源',
            content: {
              name: v.name,
              value: v.value,
              color: v.legendColor
            }
          };
          $itemPointerData[key][i].data.push($dataItem);
        });
      }
    }
  }
  // 绘制tooltip
  init() {
    const {
      initAxisPointer,
      initItemPointer
    } = this.myChart.option.tooltip[0];
    // console.log(this.myChart)
    if (initAxisPointer) {
      this.$initAxisPointer();
    } else if (initItemPointer) {
      this.$initItemPointer();
    }
  }
  // 坐标轴指示器
  $initAxisPointer() {
    const { myChart } = this;

    const tooltipData = myChart.option.tooltip[0].data;

    const wrap = document.getElementById(myChart.wrapSelector.substr(1));

    // 取鼠标坐标时用到的相对画布节点
    const gNode = wrap.firstChild;

    const tooltipContent = new TooltipContent(myChart, wrap);
    // const _tooltipEl = tooltipContent.getTooltipEl();
    // 坐标轴指示器及文本标签的父元素
    let focus;
    // 坐标轴指示器配置项
    const { axisPointer } = myChart.option.tooltip[0];
    const hasRect = wrap.getElementsByClassName('overlayer').length;
    // 重新绑定坐标轴指示器触发图层事件
    if (!hasRect) {
      focus = myChart.grid.append('g')
        .classed('toolTip', true)
        .style('display', 'none');

      focus.append('line')
        .attr('id', 'focusLineX')
        .attr('stroke', axisPointer.lineStyle.color)
        .attr('stroke-width', axisPointer.lineStyle.width)
        .attr('stroke-dasharray', () => {
          let strokeStyle;
          if (axisPointer.lineStyle.type === 'dashed') {
            strokeStyle = '3 3';
          } else if (axisPointer.lineStyle.type === 'dotted') {
            strokeStyle = '1 5';
          }
          return strokeStyle;
        });

      focus.append('line')
        .attr('id', 'focusLineY')
        .attr('stroke', axisPointer.crossStyle.color)
        .attr('stroke-width', axisPointer.crossStyle.width)
        .attr('stroke-dasharray', () => {
          let strokeStyle;
          if (axisPointer.crossStyle.type === 'dashed') {
            strokeStyle = '3 3';
          } else if (axisPointer.crossStyle.type === 'dotted') {
            strokeStyle = '1 5';
          }
          return strokeStyle;
        });

      focus.append('rect')
        .attr('id', 'labelY')
        .attr('width', 50)
        .attr('height', 18)
        .attr('fill', 'rgb(47, 69, 84)');

      focus.append('text')
        .attr('id', 'txtLabelY')
        .attr('fill', '#fff')
        .style('font-size', '12px')
        .attr('text-anchor', 'middle');
    } else {
      focus = myChart.grid.select('.toolTip');
      myChart.grid.select('.overlayer').remove();
    }
    // 绘制指示器触发图层
    const triggerRect = myChart.grid.append('rect')
      .attr('class', 'overlayer')
      .attr('width', myChart.width)
      .attr('height', myChart.height)
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => {
        focus.style('display', 'none');
        tooltipContent.hide();
      });

    // 坐标轴类型判断
    const { isCategoryAxis, isValueAxis } = myChart.option.tooltip[0];

    let xScale = null;
    let yScale = null;
    // 判断是类目轴还是数值轴，从而采取不同策略
    if (isCategoryAxis) {
      const categoryAxisName = myChart.option.tooltip[0].categoryAxis.name;
      let xAxis = null;

      if (categoryAxisName === 'xAxis' || categoryAxisName === 'none') {
        [xScale] = myChart.xScale;
        [yScale] = myChart.yScale;
      } else if (categoryAxisName === 'yAxis') {
        [xScale] = myChart.yScale;
        [yScale] = myChart.xScale;
      }
      [xAxis] = myChart.option[categoryAxisName];

      // 指示器触发层鼠标移动事件
      triggerRect
        .on('mousemove', (d, k, nodes) => {
          let xfocusLineX;
          let currentData = null;
          const mouse = d3.mouse(nodes[k]);
          const $mouse = categoryAxisName === 'xAxis' ? mouse[0] : mouse[1];
          const yfocusLineY = categoryAxisName === 'xAxis' ? mouse[1] : mouse[0];
          const yInverted = yScale.invert(yfocusLineY).toFixed(2);

          if (xAxis.type === 'category') {
            const step = xScale.step();
            // 鼠标距离前一个点的距离
            const partition = ($mouse - (step / 2)) % step;
            // 鼠标距离最近的点是否为前一个点
            // 判断依据：鼠标在两个点之间移动时，如果距离前一个点的距离小于两点之间距离的一半， 则最近的点为前一个点。
            // const i = partition < (step / 2) ?
            //   (Math.floor(($mouse - (step / 2)) / step) > 0 ?
            //     Math.floor(($mouse - (step / 2)) / step) : 0)
            //   : Math.floor(($mouse - (step / 2)) / step) + 1;
            let i;
            if (partition < (step / 2)) {
              if (Math.floor(($mouse - (step / 2)) / step) > 0) {
                i = Math.floor(($mouse - (step / 2)) / step);
              } else {
                i = 0;
              }
            } else {
              i = Math.floor(($mouse - (step / 2)) / step) + 1;
            }

            xfocusLineX = categoryAxisName === 'xAxis' ?
              (xScale(xAxis.data[i]) + (xScale.bandwidth() / 2)) :
              (xScale(xAxis.data[xAxis.data.length - (i + 1)]) + (xScale.bandwidth() / 2));

            currentData = tooltipData[i];
          }

          // 绘制正交指示线
          if (categoryAxisName === 'xAxis') {
            focus.select('#focusLineX')
              .attr('x1', xfocusLineX)
              .attr('y1', myChart.height)
              .attr('x2', xfocusLineX)
              .attr('y2', 0);
            focus.select('#focusLineY')
              .attr('x1', 0)
              .attr('y1', yfocusLineY)
              .attr('x2', myChart.width)
              .attr('y2', yfocusLineY);

            focus.select('#labelY')
              .attr('transform', `translate(${-25 - 30},${yfocusLineY - 9})`);

            focus.select('#txtLabelY')
              .attr('transform', `translate(${-30},${yfocusLineY + 5})`)
              .text(yInverted);
          } else {
            focus.select('#focusLineX')
              .attr('x1', yfocusLineY).attr('y1', myChart.height)
              .attr('x2', yfocusLineY)
              .attr('y2', 0);
            focus.select('#focusLineY')
              .attr('x1', 0).attr('y1', xfocusLineX)
              .attr('x2', myChart.width)
              .attr('y2', xfocusLineX);
            focus.select('#labelY')
              .attr('transform', `translate(${yfocusLineY - 25}, ${myChart.height + 8})`);
            focus.select('#txtLabelY')
              .attr('transform', `translate(${yfocusLineY}, ${myChart.height + 8 + 12})`)
              .text(yInverted);
          }

          // 处理提示框浮动层
          let $html = '';
          // 判断currentData是否存在， 存在则显示提示框，不存在则隐藏提示框
          if (currentData !== undefined) {
            if (!myChart.option.tooltip[0].formatter) {
              for (let i = 0, j = currentData.length; i < j; i++) {
                $html += `<p>${currentData[i].axisName}</p>`;
                for (let m = 0, n = currentData[i].content.length; m < n; m++) {
                  $html += `<p><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${currentData[i].content[m].color}"></span>${currentData[i].content[m].name}:${currentData[i].content[m].value}</p>`;
                }
              }
            }
            tooltipContent.setContent($html);

            const [x, y] = d3.mouse(gNode);
            tooltipContent.moveTo(x, y);

            tooltipContent.show();
          } else {
            tooltipContent.hide();
          }
        });
    } else if (isValueAxis) {
      [xScale] = myChart.xScale;
      [yScale] = myChart.yScale;
      // 寻找离鼠标x坐标最近的数据对应的x值
      const roundX = (x, xData) => {
        // 鼠标的x坐标对应的x值
        const xValue = xScale.invert(x);
        // 距xValue的最小距离，默认为x轴的最大值
        let minGap = xScale.domain()[1];
        // 距xValue最近的x值
        let nearestX;
        // 数据的索引
        let xIndex;

        xData.forEach((v, k) => {
          // 距xValue的距离
          const d = (v - xValue) < 0 ? (v - xValue) * (-1) : v - xValue;

          if (d < minGap) {
            // 更新最小距离
            minGap = d;
            // 更新最小距离对应的x值
            nearestX = v;
            xIndex = k;
          }
        });

        return { x: xScale(nearestX), xIndex };
      };

      triggerRect
        .on('mousemove', (d, k, nodes) => {
          const mouse = d3.mouse(nodes[k]);
          // 数值轴以x为指示器参考轴
          const xMouse = mouse[0];
          const { xData } = myChart.option.tooltip[0];
          // xfocusLineX-坐标轴指示器的x，i-数据的索引
          const { x: xfocusLineX, xIndex: index } = roundX(xMouse, xData);
          const yfocusLineY = mouse[1];
          const yInverted = yScale.invert(yfocusLineY).toFixed(2);

          focus.select('#focusLineX')
            .attr('x1', xfocusLineX).attr('y1', myChart.height)
            .attr('x2', xfocusLineX)
            .attr('y2', 0);

          focus.select('#focusLineY')
            .attr('x1', 0).attr('y1', yfocusLineY)
            .attr('x2', myChart.width)
            .attr('y2', yfocusLineY);

          focus.select('#labelY')
            .attr('transform', `translate(${-25 - 30} , ${yfocusLineY - 9})`);
          focus.select('#txtLabelY')
            .attr('transform', `translate(${-30},${yfocusLineY + 5})`)
            .text(yInverted);

          const currentData = tooltipData[index];
          // 处理提示框浮动层
          let $html = '';
          if (currentData !== undefined) {
            if (!myChart.option.tooltip[0].formatter) {
              $html += `<p>${currentData.axisName}</p>`;
              for (let m = 0, n = currentData.content.length; m < n; m++) {
                $html += `<p><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${currentData.content[m].color}"></span>${currentData.content[m].name}:${currentData.content[m].y}</p>`;
              }
            }
            tooltipContent.setContent($html);

            const [x, y] = d3.mouse(gNode);
            tooltipContent.moveTo(x, y);

            tooltipContent.show();
          } else {
            tooltipContent.hide();
          }
        });
    }
  }
  // 数据项指示器
  $initItemPointer() {
    const { myChart } = this;
    // 数据项指示器的数据
    const { itemPointerData } = myChart.option.tooltip[0];

    const wrap = document.getElementById(myChart.wrapSelector.substr(1));
    // 鼠标移动时参考的图层
    const gNode = wrap.firstChild;
    // 提示框
    const tooltipContent = new TooltipContent(myChart, wrap);
    // 数据线指示器绑定配置
    const { bindItemConfig } = Utils;

    for (const [key, item] of Object.entries(itemPointerData)) {
      const $bindItem = bindItemConfig[key];
      const els = d3.select(wrap).selectAll(`.${key}-item`)
        .data(item);
      els.selectAll(`${$bindItem}`)
        .data(d => d.data)
        .on('mouseout', () => tooltipContent.hide())
        .on('mousemove', (d) => {
          // 处理提示框浮动层
          const currentData = d;
          let $html = '';
          if (!myChart.option.tooltip[0].formatter) {
            $html += `<p>${currentData.axisName}</p>`;
            $html += `<p><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${currentData.content.color}"></span>${currentData.content.name}:${currentData.content.value}</p>`;
          }
          tooltipContent.setContent($html);

          const [x, y] = d3.mouse(gNode);
          tooltipContent.moveTo(x, y);

          tooltipContent.show();
        });
    }
  }
}

export default ToolTip;
