/* 提示框容器 */
class TooltipContent {
  constructor(myChart, container) {
    // 提示框元素
    this.el = null;
    this.myChart = myChart;
    // 提示框父元素——所绑定的图表
    this.container = container;
    this.init();
  }
  // 初始化提示框容器
  init() {
    const tooltipEl = this.getTooltipEl();

    if (!tooltipEl) {
      this.el = document.createElement('div');
      this.el.classList.add('tooltip');
      this.container.appendChild(this.el);
    } else {
      this.el = tooltipEl;
    }
  }
  // 获取提示框元素
  getTooltipEl() {
    return this.el ? this.el : this.container.getElementsByClassName('tooltip')[0];
  }
  // 填充提示框内容
  setContent(content) {
    this.el.innerHTML = content === null ? '' : content;
  }
  // 设置提示框位置
  moveTo(x, y) {
    const { myChart } = this;

    const { left, top } = myChart.option.grid;
    const { offsetHeight, offsetWidth } = this.el;

    const isOverBottom = (y + offsetHeight + 10) > (myChart.height + top);
    const isOverRight = (x + offsetWidth + 10) > (myChart.width + left);

    this.el.style.top = isOverBottom ? `${y - 10 - offsetHeight}px` : `${y + 10}px`;
    this.el.style.left = isOverRight ? `${x - 10 - offsetWidth}px` : `${x + 10}px`;
  }
  // 隐藏提示框
  hide() {
    this.el.classList.remove('show');
  }
  show() {
    this.el.classList.add('show');
  }
}

export default TooltipContent;
