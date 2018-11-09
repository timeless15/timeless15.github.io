exports = typeof window === 'undefined' ? global : window;

exports.stringsAnswers = {
  reduceString: function(str, amount) {
  	var arr = [],
  		last = '',
  		count = 0;
  	for(var i=0,len=str.length;i<len;i++){
  		if(last!==str[i]){
  			arr.push(str[i]);
  			last = str[i];
  			count = 1;
  		} else if(count<amount){
  			arr.push(str[i]);
  			count++;
  		}
  	}
  	return arr.join('');
  },

  wordWrap: function(str, cols) {
  	var formatedString = '',
  		wordsArray = [];
  	wordsArray = str.split(' ');
  	formatedString = wordsArray[0];
  	for(var i=1,len=wordsArray.length;i<len;i++){
  		if(wordsArray[i].length > cols){
  			formatedString += '\n' + wordsArray[i];
  		} else {
  			if(formatedString.length + wordsArray[i].length > cols){
  				formatedString += '\n' + wordsArray[i];
  			} else {
  				formatedString += ' ' + wordsArray[i];
  			}
  		}
  	}
  	return formatedString;
  },

  reverseString: function(str) {
  	// return str.split('').reverse().join('');
  	var newStr = '';
  	for(var len=str.length, i=len-1;i>=0;i--){
  		newStr += str[i];
  	}
  	return newStr;
  }
};
