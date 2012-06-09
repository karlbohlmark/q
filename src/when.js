var q = require('./q');
var Deferred = require('./deferred');

q.when = function(promiseOrValue){
    var deferred = new Deferred();
    if( typeof promiseOrValue === 'object' &&
        typeof promiseOrValue.then === 'function'){
        return promiseOrValue;
    }else{
        deferred.resolve(promiseOrValue);
    }
    return deferred.promise();
};