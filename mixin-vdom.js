module.exports = {
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
};
