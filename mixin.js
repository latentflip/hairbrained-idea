var isString = require('amp-is-string');
var parse = require('html-parse-stringify').parse;
var domify = require('domify');

var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');




module.exports = {
    props: {
        tree: 'any'
    },
    renderOnModelChange: function () {
        this.listenTo(this, 'change:time', this.render);
        if (this.model) {
            this.listenTo(this.model, 'change', this.render);
        }
    },
    renderWithTemplate: function () {
        var firstRender = !(this.tree && this.el);
        var renderedTemplate, newTree;

        if (isString(this.template)) {
            renderedTemplate = this.template;
        } else {
            renderedTemplate = this.template(this);
        }

        newTree = this.tovdom(parse(renderedTemplate, {
            components: this.components || {}                          
        }), this);

        if (firstRender) {
            var el = createElement(newTree);
            this.tree = newTree;
            this.el = el;
        } else {
            var patches = diff(this.tree, newTree);
            this.tree = newTree;
            this.el = patch(this.el, patches);
        }
    },

    tovdom: function (ast) {
        if (ast.type === 'text') {
            return ast.content;
        }

        if (ast.type === 'tag') {
            return h(ast.name, ast.attrs, ast.children.map(this.tovdom, this));
        }

        if (ast.type === 'component') {
            var Constructor = this.components[ast.name];
            var attrs = this.parseComponentAttrs(ast.attrs);

            var x = {
                name: 'MyWidget',
                id: ast.attrs.key,
                key: ast.attrs.key,
                init: function () {
                    this.view = new Constructor(attrs);
                    this.view.render();
                    return this.view.el;
                },
                update: function (previous, dom) {
                    this.view = previous.view;
                    this.view.set(attrs);
                    return this.view.el;
                },
                destroy: function () {
                    this.view.remove();
                },
                type: 'Widget'
            };
            return x;
        }
    },

    parseComponentAttrs: function (attrs) {
        var res = {};
        var key, val, path;

        for (key in attrs) {
            val = attrs[key];

            if (val.trim().match(/^{[^}]+}$/)) {
                val = val.trim().slice(1,-1);
                path = val.split('.');
                res[key] = path.reduce(function (o, pathPart) {
                    return o && o[pathPart];
                }, this);
            } else {
                res[key] = val;
            }
        }
        return res;
    }
};

