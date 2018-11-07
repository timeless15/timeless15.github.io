exports = typeof window === 'undefined' ? global : window;

exports.arraysAnswers = {
  indexOf: function(arr, item) {
  	if(Array.prototype.indexOf){
      return arr.indexOf(item);
    }else {
      for (var i=0,len=arr.length;i<len;i++){
        if(arr[i]===item){
          return i;
        }
      }
    }
    return -1;
  },

  sum: function(arr) {
  	if (Array.prototype.reduce){
  		return arr.reduce((sum,i)=>{
  			return sum+=i;
  		}, 0)
  	} else {
  		var sum = 0;
  		for (var i=0,len=arr.length;i<len;i++){
  			sum += arr[i];
  		}
  		return sum;
  	}
  },

  remove: function(arr, item) {
  	if(Array.prototype.filter){
  		return arr.filter(i=>i!==item);
  	}else{
  		// push方法
  		var newArr = []
  		for(var i=0,len=arr.length;i<len;i++){
  			if(arr[i]!==item){
  				newArr.push(arr[i]);
  			}
  		}
  		return newArr;
  	}
  },

  removeWithoutCopy: function(arr, item) {
  	// splice方法，length要每次重新获取
  	for(var i=0;i<arr.length;i++){
		if(arr[i]===item){
			arr.splice(i,1);
			i--;
		}
	}
	return arr;
  },

  append: function(arr, item) {
  	if(Array.prototype.push){
  		arr.push(item);
  	} else{
  		arr[arr.length] = item;
  	}
  	return arr;
  	// 不修改原数组
  	// if(Arraty.prototype.concat){
  	// 	return arr.concat(item);
  	// } else{
  	// 	var newArr = [];
  	// 	for(var i=0,len=arr.length;i<len;i++){
  	// 		newArr.push(arr[i]);
  	// 	}
  	// 	newArr.push(item);
  	// 	return newArr;
  	// }
  },

  truncate: function(arr) {

  },

  prepend: function(arr, item) {

  },

  curtail: function(arr) {

  },

  concat: function(arr1, arr2) {

  },

  insert: function(arr, item, index) {

  },

  count: function(arr, item) {

  },

  duplicates: function(arr) {

  },

  square: function(arr) {

  },

  findAllOccurrences: function(arr, target) {

  }
};
