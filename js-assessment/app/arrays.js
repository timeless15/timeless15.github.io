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
    /* 修改原数组
    arr.pop()
    return arr; */
    // 不修改原数组
    // return arr.slice(0, arr.length-1);
    var newArr = [];
    for(var i=0,len=arr.length-1;i<len;i++){
      newArr.push(arr[i])
    }
    return newArr;
  },

  prepend: function(arr, item) {
    // arr.splice(0,0,item)
    // return arr;
    var newArr = [item];
    for(var i=0,len=arr.length;i<len;i++){
      newArr.push(arr[i]);
    }
    return newArr;
  },

  curtail: function(arr) {
    // arr.shift();
    // return arr;
    var newArr = [];
    for(var i=1,len=arr.length;i<len;i++){
      newArr.push(arr[i]);
    }
    return newArr;
  },

  concat: function(arr1, arr2) {
      // return arr1.concat(arr2);
    var newArr = [];
    for(var i=0,len=arr1.length;i<len;i++){
      newArr.push(arr1[i]);
    }
    for(var i=0,len=arr2.length;i<len;i++){
      newArr.push(arr2[i]);
    }
    return newArr;
  },

  insert: function(arr, item, index) {
    // arr.splice(index, 0, item);
    // return arr;
    var newArr = [];
    for(var i=0,len=arr.length;i<len;i++){
      if(i===index){
        newArr.push(item);
      }
      newArr.push(arr[i]);
    }
    return newArr;
  },

  count: function(arr, item) {
    return arr.filter(i => i===item).length;
    // return arr.reduce((count, i) => {
    //   return count+= (i===item ? 1 : 0) 
    // }, 0)
    // var count = 0;
    // for(var i=0,len=arr.length;i<len;i++){
    //   if(arr[i]===item){
    //     count++;
    //   }
    // }
    // return count;
  },

  duplicates: function(arr) {
    // var hash = {},
    //     result = [];
    // for(var i=0,len=arr.length;i<len;i++){
    //   var key = arr[i];
    //   if(!hash[key]){
    //     hash[key] = 1;
    //   }else{
    //     hash[key]++;
    //     if(result.indexOf(key)===-1){
    //       result.push(key)
    //     }
    //   }
    // }
    // return result;
    // 排序
    arr.sort();
    var result = [];
    for(var i=0,len=arr.length;i<len-1;i++){
      if(arr[i]===arr[i+1]){
        if(result.indexOf(arr[i])===-1){
          result.push(arr[i]);
        }
      }
    }
    return result;
  },

  square: function(arr) {
    // return arr.map(i=>{
    //   return i*i;
    // })
    var newArr = [];
    for(var i=0,len=arr.length;i<len;i++){
      newArr.push(arr[i]*arr[i]);
    }
    return newArr;
  },

  findAllOccurrences: function(arr, target) {
    var result = [];
    arr.forEach((i,index)=>{
      // if(i===target){
      //   result.push(index);
      // }
      i!==target || result.push(index);
    });
    return result;
  }
};
