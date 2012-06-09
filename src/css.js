var Q = require('Q');

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