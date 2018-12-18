import * as ss from 'simple-statistics';
import _ from 'lodash';

/**
 *  @param {Array} values 处理数组
 */
var stats = {};

// 统计不同的值，以key-value返回
stats.unique = function(values) {
  var results = {}, v, i, n;
  for (i = 0, n = values.length; i<n; i++) {
    v = values[i];
    if (v in results) {
      results[v] ++;
    } else {
      results[v] = 1;
    }
  }
  return results;
};

// 返回数组长度
stats.count = function(values) {
  return values && values.length || 0;
};

// 统计数组中non-null/non-undedined/non-NaNd的个数
stats.count.valid = function(values) {
  var v, i, n, valid = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = values[i];
    if (!_.isNull(v) && !_.isUndefined(v) && !_.isNaN(v)) valid += 1;
  }
  return valid;
};

// 统计数组中null和undefined的个数
stats.count.missing = function(values) {
  var v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = values[i];
    if (_.isNull(v) || _.isUndefined(v)) count += 1;
  }
  return count;
};

// 简单统计数组中不同值的个数
stats.count.distinct = function(values) {
  var u = {}, v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = values[i];
    if (v in u) continue;
    u[v] = 1;
    count += 1;
  }
  return count;
};

// 中位数
stats.median = function(values) {
  return ss.median(values);
};

// 计算一组数字的四分位边界
stats.quartile = function(values) {
  var q = stats.quantile;
  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
};

// 分位数
stats.quantile = function(values, p) {
  return ss.quantile(values, p);
};

// 和
stats.sum = function(values) {
  return ss.sample(values);
};

// 统计平均值
stats.mean = function(values) {
  return ss.mean(values);
};

// 几何平均值
stats.mean.geometric = function(values) {
  return ss.geometricMean(values);
};

// 调和平均值
stats.mean.harmonic = function(values) {
  return ss.harmonicMean(values);
};

// 方差 sum/n
stats.variance = function(values) {
  return ss.variance(values);
};

// 样本方差 sum/n-1
stats.sampleVariance = function(values) {
  return ss.sampleVariance(values);
}

// 标准差
stats.stdev = function(values) {
  return ss.standardDeviation(values);
};

// 样本标准差
stats.sampleStdev = function(values) {
  return ss.sampleStandardDeviation(values);
},

// 众数
stats.mode = function(values) {
  return ss.mode(values);
}

// Pearson mode skewness
stats.modeskew = function(values) {
  return ss.sampleSkewness(values);
};

// 最小值
stats.min = function(values) {
  return ss.min(values);
};

// 最大值
stats.max = function(values) {
  return ss.max(values);
};

// 计算数组[min, max]
stats.extent = function(values) {
  return ss.extent(values);
};

// 点乘
stats.dot = function(values) {
  return ss.product(values);
};

// 返回一组数据的所有统计值
stats.profile = function(values) {
 return {
  unique: stats.unique(values),
  count: stats.count(values),
  valid: stats.count.valid(values),
  missing: stats.count.missing(values),
  distinct: stats.count.distinct(values),
  min: stats.min(values),
  max: stats.max(values),
  stdev: stats.stdev(values),
  median: stats.median(values),
  q1: stats.quantile(values, 0.25),
  q3: stats.quantile(values, 0.75),
  mode: stats.mode(values),
  modeskew: stats.modeskew(values)
 }
};

export default stats;