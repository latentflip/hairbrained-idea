var each = require('amp-each');
var tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;


module.exports = function parse(html) {
    var result;

    var matches = html.match(tagRE);
    var current;
    var previous;
    var level = -1;
    var arr = [];

    each(matches, function (tag) {
        var isOpen = tag.charAt(1) !== '/';
        var isClose = tag.indexOf('/') !== -1;
        var tagName = tag.split(' ', 1)[0].replace(/[ <>\/]*/g, '');
        var closeOnly = isClose && !isOpen;
        var selfClose = isClose && isOpen;
        
        previous = current;
        
        if (isOpen) level++;
        if (isClose && !selfClose) level--;

        if (!closeOnly) {
            current = {
                name: tagName,
                children: [],
                selfClosing: selfClose
            };

            // grab our base if we have it
            if (!previous) result = current;

            var parent = arr[level - 1];

            if (parent) {
                parent.children.push(current);
            }

            arr[level] = current;
        }
    }); 

    return result;
};
