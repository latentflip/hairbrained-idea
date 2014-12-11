var stringify = require('./stringify');
var isNumber = require('amp-is-number');


var getEl = function (el, paths) {
    var current = el;
    var i = 0;
    var l = paths.length;
    var isLast;
    for (; i < l; i++) {
        path = paths[i];
        isLast = (i + 1) === l;
        if (isLast && path === 'children') {
            return current;
        }
        if (current[path] && current[path].length) {
            current = current[path]
        } else {
            return current;
        }
    }
}

var edit = function (el, diff) {
    var last = diff.path[diff.path.length - 1];
    if (last === 'content') {
        getEl(el, diff.path).innerText = diff.rhs
    }
    return el;
};

var arrayChange = function (el, diff) {
    var element = getEl(el, diff.path);
    element.innerHTML = element.innerHTML + stringify(diff.item.rhs);
    return el;
};

var del = function (el, diff) {
    return el;
};

var newItem = function (el, diff) {
    return el;
};

var methodMap = {
    E: edit,
    A: arrayChange,
    D: del,
    N: newItem
};

module.exports = function (el, diff) {
    return methodMap[diff.kind](el, diff);
};
