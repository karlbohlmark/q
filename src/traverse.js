var Q = require('./wrap');
Q.prototype.parent = function(){
    return new Q(this.elements[0].parentNode);
};

Q.prototype.find = function(selector){
    var matches = [];
    for(var i = 0;i<this.elements.length; i++){
        var elem = this.elements[i];
        var elems = elem.querySelectorAll(selector);
        for(var e=0; e<elems.length; e++){
            matches.push(elems[e]);
        }
    }
    return new Q(matches);
};