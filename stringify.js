var each = require('amp-each');


function stringify(buff, doc) {
    var start = buff + '<' + doc.name + (doc.selfClosing ? '/>' : '>');
    if (doc.selfClosing) {
        console.log('returning');
        return start;
    }
    var middle = doc.children.reduce(stringify, '');
    return start + middle + '</' + doc.name + '>';
}

module.exports = function (doc) {
    var buff = '';
    var result = stringify('', doc);
    console.log(result);
};
