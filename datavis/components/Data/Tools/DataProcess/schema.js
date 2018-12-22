
import _ from 'lodash';
import stats from 'src/vendor/simpleStatistics.js';
import CONSTANTS from './constants.js';

const { TYPES, timeFunc, timeUnit } = CONSTANTS;

const TESTS = {
  boolean: x => x === 'true' || x === 'false' || _.isBoolean(x),
  integer: x => TESTS.number(x) && (x = +x) === (~~x), // eslint-disable-line
  number: x => !_.isNaN(+x) && !_.isDate(x),
  date: x => !_.isNaN(Date.parse(x))
};

/**
 * 判断数据值类型
 * @param {*} value 需要判断的值
 * @return {String} type of value ('boolean'/'integer'/'number'/'date'/'string')
 */
function getValueType(value) {
  const types = ['boolean', 'integer', 'number', 'date'];
  for (let i = 0; i < types.length; i++) {
    if (!_.isNull(value) && !TESTS[types[i]](value)) {
      types.splice(i, 1);
      i -= 1;
    }
  }
  // if no types left, return 'string'
  if (types.length === 0) {
    return 'string';
  }
  return types[0];
}

/**
 * 判断需要画图的时间单位
 * @param {Object} stats 时间统计数据
 */
function timeUnique(timeStats) {
  for (let i = 0, len = timeUnit.length; i < len; i++) {
    const u = timeUnit[i];
    if (timeStats[u].distinct !== 1 && Object.keys(timeStats[u].unique) !== 1) {
      return {
        unit: u,
        func: timeFunc[i]
      };
    }
  }
}

/**
 * TYPES.TIME类型数据统计
 * @param {Array} values 时间数组
 */
function timeSummary(values) {
  const timeArr = {
    year: [],
    month: [],
    date: [],
    hours: [],
    minutes: [],
    seconds: []
  };
  const timeStats = {
    year: {},
    month: {},
    date: {},
    hours: {},
    minutes: {},
    seconds: {}
  };
  values.forEach((value) => {
    const time = new Date(value);
    timeArr.year.push(time.getFullYear());
    timeArr.month.push(time.getMonth());
    timeArr.date.push(time.getDate());
    timeArr.hours.push(time.getHours());
    timeArr.minutes.push(time.getMinutes());
    timeArr.seconds.push(time.getSeconds());
  });
  timeUnit.forEach((key) => {
    timeStats[key] = stats.profile(timeArr[key]);
  });
  timeStats.unique = timeUnique(timeStats);
  return timeStats;
}

/**
 * TYPES.QUANTITATIVE类型数据统计
 * @param {Array} values 数据数组
 */
function binSummary(fieldStats) {
  const { min, max } = fieldStats;
  return Math.round((max - min) / 9);
}

/**
 * 统计数据，获取数据集的schema
 * @param {Array} data table类型数据
 */
function buidDataSchema(data) {
  const schema = {};
  const fields = Object.keys(data[0]);
  fields.forEach((field, index) => {
    const fieldData = _.map(data, field);
    const fieldStats = stats.profile(fieldData);
    const vlType = getValueType(fieldData[0]);
    const { distinct, count } = fieldStats;
    let type = '';
    let binStats = {};
    let timeStats = {};
    if (vlType === 'number') {
      binStats = binSummary(fieldStats);
      type = TYPES.QUANTITATIVE;
    } else if (vlType === 'integer') {
      // TODO 当整数类型的基数相对较低且不同的值小于选项中指定的数量时，使用nominal
      if ((distinct < 40) && (distinct / count < 0.05)) {
        type = TYPES.NOMINAL;
      } else {
        binStats = binSummary(fieldStats);
        type = TYPES.QUANTITATIVE;
      }
    } else if (vlType === 'date') {
      timeStats = timeSummary(fieldData);
      type = TYPES.TIME;
    } else {
      type = TYPES.NOMINAL;
    }
    schema[field] = {
      name: field,
      index,
      binStats,
      timeStats,
      vlType, // 指数据类型（'boolean', 'integer', 'number', 'date', 'string'）
      type, // 指TYPES中的类型
      stats: fieldStats
    };
  });
  return schema;
}


export default buidDataSchema;
