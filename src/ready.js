var Q = require('./wrap');

Q.prototype.ready = function(cb){
	document.addEventListener('DOMContentLoaded', cb);
};