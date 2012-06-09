var q = require('./q');
require('./dom');
require('./get');
require('./event');
require('./css');
require('./deferred');
require('./when');
require('./traverse');
require('./is');
require('./ajax');
require('./proxy');
require('./ready');

if(typeof window!=='undefined'){
	window.jQuery = $ = q;
}