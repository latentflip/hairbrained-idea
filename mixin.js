var parse = require('html-parse-stringify').parse;
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');


module.exports = {
    props: {
        tree: 'any'
    },
    //there's gotta be a better way to deal with this
    renderOnViewChange: function () {
        var lock = false;
        //this.on('change', function () {
        //    if (!lock) {
        //        lock = true;
        //        console.log('render');
        //        this.render();
        //        lock = false;
        //    } else {
        //        console.log('Blocked');
        //    }
        //});
    },
    renderOnModelChange: function () {
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
            return h(ast.name, this.parseTagAttrs(ast.attrs), ast.children.map(this.tovdom, this));
        }

        if (ast.type === 'component') {
            var Constructor = this.components[ast.name];
            var attrs = this.parseComponentAttrs(ast.attrs);

            return {
                type: 'Widget',
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
                }
            };
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
    },
    parseTagAttrs: function (attrs) {
        var res = {};
        res.attributes = attrs.attributes || {};
        var key, val;
        for (key in attrs) {
            val = attrs[key];
            if (key.slice(0,2) === 'on' && val.trim().match(/^{[^}]+}$/)) {
                val = val.trim().slice(1,-1);
                if (typeof this[val] === 'function') {
                    res[key] = this[val].bind(this);
                } else {
                    res[key] = attrs[key];
                }
            } else if (key.slice(0,5) === 'data-') {
                res.attributes[key] = attrs[key];
            } else {
                res[key] = attrs[key];
            }
        }
        return res;
    }
};
