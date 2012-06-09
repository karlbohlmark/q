var q = require('./q');
q.proxy = function(f, context){
    return f.bind(context);
};