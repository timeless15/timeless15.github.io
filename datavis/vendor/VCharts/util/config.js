const config = {
  // 组件间的依赖关系，用于被依赖组件配置缺省时的初始化
  loadRequire: {
    bar: ['xAxis', 'yAxis', 'legend'],
    line: ['xAxis', 'yAxis', 'legend'],
    pie: ['legend'],
    tornadoBar: ['xAxis', 'yAxis', 'legend'],
    scatter: ['xAxis', 'yAxis', 'legend']
  },
  // 参与axis的domain计算
  axisRequire: ['bar', 'line', 'tornadoBar', 'scatter'],
  // 动画持续时间
  transitionDurationTime: 1500,
  // 主题色
  color: [
    '#c23531',
    '#2f4554',
    '#61a0a8',
    '#d48265',
    '#91c7ae',
    '#749f83',
    '#ca8622',
    '#bda29a',
    '#6e7074',
    '#546570',
    '#c4ccd3'
  ],
  // 主色调
  // mainColor: '#fff'
  mainColor: '#000',
  // series[i].type对应的组件所在目录
  importPath: {
    line: 'line',
    bar: 'bar',
    pie: 'pie',
    scatter: 'scatter',
    tornadoBar: 'tornadoBar',
    extend: [
      {
        startsWith: 'extend-',
        folder: 'extend'
      }
    ]
  }
};

export default config;
