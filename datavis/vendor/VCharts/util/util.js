/*
 * @Author: xinni
 * @Date: 2017-11-21 14:22:46
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-04-26 16:04:23
 */

import * as d3 from 'd3';
import config from './config';

class Util {
  /**
   * Creates an instance of Util.
   * @param {object} myChart VCharts实例
   * @memberof Util
   */
  constructor() {
    return this.exports();
  }

  /**
   * 配置文件
   * @returns 配置关系
   * @memberof Util
   */
  static config() {
    return config;
  }

  /**
   * 动态加载的组件 type与folder的映射关系
   * @param {string} type series[i].type
   * @returns 组件所在目录名称
   * @memberof Util
   */
  static $importPath(type) {
    const { importPath } = config;
    let folder = '';
    if (Object.prototype.hasOwnProperty.call(importPath, type)) {
      folder = importPath[type];
    } else {
      const $extendItem = importPath.extend.find(p => type.startsWith(p.startsWith));
      const $folder = $extendItem && $extendItem.folder;
      folder = $folder || type;
    }

    return folder;
  }

  /**
   * extend组件type与folder的映射关系(用于extend/index.js 动态加载所需组件)
   * @param {string} type series[i].type
   * @returns 组件所在目录名称
   * @memberof Util
   */
  static extendPath(type) {
    let folder = '';
    if (type.startsWith('extend-')) {
      folder = type.replace('extend-', '');
    } else {
      folder = type;
    }

    return folder;
  }

  /**
   * 数据转换
   * series数组转成以type为key的Object
   * @param {object} option VCharts配置
   * @memberof Axis
   */
  convertSeries(myChart, option) {
    this.myChart = myChart;
    if (option.series) {
      // series数组化
      if (!Array.isArray(option.series)) {
        Object.assign(option, { series: [option.series] });
      }

      const tempSeries = {};
      // 缓存series
      // series数组转成以type为key的Object
      option.series.forEach((s) => {
        tempSeries[s.type] = tempSeries[s.type] || [];
        tempSeries[s.type].push(s);
      });
      Object.assign(option, { series: tempSeries });
    }
  }

  /**
   * 根据依赖配置检查所依赖配置是否存在
   * @param {object} option vCharts配置
   * @memberof Util
   */
  loadRequire(option) {
    const self = this;
    const { myChart } = self;
    const loadRequireConfig = this.config.loadRequire;
    Object.keys(loadRequireConfig).forEach((requiredType) => {
      // 被依赖的组件数据存在时加载依赖组件
      if (option.series[requiredType]) {
        const requireComponents = loadRequireConfig[requiredType];
        requireComponents.forEach((requireComponent) => {
          if (
            (!Object.prototype.hasOwnProperty.call(option, requireComponent) ||
              (Array.isArray(option[requireComponent]) && option[requireComponent].length === 0)) &&
              !Object.prototype.hasOwnProperty.call(myChart.option, requireComponent)
          ) {
            // 初始化时若所依赖配置缺失做补全操作
            option[requireComponent] = [{}]; // eslint-disable-line no-param-reassign
          } else if (!Object.prototype.hasOwnProperty.call(option, requireComponent) &&
            myChart.option[requireComponent]) {
            // update时不传作为不变处理 继承上一次的值
            // 请注意update时传[]会视为删除操作 初始化时的[]会默认新增一个组件
            /* eslint-disable no-param-reassign */
            option[requireComponent] = myChart.option[requireComponent].map(() => ({}));
            /* eslint-enable no-param-reassign */
          } else if (!Array.isArray(option[requireComponent])) {
            /* eslint-disable no-param-reassign */
            option[requireComponent] = [option[requireComponent]];
            /* eslint-enable no-param-reassign */
          }
        });
      }
    });
  }

  /**
   * 配置文件
   * @returns 配置关系
   * @memberof Util
   */
  // static config() {
  //   return {
  //     // 组件间的依赖关系，用于被依赖组件配置缺省时的初始化
  //     loadRequire: {
  //       bar: ['xAxis', 'yAxis', 'legend', 'tooltip'],
  //       line: ['xAxis', 'yAxis', 'legend', 'tooltip'],
  //       pie: ['legend', 'tooltip'],
  //       tornadoBar: ['xAxis', 'yAxis', 'legend', 'tooltip'],
  //       scatter: ['xAxis', 'yAxis', 'legend', 'tooltip']
  //     },
  //     // 参与axis的domain计算
  //     axisRequire: ['bar', 'line', 'tornadoBar', 'scatter'],
  //     // 动画持续时间
  //     transitionDurationTime: 1500,
  //     // 主色调
  //     // mainColor: '#fff'
  //     mainColor: '#000'
  //   };
  // }

