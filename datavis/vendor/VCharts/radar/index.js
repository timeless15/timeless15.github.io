/*
 * @Author: Jiangang Lu
 * @Date: 2018-04-26 16:47:26
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-09-12 10:48:54
 */

import * as d3 from 'd3';

class Radar {
  constructor(myChart) {
    this.myChart = myChart;
  }

  /*
   * 补全缺省的options并缓存，将options挂载到实例上
   * @param {array} options 该种类型图形的数据集合
   */
  validate(options = []) {
    const { myChart } = this;
    const tmpOption = [];
    options.forEach((option, index) => {
      tmpOption[index] = this.validateOption(option, index);
    });
    myChart.option.series = myChart.option.series || {};
    myChart.option.series.radar = tmpOption;
  }

  validateOption(option, index) {
    // console.log(d3.schemeCategory10);
    const { myChart } = this;
    const defaultOption = {
      /**
       * series[i]-radar.type | string
       * [default: 'radar']
       */
      type: 'radar',
      /**
       * series[i]-radar.name | string
       * 系列名称，额头于tooltip的显示，legend的图例筛选，在setOption更新数据和配置项时用于指定对应的系列。
       */
      name: `radar-${index}`,
      /**
       * radar.center | Array
       * [default: ['50%', '50%']]
       * 的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
       * 支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
       * 使用示例：
       * // 设置成绝对的像素值
       * center: [400, 300] // 暂不支持
       * // 设置成相对的百分比
       * center: ['50%', '50%']
       */
      // center: ['50%', '50%'],
      /**
       * radar.radius | number // 暂不支持, string
       * [default: 75%]
       * 的半径，数组的第一项是内半径，第二项是外半径。
       * 支持设置成百分比，相对于容器高宽中较小的一项的一半
       */
      // radius: '75%',
      startAngle: 90,
      /**
       * radar.splitNumber | number
       * [default: 5]
       * 指示器轴的分割段数。
       */
      // splitNumber: 5,
      // levelLine: true,
      // levelCircle: false,
      data: [],
      // axisLabel: true,
      // areaLine: true,
      // areaLinearGradient: false,
      // areaLinearGradientOrientation: 'x',
      // // areaColors: ['', ''],
      // What is the value that the biggest circle will represent
      maxValue: 0,
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
      color: d3.schemeCategory10,
      radarCircle: true,
      // hollow - 空心，dashed - 实心
      radarCircleStyle: 'dashed',
      unit: ''
    };

    let currentOption = defaultOption;
    if (
      myChart.option.series &&
      myChart.option.series.radar &&
      myChart.option.series.radar[index]
    ) {
      currentOption = myChart.option.series.radar[index];
    }

    myChart.util.ObjectDeepAssign(currentOption, option);
    return currentOption;
  }

  init() {
    this.initRadar();
  }

  initRadar() {
    const { myChart } = this;
    const { polar } = myChart.option;
    const radars = {};

    myChart.option.series.radar.forEach((radarItem, radarIndex) => {
      const values = [];
      radarItem.data.forEach((data) => {
        const radar = [];
        data.value.forEach((value) => {
          radar.push({
            axis: '',
            value
          });
        });

        values.push(radar);
      });
      radars[radarIndex] = values;
      this.draw(polar[radarIndex], values, radarIndex);
    });
  }

  draw(polar, values, radarIndex) {
    const data = values;
    const { myChart } = this;
    const { grid } = myChart;
    const { indicator } = polar;

    const g = grid.select(`g.radar-${radarIndex}`).selectAll('.g-box');
    grid
      .select(`g.radar-${radarIndex}`)
      .select('.axisWrapper');

    // If the supplied maxValue is smaller than the actual one, replace by the max in the data
    const maxValue = Math.max(0, d3.max(indicator, i => i.max));

    // Names of each axis
    const allAxis = data[0].map(i => i.axis);
    // The number of different axes
    const total = allAxis.length;
    // Radius of the outermost circle
    const radius = Math.min(
      (myChart.width / 2) * myChart.util.PercentToFloat(polar.radius),
      (myChart.height / 2) * myChart.util.PercentToFloat(polar.radius)
    );
    // The width in radians of each "slice"
    const angleSlice = (Math.PI * 2) / total;

    const rScales = [];

    indicator.forEach((item) => {
      // Scale for the radius
      const rScale = d3
        .scaleLinear()
        .range([0, radius])
        .domain([0, item.max]);
      rScales.push(rScale);
    });

    // The radial line function
    const radarLine = d3
      .radialLine()
      .curve(d3.curveLinearClosed)
      .radius((d, i) => rScales[i](d.value))
      .angle((d, i) => i * angleSlice);

    if (polar.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed);
    }

    // Create a wrapper for the blobs
    let blobWrapper = g.selectAll('.radarWrapper').data(data);

    blobWrapper = blobWrapper
      .enter()
      .append('g')
      .merge(blobWrapper)
      .attr('class', 'radarWrapper');

    blobWrapper.exit().remove();

