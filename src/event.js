var Q = require('./wrap');
var q = require('./q');

var elementsWithEvents = [];
var elementEvents = [];

Q.prototype.on = function(event, handler){
    var me = this, result;
    var eventHandler = function(elem, e){
        var evt = e;
        if(e.data){
            if(!Array.isArray(e.data)){
                evt = [e.data];
            }else{
                e.data.unshift(e);
                evt = e.data;
                e.data = null;
            }
        }else{
            evt = [e];
        }
        result = handler.apply(elem, evt);

        if(result === false){
            e.preventDefault();
            e.stopPropagation();
        }
    };

    var nsIndex, ns = '', events;
    if((nsIndex = event.indexOf('.')) !== -1){
        ns = event.substring(nsIndex + 1, event.length);
        event = event.substring(0, nsIndex);
    }

    for(var i = 0;i<this.elements.length; i++){
        var elem = this.elements[i];
        var elemIndex = elementsWithEvents.indexOf(elem);
        if(elemIndex===-1){
            elementsWithEvents.push(elem);
            events = [];
            elementEvents.push(events);
        }else{
            events = elementEvents[elemIndex];
        }
        var evt = {ns: ns, event: event, handler: handler, boundHandler: eventHandler.bind(null, elem)};
        events.push(evt);

        console.log('addEventListener', event);
        elem.addEventListener(event, evt.boundHandler);
    }
    return this;
};

Q.prototype.off = function(event, handler){
    var nsIndex, ns = '', events, toRemove;
    if((nsIndex = event.indexOf('.')) !== -1){
        ns = event.substring(nsIndex + 1, event.length);
        event = event.substring(0, nsIndex);
    }

    for(var i = 0;i<this.elements.length; i++){
        var elem = this.elements[i];
        var elemIndex = elementsWithEvents.indexOf(elem);
        if(elemIndex===-1) return;
        events = elementEvents[elemIndex];
        for(var e=0; e<events.length; e++){
            var evt = events[e];
            if(evt.ns === ns && (!handler || (evt.handler === handler))){
                events.splice(e, 1);
                e--;
                elem.removeEventListener(evt.event, evt.boundHandler);
            }
        }
    }
    return this;
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

Q.prototype.bind = function(event, handler){
    this.on(event, handler);
    return this;
};

Q.prototype.unbind = function(event, handler){
    this.off(event, handler);
    return this;
};


Q.prototype.trigger = function(eventName, eventData){
    console.log('trigger', eventName);
    var evt = document.createEvent('CustomEvent');
    evt.data = eventData;
    evt.initCustomEvent(eventName, true, false, null);
    for(var i = 0; i<this.elements.length; i++){
        var elem = this.elements[i];
        elem.dispatchEvent(evt);
    }
    return this;
};
