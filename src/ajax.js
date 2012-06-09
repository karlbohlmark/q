var q = require('./q');
var Deferred = require('./deferred');
var httpGet = function(url, success){
    var result = http('GET', url);
    result.then(success);
};

var ajax = function(options){
    var method = 'GET', url, data;
    if(options.type){
        method = options.type;
    }

    if(options.data){
        data = options.data;
    }

    url = options.url;

    var request = http(method, url, data);
    if(options.success){
        request.then(options.success);
    }

    if(options.error){
        request.fail(options.error);
    }
    return request;
};

var http = function(method, url, data){
    var deferred = new Deferred();
    var xhr = new XMLHttpRequest(), result;
    xhr.onreadystatechange = function(){
        if(this.readyState == this.DONE){
            if(this.status==200) {
                deferred.resolve(this.responseText);
            } else {
                deferred.reject(this.responseText);
            }
        }
    };

    xhr.open(method, url);
    if(method === 'POST'){
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }else{
        xhr.send();
    }
    return deferred;
};

q.get = httpGet;

q.ajax = ajax;