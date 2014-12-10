var tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;


module.exports = function parse(html) {
    var result;
    var current;
    var previous;
    var level = -1;
    var arr = [];
    var byTag = {};

    html.replace(tagRE, function (tag, index) {
        var isOpen = tag.charAt(1) !== '/';
        var tagName = tag.split(' ', 1)[0].replace(/[ <>\/]*/g, '');
        var closeOnly = tag.charAt(1) === '/';
        var selfClose = tag.slice(-2, -1) === '/';
        var isClose = closeOnly || selfClose;
        
        previous = current;
        
        if (isOpen) {
            level++;
        }

        if (!closeOnly) {
            current = {
                name: tagName,
                children: [],
                selfClosing: selfClose,
                start: index + tag.length,
                attrs: tag.slice(tagName.length + 1, (selfClose ? tag.indexOf('>') - 1 : tag.indexOf('>'))).trim(),
                preText: '',
                postText: ''
            };

            if (html.charAt(current.start) !== '<') {
                current.preText = html.slice(current.start, html.indexOf('<', current.start));
            }

            byTag[tagName] = current;

            // grab our base if we have it
            if (!previous) {
                result = current;
            }

            var parent = arr[level - 1];

            if (parent) {
                parent.children.push(current);
            }

            arr[level] = current;
        }

        if (isClose) {
            level--;
            var start = index + tag.length;
            var nextChar = html.charAt(start);
            if (nextChar !== '<' && nextChar) {
                // trailing text node
                var sliced = html.slice(start);
                (current || previous).postText = sliced.slice(0, sliced.indexOf('<'));
            }
        }
    }); 

    return result;
};
