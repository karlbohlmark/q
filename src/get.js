var Q = require('./wrap');
Q.prototype.get = function(i){
	return this.elements[i];
};