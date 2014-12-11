var test = require('tape');
var parse = require('../parse');
var stringify = require('../stringify');


test('parse', function (t) {
    var html = '<div class="oh"><p></p></div>';
    var parsed = parse(html);    
    t.deepEqual(parsed, {
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'oh'
        },
        selfClosing: false,
        children: [
            {
                type: 'tag',
                name: 'p',
                attrs: {},
                children: [],
                selfClosing: false
            }
        ]
    });
    t.equal(html, stringify(parsed));

    html = '<div class="oh"><p>hi</p></div>';
    parsed = parse(html);
    var textNode = parsed.children[0].children[0];

    t.deepEqual(parsed, {
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'oh'
        },
        selfClosing: false,
        children: [
            {
                type: 'tag',
                name: 'p',
                attrs: {},
                selfClosing: false,
                children: [
                    {
                        type: 'text',
                        content: 'hi'
                    }
                ]
            }
        ]
    });
    t.equal(html, stringify(parsed));

    html = '<div>oh <strong>hello</strong> there! How are <span>you</span>?</div>';
    parsed = parse(html);

    t.deepEqual(parsed, {
        type: 'tag',
        name: 'div',
        attrs: {},
        selfClosing: false,
        children: [
            {
                type: 'text',
                content: 'oh '
            },
            {
                type: 'tag',
                name: 'strong',
                attrs: {},
                selfClosing: false,
                children: [
                    {
                        type: 'text',
                        content: 'hello'
                    }
                ]
            },
            {
                type: 'text',
                content: ' there! How are '
            },
            {
                type: 'tag',
                name: 'span',
                attrs: {},
                selfClosing: false,
                children: [
                    {
                        type: 'text',
                        content: 'you'
                    }
                ]
            },
            {
                type: 'text',
                content: '?'
            }
        ]
    });
    t.equal(html, stringify(parsed));

    html = '<div class="handles multiple classes" and="attributes"></div>';
    parsed = parse(html);

    t.deepEqual(parsed, {
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'handles multiple classes',
            and: 'attributes'
        },
        selfClosing: false,
        children: []
    });
    t.equal(html, stringify(parsed));

    html = '<div class=\'handles\' other=47 and="attributes"></div>';
    parsed = parse(html);

    t.deepEqual(parsed, {
        type: 'tag',
        name: 'div',
        attrs: {
            class: 'handles',
            other: '47',
            and: 'attributes'
        },
        selfClosing: false,
        children: []
    });
    t.equal(stringify(parsed), '<div class="handles" other="47" and="attributes"></div>');

    t.end();
});
