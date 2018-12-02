import Utils from 'src/utils/utils.js';

const { hasOwnProperty } = Object.prototype;

// 生成图表
function renderChart({
  id = '', requirePath, chartConfig = {}, data = []
}) {
  if (id && Object.keys(chartConfig).length && requirePath) {
    const Base = require(`brickComponents/${requirePath}/index.js`);
    const Chart = Base.default;
    const chart = new Chart(id, chartConfig);
    chart.render(data);
  }
}

/**
 * 处理数据，判断取静态数据还是接口数据
 */
function handleData(item) {
  const { api, apiData, apis } = item;

  function iterator(target, newSource) {
    Object.keys(target).forEach((name) => {
      if (hasOwnProperty.call(target[name], 'children')) {
        iterator(target[name].children);
      } else {
        // 判断数据来源类型，type等于'api'表示数据来源于接口动态数据,'apiData'表示数据来源于本地静态数据。
        if (target[name].type && target[name].type === 'api') { // eslint-disable-line
          Object.assign(newSource, { [name]: api[name].source });
        }
      }
    });
    return newSource;
  }

  // apis中含有source属性表明组件只有一种数据来源，否则有多种数据来源
  if (hasOwnProperty.call(apis, 'source')) {
    if (apis.source.type === 'api') {
      return api.source.source;
    } else if (apis.source.type === 'apiData') { // eslint-disable-line
      return apiData.source;
    }
  } else {
    // 多种数据来源的情况下，遍历apis中的type(api/apiData)，重新合成组件数据。
    const newSource = Object.assign({}, apiData);
    // 遍历apis
    return iterator(apis, newSource);
  }
}

export default function renderPage({ charts, page }) {
  if (charts && page) {
    const $container = document.getElementsByClassName('preview-container')[0];

    $container.style.cssText = `width: ${page.width};
                                height: ${page.height};
                                background-color: ${page.backgroundColor};
                                background-image: url(${page.backgroundImage});
                                background-repeat: no-repeat;
                                background-size: cover,contain;
                                background-position: center, center;
                                `;

    charts.forEach((item) => {
      const div = document.createElement('div');
      const chartContainer = document.createElement('div');
      const { id, styles, requirePath } = item;
      const chartConfig = Utils.convertOption(true, {}, item.chartConfig);
      // 添加dom节点
      Object.keys(styles).forEach((prop) => {
        div.style.position = 'absolute';
        div.style[prop] = styles[prop];
      });

      chartContainer.setAttribute('id', id);
      chartContainer.style.height = styles.height;

      div.appendChild(chartContainer);
      $container.appendChild(div);

      // 处理数据来源
      const data = handleData(item);
      // 渲染图表组件
      renderChart({
        id,
        requirePath,
        chartConfig,
        data
      });
    });
  }
}
