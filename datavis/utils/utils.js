import _ from 'lodash';

function ObjectsDeepAssign(...args) {
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

  if (typeof target !== 'object' && !_.isFunction(target)) {
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
            copyIsArray = _.isArray(copy);
            if (deep && copy && (_.isObject(copy) || copyIsArray)) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && _.isArray(src) ? src : [];
              } else {
                clone = src && _.isObject(src) ? src : {};
              }
              target[name] = ObjectsDeepAssign(deep, clone, copy);
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

function stringToNumber(value) {
  const newValue = value.toString();
  const indexOfPx = newValue.indexOf('px');
  const indexOfPercent = newValue.indexOf('%');
  const result = {};
  if (indexOfPx > -1) {
    result.value = +value.substring(0, indexOfPx);
    result.unit = 'px';
  } else if (indexOfPercent > -1) {
    result.value = +value.substring(0, indexOfPercent);
    result.unit = '%';
  } else {
    result.value = +value;
    result.unit = '';
  }

  return result;
}

function stringToObject(data, str, value) {
  const index = str.indexOf('.');
  let key = '';
  let newStr = '';
  const re = /\[\d\]/; // 数组标识

  if (index > -1) {
    key = str.substring(0, index);
    newStr = str.substring((index + 1), str.length);
    const isArray = re.test(key);
    let i = '';
    if (isArray) {
      const res = re.exec(key);
      i = res[0].slice(1, 2); // 数组索引
      key = key.substring(0, res.index); // 去除数组索引，比如原key为'series[0]',转化为'series'
    }
    for (const k in data) {
      if (k === key) {
        if (isArray) {
          stringToObject(data[k][i], newStr, value);
        } else {
          stringToObject(data[k], newStr, value);
        }
      }
    }
  } else {
    const res = re.exec(str);
    let j = '';
    if (res) {
      j = res[0].slice(1, 2); // 数组索引
      key = str.substring(0, res.index); // 去除数组索引，比如原key为'series[0]',转化为'series'
      data[key][j] = value;
    } else {
      key = str;
      data[key] = value;
    }
  }

  return data;
}

/**
 * 通过字符串key进行对象赋值
 * @param {Object} data 原始对象 { styles: { top: 10 } }
 * @param {String} str  '如：'styles.top'
 * @param {any} value 20
 * @returns 返回: { styles: { top: 20 } }
 */
function setValueByStrkey(data, str, value) {
  const oStr = stringToObject(data, str, value);
  // return ObjectsDeepAssign(true, data, oStr);
  return oStr;
}

function stringify(o) {
  const cache = [];
  return JSON.stringify(o, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
}

/**
 * 根据数据源自定义字段属性转换数据
 * @param  {Object} fields 组件配置至少包含 apis
 * @param  {Array}  source 组件配置数据 data
 */
function convertData(fields = {}, source = []) {
  let data;
  let name = null;
  // console.log('convertData', source);
  if (Object.prototype.toString.call(fields) !== '[object Object]') {
    return;
  }

  if (Array.isArray(source)) {
    data = [];
    for (let i = 0; i < source.length; i++) {
      const value = {};
      Object.keys(fields).map((key) => { // eslint-disable-line
        name = fields[key].mapping ? fields[key].mapping : key;
        value[key] = source[i][name];
      });
      data.push(value);
    }
  } else if (Object.prototype.toString.call(source) === '[object Object]') {
    data = {};
    Object.keys(fields).map((key) => {
      name = fields[key].mapping ? fields[key].mapping : key;
      data[key] = source[name];
    });
  }
  return data;
}

// 表单配置转换成组件配置
function convertOption(...args) {
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

  if (typeof target !== 'object' && !_.isFunction(target)) {
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
            copyIsArray = _.isArray(copy);
            if (deep && copy && (_.isObject(copy) || copyIsArray)) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && _.isArray(src) ? src : [];
              } else {
                clone = src && _.isObject(src) ? src : {};
              }
              if ({}.hasOwnProperty.call(copy, 'children')) {
                if ({}.hasOwnProperty.call(copy, 'type') && copy.type === 'array') {
                  target[name] = copy.default;
                } else {
                  target[name] = convertOption(deep, clone, copy.children);
                }
              } else if ({}.hasOwnProperty.call(copy, 'default')) {
                target[name] = copy.default;
              } else {
                target[name] = convertOption(deep, clone, copy);
              }
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

export default {
  ObjectsDeepAssign,
  stringToNumber,
  setValueByStrkey,
  stringify,
  convertData,
  convertOption
};
