exports = typeof window === 'undefined' ? global : window;

exports.countAnswers = {
  count: function (start, end) {
  	var timeout;
  	function doConsole() {
  		console.log(start++);
  		if(start<=end){
  			timeout = setTimeout(doConsole, 100);
  		}
  	}
  	doConsole();
  	return {
  		cancel: function(){
  			timeout && clearTimeout(timeout);
  		}
  	}
  }
};
