exports = typeof window === 'undefined' ? global : window;

exports.numbersAnswers = {
  /*获取数字 num 二进制形式第 bit 位的值。注意：
	1、bit 从 1 开始
	2、返回 0 或 1
	3、举例：2 的二进制为 10，第 1 位为 0，第 2 位为 1*/
  valueAtBit: function(num, bit) {
  	// return num >> (bit-1) && 1;
  	var bitStr = num.toString(2);
  	var len = bitStr.length;
  	if(bit>len){
  		return 0
  	} else{
  		return Number(bitStr[len-bit]);
  	}
  },

  base10: function(str) {
  	return parseInt(str, 2);
  },

  convertToBinary: function(num) {
  	var bitArr = num.toString(2).split('');
  	while(bitArr.length<8){
  		bitArr.unshift('0')
  	}
  	return bitArr.join('');
  },

  multiply: function(a, b) {
  	var indexA = a.toString().indexOf('.');
  	var indexB = b.toString().indexOf('.');
  	var dotA = 0;
  	var dotB = 0;
  	if(indexA !== -1 ){
  	  dotA = a.toString().length-indexA-1;
  	}
  	if(indexB !== -1 ){
  	  dotB = b.toString().length-indexB-1;
  	}
  	a = a*Math.pow(10,dotA);
  	b = b*Math.pow(10,dotB);
  	return a*b/Math.pow(10,(dotA+dotB));
  	// 答案，思路相同
  	// a = adjust(a);
  	// b = adjust(b);
  	// return a.adjust*b.adjust/(a.multiplier*b.multiplier);
  	// function adjust(num){
  	// 	var exponent, multiplier;
  	// 	if(num < 1) {
  	// 		exponent = Math.floor(Math.log(num)* -1 );
  	// 		multiplier = Math.pow(10, exponent);
  	// 		return {
  	// 			adjusted: num*multiplier,
  	// 			multiplier: multiplier
  	// 		}
  	// 	}
  	// 	return {
  	// 		adjusted: num,
  	// 		multiplier: 1
  	// 	};
  	// }
  }
};