    if (polar.areaLine) {
      // Append the backgrounds
      let radarArea = g.selectAll('.radarArea').data(data);

      radarArea = radarArea
        .enter()
        .append('path')
        .merge(radarArea);

      radarArea.exit().remove();

      radarArea
        .attr('class', 'radarArea')

        .style('fill', (d, i) => {
          if (typeof polar.color === 'function') return polar.color(i);
          return polar.color[i];
        })
        .style('fill-opacity', polar.opacityArea)
        .on('mouseover', (d, i, nodes) => {
          // Dim all blobs
          grid
            .select(`g.radar-${radarIndex}`)
            .selectAll('.radarArea')
            .transition()
            .duration(200)
            .style('fill-opacity', 0.1);
          // Bring back the hovered over blob
          d3
            .select(nodes[i])
            .transition()
            .duration(200)
            .style('fill-opacity', 0.7);
        })
        .on('mouseout', () => {
          // Bring back all blobs
          grid
            .select(`g.radar-${radarIndex}`)
            .selectAll('.radarArea')
            .transition()
            .duration(200)
            .style('fill-opacity', polar.opacityArea);
        })
        .transition()
        .attr('d', d => radarLine(d));

      if (polar.areaLinearGradient) {
        radarArea
          .style('fill', 'url("#radarLinearGradient")')
          .style('fill-opacity', polar.opacityArea);
      }
    }

    // Create the outlines
    let radarStroke = g.selectAll('.radarStroke').data(data);

    radarStroke = radarStroke
      .enter()
      .append('path')
      .merge(radarStroke);

    radarStroke.exit().remove();

    radarStroke
      .attr('class', 'radarStroke')
      .style('stroke-width', `${polar.strokeWidth}px`)
      .style('stroke', (d, i) => {
        if (typeof polar.color === 'function') return polar.color(i);
        return polar.color[i];
      })
      .style('fill', 'none')
      .style('filter', 'url(#glow)')
      .transition()
      .attr('d', d => radarLine(d));

    // Text indicating at what % each level is
    if (polar.axisLabel) {
      let axisLabel = g
        .selectAll('.axisLabel')
        .data(d3.range(1, polar.splitNumber + 1).reverse());

      axisLabel = axisLabel
        .enter()
        .append('text')
        .merge(axisLabel)
        .attr('class', 'axisLabel')
        .attr('x', 4)
        .attr('y', d => (-d * radius) / polar.splitNumber)
        .attr('dy', '0.4em')
        .style('font-size', '10px')
        .attr('fill', '#a5abba')
        .text(d => ((maxValue * d) / polar.splitNumber).toFixed(0));

      axisLabel.exit().remove();
    }

    if (polar.areaLinearGradient) {
      radarStroke
        .style('stroke', 'url("#radarLinearGradient")')
        .style('fill-opacity', polar.opacityArea);
    }

    if (polar.radarCircle) {
      // Append the circles
      let radarCircle = blobWrapper.selectAll('.radarCircle').data((circleData, i) =>
        circleData.map(d => [d, i]));
      radarCircle = radarCircle
        .enter()
        .append('circle')
        .merge(radarCircle);

      radarCircle.exit().remove();

      radarCircle
        .attr('class', 'radarCircle')
        .style('fill', (d) => {
          if (typeof polar.color === 'function') return polar.color(d[1]);
          return polar.color[d[1]];
        })
        .style('fill-opacity', 0.8)
        .transition()
        .attr('r', polar.dotRadius)
        .attr(
          'cx',
          (d, i) =>
            rScales[i](d[0].value) * Math.cos((angleSlice * i) - (Math.PI / 2))
        )
        .attr(
          'cy',
          (d, i) =>
            rScales[i](d[0].value) * Math.sin((angleSlice * i) - (Math.PI / 2))
        );

      // ///////////////////////////////////////////////////////
      // ////// Append invisible circles for tooltip ///////////
      // ///////////////////////////////////////////////////////

      // Wrapper for the invisible circles on top
      let blobCircleWrapper = g.selectAll('.radarCircleWrapper').data(data);

      blobCircleWrapper = blobCircleWrapper
        .enter()
        .append('g')
        .merge(blobCircleWrapper)
        .attr('class', 'radarCircleWrapper');

      // Append a set of invisible circles on top for the mouseover pop-up
      let radarInvisibleCircle = blobCircleWrapper
        .selectAll('.radarInvisibleCircle')
        .data((invisibleCircleData, i) =>
          invisibleCircleData.map(d => [d, i]));

      radarInvisibleCircle = radarInvisibleCircle
        .enter()
        .append('circle')
        .merge(radarInvisibleCircle);

      radarInvisibleCircle.exit().remove();

      radarInvisibleCircle
        .attr('class', 'radarInvisibleCircle')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', (d, i, nodes) => {
          const newX = parseFloat(d3.select(nodes[i]).attr('cx')) - 10;
          const newY = parseFloat(d3.select(nodes[i]).attr('cy')) - 10;

          grid
            .select(`g.radar-${radarIndex}`)
            .select('.tooltip')
            .attr('x', newX)
            .attr('y', newY)
            .text(d[0].value)
            .transition()
            .duration(200)
            .style('font-size', '12px')
            .style('opacity', 1);
        })
        .on('mouseout', () => {
          grid
            .select(`g.radar-${radarIndex}`)
            .select('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0);
        });

      radarInvisibleCircle
        .transition()
        .attr('r', polar.dotRadius * 1.5)
        .attr(
          'cx',
          (d, i) =>
            rScales[i](d[0].value) * Math.cos((angleSlice * i) - (Math.PI / 2))
        )
        .attr(
          'cy',
          (d, i) =>
            rScales[i](d[0].value) * Math.sin((angleSlice * i) - (Math.PI / 2))
        );

      if (polar.radarCircleStyle === 'hollow') {
        // styles should only be transitioned with css
        radarInvisibleCircle
          .style('fill', '#415157')
          .style('stroke', (d) => {
            if (typeof polar.color === 'function') return polar.color(d[1]);
            return polar.color[d[1]];
          })
          .style('stroke-width', 2);
      }
    }
  }
}

export default Radar;