  /**
   * 根据组件类型获取实例名称
   * 'xAxis' -- 'XAxis'
   * @param {string} componentType 组件类型
   * @returns 实例名称
   * @memberof Util
   */
  static getInstanceName(componentType) {
    const $componentType = componentType.toString().trim();
    const specialName = {
      xAxis: 'Axis',
      yAxis: 'Axis'
    };
    if ($componentType.length > 0) {
      if (specialName[$componentType]) {
        return specialName[$componentType];
      }
      return $componentType[0].toUpperCase() + $componentType.substring(1, $componentType.length);
    }
    return $componentType;
  }

  /**
   * 生成渐变色
   * @param {object} color 渐变色配置
   * @returns 渐变色对应的选择器
   * @memberof Util
   */
  initLinearGradient(color) {
    const self = this;
    const { myChart } = self;
    const defaultColor = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: self.defaultColor(0),
          opacity: 1 // 0% 处的颜色
        },
        {
          offset: 1,
          color: self.defaultColor(1),
          opacity: 1 // 100% 处的颜色
        }
      ]
    };

    if (Array.isArray(color.colorStops) && color.colorStops.length > 1) {
      /* eslint-disable no-param-reassign */
      color.colorStops[0] = self.ObjectDeepAssign(defaultColor.colorStops[0], color.colorStops[0]);
      color.colorStops[1] = self.ObjectDeepAssign(defaultColor.colorStops[1], color.colorStops[1]);
      /* eslint-enable no-param-reassign */
    }

    const currentColor = self.ObjectDeepAssign(defaultColor, color);
    currentColor.x = self.PercentToFloat(currentColor.x);
    currentColor.y = self.PercentToFloat(currentColor.y);
    currentColor.x2 = self.PercentToFloat(currentColor.x2);
    currentColor.y2 = self.PercentToFloat(currentColor.y2);
    currentColor.colorStops[0].offset = self.PercentToFloat(currentColor.colorStops[0].offset);
    currentColor.colorStops[1].offset = self.PercentToFloat(currentColor.colorStops[1].offset);

    let defs = myChart.grid.selectAll('defs.linearGradients');
    if (!defs.nodes().length) {
      defs = myChart.grid.append('defs').attr('class', 'linearGradients');
    }
    const colorIndex = defs.selectAll('linearGradient').nodes().length;
    const colorId =
     `${myChart.wrapSelector.replace('.', '').replace('#', '')}-linearGradient-${colorIndex}`;
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', colorId)
      .attr('x1', currentColor.x)
      .attr('y1', currentColor.y)
      .attr('x2', currentColor.x2)
      .attr('y2', currentColor.y2);
    linearGradient
      .append('stop')
      .attr('offset', currentColor.colorStops[0].offset)
      .style('stop-color', currentColor.colorStops[0].color)
      .style('stop-opacity', currentColor.colorStops[0].opacity);
    linearGradient
      .append('stop')
      .attr('offset', currentColor.colorStops[1].offset)
      .style('stop-color', currentColor.colorStops[1].color)
      .style('stop-opacity', currentColor.colorStops[1].opacity);
    return [
      // svg渐变色
      `url(#${colorId})`,
      // css渐变色
      `linear-gradient(90deg, ${currentColor.colorStops[0].color}, ${currentColor.colorStops[1].color})`
    ];
  }

  /**
   * 数值/百分比转数值
   * eg:
   * '50%' -- '0.5'
   * '0.5' -- '0.5'
   * @param {string|number} value 百分比或者数值
   * @returns 入参对应的数值
   * @memberof Util
   */
  static PercentToFloat(value) {
    if (value.toString().indexOf('%') > -1) {
      return parseFloat(value) / 100;
    }
    return parseFloat(value);
  }

  /**
   * 数值/百分比转百分比
   * eg:
   * '0.5' -- '50%'
   * '50%' -- '50%'
   * @param {anstring|number} value 数值或百分比
   * @returns 入参对应的百分比
   * @memberof Util
   */
  static FloatToPercent(value) {
    if (value !== undefined && value.toString().indexOf('%') === -1) {
      return `${parseFloat(value) * 100}%`;
    }
    return value;
  }

  /**
   * Ascii码转Unicode码
   * '你好世界！' -- '-20320-22909-19990-30028-65281'
   * @param {string} content Ascii码
   * @returns Unicode码
   * @memberof Util
   */
  static AsciiToUnicode(content) {
    let result = '';
    for (let i = 0; i < content.length; i++) {
      result += `-${content.charCodeAt(i)}`;
    }
    return result;
  }

  /**
   * Unicode码转Ascii码
   * '-20320-22909-19990-30028-65281' -- '你好世界！'
   * @param {string} content Unicode码
   * @returns Ascii码
   * @memberof Util
   */
  static UnicodeToAscii(content) {
    let result = '';
    const code = content.replace('-', '').split('-');
    code.forEach((c) => {
      result += String.fromCharCode(c);
    });
    return result;
  }

  /**
   * 用于将所有属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
   * 支持多级属性的复制
   * @param {object} target 目标对象
   * @param {object} sources 源对象
   * @memberof Util
   */
  // ObjectsDeepAssign(target, ...sources) {
  //   for (let i = sources.length - 1; i > -1; i--) {
  //     const source = sources[i];
  //     let preSource = null;
  //     if (i > 0) preSource = sources[i - 1];
  //     else preSource = target;
  //     this.ObjectDeepAssign(preSource, source);
  //   }
  //   return target;
  // }
  /**
   * 用于将所有属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
   * 支持多级属性的复制
   * 第一个参数为 true - 深拷贝 false - 浅拷贝
   */
  ObjectsDeepAssign(...args) {
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = args[0] || {};
    let i = 1;
    let deep = false;
    const { length } = args;

    if (typeof target === 'boolean') {
      deep = target;

      target = args[i] || {};
      i++;
    }

    if (typeof target !== 'object' && !this.isFunction(target)) {
      target = {};
    }

    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      options = args[i];
      if (options !== null) {
        for (name in options) {
          if ({}.hasOwnProperty.call(options, name)) {
            src = target[name];
            copy = options[name];

            if (target !== copy) {
              copyIsArray = this.isArray(copy);
              if (deep && copy && (this.isObject(copy) || copyIsArray)) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && this.isArray(src) ? src : [];
                } else {
                  clone = src && this.isObject(src) ? src : {};
                }
                target[name] = this.ObjectsDeepAssign(deep, clone, copy);
              } else if (copy !== undefined) {
                target[name] = copy;
              }
            }
          }
        }
      }
    }

    return target;
  }

  /**
   * 用于将所有属性的值从一个源对象复制到目标对象。它将返回目标对象。
   * 支持多级属性的复制
   * @param {object} target 目标对象
   * @param {object} source 源对象
   * @memberof Util
   */
  ObjectDeepAssign(target, source) {
    const self = this;
    Object.keys(source).forEach((s) => {
      if (target[s] !== undefined && self.isObject(target[s]) && self.isObject(source[s])) {
        self.ObjectDeepAssign(target[s], source[s]);
      } else {
        target[s] = source[s]; // eslint-disable-line no-param-reassign
      }
    });

    return target;
  }

  /**
   * 数据类型判断
   * eg.
   * myChart.util.isArray([]) === true
   * myChart.util.isObject({}) === true
   * @returns 含有9种类型判断方法的对象
   * @memberof Util
   */
  static typeOf() {
    const types = [
      'Array',
      'Boolean',
      'Date',
      'Number',
      'Object',
      'Function',
      'RegExp',
      'String',
      'Window',
      'HTMLDocument'
    ];

    const temp = {};
    types.forEach((type) => {
      temp[`is${type}`] = target => Object.prototype.toString.call(target) === `[object ${type}]`;
    });
    return temp;
  }

  /**
   * 组件的默认配色方案
   * @param {number} index 该类目对应的索引
   * @returns 该索引对应的默认色值
   * @memberof Util
   */
  static defaultColor(index, color = config.color) {
    return color[parseInt(index, 10) % color.length];
  }

  /**
   * 随机生成颜色
   * @returns d3.schemeCategory20b下20种颜色的随机一种
   * @memberof Util
   */
  static randomColor() {
    const color20b = d3.schemeCategory20b;
    const randomIndex = Math.floor(Math.random() * 20);
    return color20b(randomIndex);
  }

  /**
   * 深复制 对象和数组
   * @param {object | array} p 复制源
   * @param {object | array} c 目标对象|数组
   * @returns 目标对象|数组
   * @memberof Util
   */
  deepCopy(p, c) {
    const $c = c || (Array.isArray(p) ? [] : {});
    Object.keys(p).forEach((i) => {
      if (typeof p[i] === 'object') {
        $c[i] = Array.isArray(p[i]) ? [] : {};
        this.deepCopy(p[i], $c[i]);
      } else {
        $c[i] = p[i];
      }
    });
    return $c;
  }

  /**
   * 暴露出去的util方法
   * @returns util方法的object
   * @memberof Util
   */
  exports() {
    const util = {
      config: Util.config(),
      importPath: Util.$importPath,
      extendPath: Util.extendPath,
      convertSeries: this.convertSeries,
      loadRequire: this.loadRequire,
      getInstanceName: Util.getInstanceName,
      initLinearGradient: this.initLinearGradient,
      PercentToFloat: Util.PercentToFloat,
      FloatToPercent: Util.FloatToPercent,
      AsciiToUnicode: Util.AsciiToUnicode,
      UnicodeToAscii: Util.UnicodeToAscii,
      ObjectsDeepAssign: this.ObjectsDeepAssign,
      ObjectDeepAssign: this.ObjectDeepAssign,
      defaultColor: Util.defaultColor,
      randomColor: Util.randomColor,
      deepCopy: this.deepCopy
    };
    Object.assign(util, Util.typeOf());
    return util;
  }
}
export default Util;
