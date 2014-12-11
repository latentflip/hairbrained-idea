var tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
var parseTag = require('./parseTag');
var parseComponent = require('./parseComponent');


module.exports = function parse(html, options) {
    options = options || {};
    options.components = options.components || {};
    var result;
    var current;
    var previous;
    var level = -1;
    var arr = [];
    var byTag = {};

    html.replace(tagRE, function (tag, index) {
        var isOpen = tag.charAt(1) !== '/';
        var start = index + tag.length;
        var nextChar = html.charAt(start);
        var parent;
        
        previous = current;
        
        if (isOpen) {
            level++;
            
            current = parseTag(tag);
            if (current.type === 'tag' && options.components[current.name]) {
                current.type = 'component';
            }

            if (nextChar !== '<') {
                current.children.push({
                    type: 'text',
                    content: html.slice(start, html.indexOf('<', start))
                });
            }

            byTag[current.tagName] = current;

            // this is our base if we don't already have one
            if (!previous) {
                result = current;
            }

            parent = arr[level - 1];

            if (parent) {
                parent.children.push(current);
            }

            arr[level] = current;
        }

        if (!isOpen || current.selfClosing) {
            level--;
            if (nextChar !== '<' && nextChar) {
                // trailing text node
                arr[level].children.push({
                    type: 'text',
                    content: html.slice(start, html.indexOf('<', start))
                });
            }
        }
    }); 

    return result;
};
