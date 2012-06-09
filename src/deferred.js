var q = require('./q');

var Deferred = function(){
    if(!(this instanceof Deferred)){
        return new Deferred();
    }
    this.listeners = [];
    this.errorListeners = [];
    this.resolved = false;
};

Deferred.prototype.then = function(listener){
    if(this.resolved){
        listener(this.value);
    }

    this.listeners.push(listener);
};

Deferred.prototype.resolve = function(val){
    this.value = val;
    this.resolved = true;

    for(var i = 0; i<this.listeners.length; i++){
        this.listeners[i](val);
    }
};

Deferred.prototype.promise = function(){
    return {
        then: this.then.bind(this)
    };
};

Deferred.prototype.reject = function(message){
    this.rejected = true;
    this.errorMessage = message;

    for(var i = 0; i<this.errorListeners.length; i++){
        this.errorListeners[i](message);
    }
};

q.Deferred = Deferred;

module.exports = Deferred;