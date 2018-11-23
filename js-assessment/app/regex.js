exports = typeof window === 'undefined' ? global : window;

exports.regexAnswers = {
  containsNumber: function(str) {
    return /\d+/.test(str);
  },

  containsRepeatingLetter: function(str) {
    // \1 子表达式的引用， 对正则表达式中前一个子表达式的引用,并不是指对子表达式模式的引用，而指的是与那个模式相匹配的文本的引用。
    return /([a-zA-z])\1/.test(str);
  },

  endsWithVowel: function(str) {
    return (/[aeiou]$/i).test(str);
  },

  captureThreeNumbers: function(str) {
    // 字符串中是否含有连续的三个任意数字，而不是三个连续的数字
    var matches = /\d{3}/.exec(str);
    return matches ? matches[0] : false;
  },

  matchesPattern: function(str) {
    return /^\d{3}-\d{3}-\d{4}$/.test(str);
  },

  isUSD: function(str) {
    return /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/.test(str);
  }
};
