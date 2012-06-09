var Q = require('./wrap');

Q.prototype.is = function(selector){
	var is = false, prefix;
	var prefixes = ['webkit', 'moz', 'ms', 'o'];
	//Todo: this should only be checked the first time the function is called
	for(var p = 0; p<prefixes.length; p++){
		if(document.body[prefixes[p] + 'MatchesSelector']){
			prefix = prefixes[p];
		}
	}
	for(var i = 0; i< this.elements.length; i++){
		var elem = this.elements[i];
		if(prefix){
			is = is || elem[prefix + 'MatchesSelector'](selector);
		}else{
			is = is || elem.matchesSelector(selector);
		}
		if(is) break;
	}
	return is;
};
