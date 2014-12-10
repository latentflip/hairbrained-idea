var each = require('amp-each');


function stringify(buff, doc) {
    buff += '<' + doc.name + (doc.attrs ? ' ' + doc.attrs : '') + (doc.selfClosing ? '/>' : '>');
    if (doc.selfClosing) {
        return doc.preText + buff + doc.postText;
    }
    var middle = doc.preText + doc.children.reduce(stringify, '');
    return buff + middle + '</' + doc.name + '>' + doc.postText;
}

module.exports = function (doc) {
    return stringify('', doc);
};
