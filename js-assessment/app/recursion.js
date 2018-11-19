exports = typeof window === 'undefined' ? global : window;

exports.recursionAnswers = {
  listFiles: function(data, dirName) {
  	var dirs = [],
  		files = [];
  	function process(dirObj) {
  		dirs.push(dirObj.dir);
  		var check = !dirName || dirs.indexOf(dirName) > -1;
		for(var i=0,len=dirObj.files.length;i<len;i++){
			if( typeof dirObj.files[i] === 'string') {
				if(check) {
					files.push(dirObj.files[i]);
				} else {
					continue;
				}
			} else {
				process(dirObj.files[i], dirName);
			}
		}
		dirs.pop();
  	}
  	process(data);
  	return files;
  },

  permute: function(arr) {
  	var result = [],
  		used = [];
  	function process(arr){
  		var del,
  			len = arr.length;
  		for(var i=0;i<len;i++){
  			del = arr.splice(i,1)[0];
  			used.push(del);
  			if(arr.length===0){
  				result.push(used.slice());
  			} else {
  				process(arr);
  			}
  			arr.splice(i,0,del);
  			used.pop();
  		}
  		return result;
  	}
  	return process(arr);
  },

  fibonacci: function(n) {
  	function fib(n) {
  		if(n===1 || n===2){
  			return 1;
	  	}else {
	  		return fib(n-1)+fib(n-2);
	  	}
  	}
  	return fib(n);
  },	

  validParentheses: function(n) {
  	var memory = [];
  	function process(n){
  		var result = [];
  		if(memory[n]){
  			return memory[n]
  		}
  		if(n===1){
  			result.push('()');
  		} else {
  			var previous = process(n-1);
  			for(var i = 0, len=previous.length;i<len;i++){
  				var curr = previous[i].split('');
  				for(var j=0, len2 = curr.length;j<=len2;j++){
  					var temp = curr.slice(); // 深拷贝
  					temp.splice(j, 0, '()');
  					temp = temp.join('');
  					// 去重
  					if(result.indexOf(temp)===-1){
  						result.push(temp);
  					}
  				}
  			}
  		}
  		memory.push(result);
  		return result;
  	}
  	return process(n);
  }
};
