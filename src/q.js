var Q = require('./wrap');

var q = function(selector){
    if(selector instanceof Q) return selector;

    var paramType = typeof selector, matches;
    if(paramType === 'function'){
        return document.addEventListener('DOMContentLoaded', function(){
            selector();
        });
    }else{
        if(paramType === 'object'){
            matches = [selector];
        }else if(paramType === 'string'){
            //Try to determine if the selector is in fact a fragment of html to turn into an alement
            if(selector.length>2 && selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>'){
                var tagname = /<([a-z]*)/.exec(selector)[1];
                var wrapper = document.createElement('div');
                wrapper.innerHTML = selector;
                matches = [wrapper.firstChild];
            }else{
                matches = Array.prototype.slice.call(document.querySelectorAll(selector));
            }
        }else{
            return void(0);
        }
        return new Q(matches, selector);
    }
};

if(typeof window!='undefined'){
    window.$ = window.jQuery = q;
}

module.exports = q;