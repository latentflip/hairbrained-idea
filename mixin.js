var each = require('amp-each');
var isString = require('amp-is-string');
var result = require('amp-result');
var parse = require('./parse');
var diff = require('./deep-diff');
var getPatch = require('./patch');


module.exports = {
    renderOnModelChange: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    refreshAst: function () {
        this.ast = parse(this.el.outerHTML);
    },
    applyDiffs: function (diffs) {
        if (!diffs) return;
        each(diffs, function (diff) {
            getPatch(diff)(this.el);
        }, this);
    },
    renderWithTemplate: function () {
        var firstRender = false;
        var diffs;
        var templateIsString = isString(this.template);
        if (!this.el) {
            if (templateIsString) {
                this.el = domify(this.template);
            } else {
                this.el = domify(this.template(this));
            }
            firstRender = true;
        }
        if (!this.ast) {
            this.ast = parse(this.el.outerHTML);
        }

        if (templateIsString) {
            return;
        }

        if (!firstRender) {
            this.applyDiffs(diff(this.ast, parse(this.template(this))));
        }
    }
}
