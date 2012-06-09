var Q = function(elements, selector){
    this.elements = elements;

    for(var i=0; i<this.elements.length; i++){
        this[i] = this.elements[i];
    }

    this.selector = selector;
};

module.exports = Q;