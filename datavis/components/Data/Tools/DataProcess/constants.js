const TYPES = {
  QUANTITATIVE: 'linear', // 数值型
  NOMINAL: 'cat', // 类别型
  TIME: 'time' // 时间 特殊的连续数值型
  // 另外还有一种有序型ORIDINAL，归类为cat。
  // 对于整数型数据，有可能是linear，也有可能是cat。基于经验判断，整数类型的基数相对较低且不同的值小于一定数量时，判断为cat
};

const timeFunc = ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds'];
const timeUnit = ['year', 'month', 'date', 'hours', 'minutes', 'seconds'];

export default {
  TYPES,
  timeFunc,
  timeUnit
};
