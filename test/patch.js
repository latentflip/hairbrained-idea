var test = require('tape');
var domify = require('domify');
var patch = require('../patch');
var parse = require('../parse');
var differ = require('deep-diff');
var each = require('amp-each');


function getEl(html) {
    var el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
}

var keysToIgnore = ['selfClosing', 'type'];

test('parseTag', function (t) {
    function transform(fromHtml, toHtml, message) {
        var el = getEl(fromHtml);
        var diff = differ(parse(el.outerHTML), parse(toHtml), function (path, key) {
            return keysToIgnore.indexOf(key) !== -1;
        });
        
        //debugger;

        if (!diff) return el;
        diff.reduce(patch, el);
        t.equal(el.outerHTML, toHtml, message);
    }

    transform('<p>hi</p>', '<p>ok</p>', 'simple text content');
    transform('<p>oh, hello</p>', '<p>oh, <strong>hello</strong></p>', 'insert tag at end of text node');
    transform('<p>oh, hello</p>', '<p>oh, <strong>hello</strong> there!</p>', 'insert tag in middle of text node');
    transform('<p>oh, hello</p>', '<p><strong>oh<strong>, hello</p>', 'insert tag at beginning of text node');

    t.end();
});
