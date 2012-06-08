var q = function(selector){
    var paramType = typeof selector;
    if(paramType === 'function'){
        return document.addEventListener('DOMContentLoaded', function(){
            selector();
        });
    }else{
        var matches;
        if(paramType === 'object'){
            matches = [selector];
        }else{
            matches = Array.prototype.slice.call(document.querySelectorAll(selector));
        }
        return new Q(matches, selector);
    }
};

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

var httpGet = function(url, success){
    var result = http('GET', url);
    result.then(success);
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

var Q = function(elements, selector){
    this.elements = elements;

    for(var i=0; i<this.elements.length; i++){
        this[i] = this.elements[i];
    }

    this.selector = selector;
};

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

q.proxy = function(f, context){
    return f.bind(context);
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

Q.prototype.css = function(name, value){
    console.log('css', name, value);

    var setStyleProp = function(elem, prop, val){
        var propertyMap = {
            'background-color': 'backgroundColor',
            'border-color': 'borderColor',
            'border-width': 'borderWidth',
            'background-position': 'backgroundPosition'
        };
        if(propertyMap.hasOwnProperty(prop)){
            prop = propertyMap[prop];
        }
        elem.style[prop] = val;
    };

    if(typeof name === 'object'){
        var values = name;
        for(var prop in values){
            if(values.hasOwnProperty(prop)){
                for(var i=0; i<this.element.length; i++){
                    var elem = this.elements[i];
                    setStyleProp(elem, prop, values[prop]);
                }
            }
        }
    }else if(value === void(0)){
        return this.elements[0].style[name];
    }else{
        var props = {};
        props[name] = value;
        this.css(props);
    }
    return this;
};

Q.prototype.bind = function(event, handler){
    this.on(event, handler);
    return this;
};

Q.prototype.removeClass = function(classname){
    for(var i=0;i< this.elements.length; i++){
        var elem = this.elements[i];
        elem.classList.remove(classname);
    }
    return this;
};

Q.prototype.addClass = function(classname){
    for(var i=0;i< this.elements.length; i++){
        var elem = this.elements[i];
        elem.classList.add(classname);
    }
    return this;
};

Q.prototype.height = function(val){
    if(val !== void(0)){
        for(var i=0; i<this.elements.length; i++){
            var elem = this.elements[i];
            elem.style.height = val + 'px';
        }
        return this;
    }
    var elem = this.elements[0];
    if(elem instanceof Window){
        console.log('height return window', elem.innerHeight);
        return elem.innerHeight;
    }else{
        console.log('height return', elem.clientHeight);
        if(elem.clientHeight==0) debugger;
        return elem.clientHeight;
    }
};

Q.prototype.parent = function(){
    return new Q(this.elements[0].parentNode);
};

Q.prototype.unbind = function(event, handler){
    this.off(event, handler);
    return this;
};

Q.prototype.trigger = function(eventName, eventData){
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(eventName, false, false, null);
    for(var i = 0; i<this.elements.length; i++){
        var elem = this.elements[i];
        elem.dispatchEvent(evt);
    }
};

Q.prototype.delegate = function(selector, event, handler){
    var me = this;
    this.on(event, function(e){
        var dispatchFor = this.querySelectorAll(selector);
        for(var i = 0; i<dispatchFor.length; i++){
            var elem = dispatchFor[i];
            handler.call(elem, e);
        }
    });
    return this;
};

Q.prototype.remove = function(){
    for(var i =0; i<this.elements.length; i++){
        var elem = this.elements[i];
        elem.parentNode.removeChild(elem);
    }
    return this;
};

Q.prototype.append = function(element){
    if(element instanceof Q){
        element = element[0];
    }
    this.elements[0].appendChild(element);
};

Q.prototype.prepend = function(element){
    if(element instanceof Q){
        element = element[0];
    }
    var prependTo = this.elements[0];
    if(prependTo.childNodes.length===0){
        prependTo.appendChild(element);
    }else{
        prependTo.insertBefore(prependTo.firstChild, element);
    }
    return this;
};

Q.prototype.appendTo = function(selectorOrElement){
    var element = selectorOrElement;
    if(element instanceof Q){
        element = element[0];
    }
    if(typeof element === 'string'){
        element = document.querySelector(selectorOrElement);
    }

    for(var i=0; i<this.elements.length; i++){
        var elem = this.elements[i];
        element.appendChild(elem);
    }

    return this;
};

Q.prototype.attr = function(attr, val){
    console.log('attr', attr, val);
    var elem, i;
    if(typeof attr === 'object'){
        for(i = 0; i<this.elements.length; i++){
            elem = this.elements[i];
            for(var attrname in attr){
                if(attr.hasOwnProperty(attrname)){
                    elem.setAttribute(attrname, attr[attrname]);
                }
            }
        }
    }

    if(!val){
        if(this.elements.length===0){
            return void(0);
        }else{
            return this.elements[0].getAttribute(attr);
        }
    }else{
        for(i = 0; i<this.elements.length; i++){
            elem = this.elements[i];
            elem.setAttribute(attr, val);
        }
    }
    return this;
};

Q.prototype.on = function(event, handler){
    var me = this;
    var eventHandler = function(elem, e){
        var result = handler.call(elem, e);
        if(result === false){
            e.preventDefault();
            e.stopPropagation();
        }
    };

    for(var i = 0;i<this.elements.length; i++){
        var elem = this.elements[i];
        elem.addEventListener('event', eventHandler.bind(null, elem));
    }
    return this;
};

Q.prototype.html = function(html){
    if(!html){
        if(this.elements.length === 0){
            return void(0);
        }else{
            return this.elements[0].innerHTML;
        }
    }
    for(var i = 0;i<this.elements.length; i++){
        var elem = this.elements[i];
        elem.innerHTML = html;
    }
    return this;
};

Q.prototype.off = function(event, handler){
    for(var i = 0;i<this.elements.length; i++){
        var elem = this.elements[i];
        elem.removeEventListener('event', handler);
    }
    return this;
};

if(typeof window!='undefined'){
    window.$ = window.jQuery = q;
}

module.exports = q;