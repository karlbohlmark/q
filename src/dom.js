var Q = require('./wrap');

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

Q.prototype.html = function(html){
    if(html === void(0)){
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

Q.prototype.text = function(text){
    if(text === void(0)){
        if(this.elements.length === 0){
            return void(0);
        }else{
            return this.elements[0].innerText;
        }
    }else{
        for(var i = 0;i<this.elements.length; i++){
            var elem = this.elements[i];
            elem.innerText = text;
        }
    }
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
    var elem;
    if(val !== void(0)){
        for(var i=0; i<this.elements.length; i++){
            elem = this.elements[i];
            elem.style.height = val + 'px';
        }
        return this;
    }
    elem = this.elements[0];
    if(elem instanceof Window){
        return elem.innerHeight;
    }else{
        return elem.clientHeight;
    }
};
