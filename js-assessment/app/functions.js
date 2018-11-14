exports = typeof window === 'undefined' ? global : window;

exports.functionsAnswers = {
  argsAsArray: function(fn, arr) {
    // call接受参数列表，apply接受参数数组
    return fn.apply(this, arr);
  },

  speak: function(fn, obj) {
    // bind函数返回的是函数，要执行
    return fn.bind(obj)();
  },

  functionFunction: function(str) {
    return function (arg){
      // 空格==
      return str + ', ' + arg;
    }
  },

  makeClosures: function(arr, fn) {
    return arr.map(function(i){
      return function(){
        return fn(i);
      }
    })
  },

  partial: function(fn, str1, str2) {
    return function(arg){
      return fn.call(this, str1, str2, arg);
    }
  },

  useArguments: function() {
    var sum = 0;
    for(var i=0,len=arguments.length;i<len;i++){
      sum += arguments[i]
    }
    return sum;
  },

  callIt: function(fn) {
    // 将arguments转换为数组的方法
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);
    return fn.apply(null, args);
  },

  partialUsingArguments: function(fn) {
    var args = Array.prototype.slice.call(arguments, 1, arguments.length); 
    return function(){
      var moreArgs = args.concat(Array.prototype.slice.call(arguments));
      return fn.apply(null, moreArgs);
    }
  },

  curryIt: function(fn) {
    // 柯里化是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。简单理解题目意思，就是指，我们将预定义的函数的参数逐一传入到curryIt中，当参数全部传入之后，就执行预定义函数。于是，我们首先要获得预定义函数的参数个数fn.length，然后声明一个空数组去存放这些参数。返回一个匿名函数接收参数并执行，当参数个数小于fn.length，则再次返回该匿名函数，继续接收参数并执行，直至参数个数等于fn.length。最后，调用apply执行预定义函数。
    var n = fn.length;
    var args = [];
    return function (arg){
      args.push(arg);
      if(args.length<n){
        return arguments.callee;
      }else{
        return fn.apply("", args);
      }
    }
  }
};
