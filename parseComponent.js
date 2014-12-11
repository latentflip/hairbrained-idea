var parseTag = require('./parseTag');

module.exports = function (tag) {
    var component = parseTag(tag);
    component.type = 'component';
    return component;
};
