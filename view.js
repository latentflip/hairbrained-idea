var View = require('ampersand-view');
var Model = require('ampersand-model');
var mixin = require('ampersand-virtual-dom-mixin');

//mixin = { renderOnModelChange: function () {} };
var Person = Model.extend({
    props: {
        name: ['string', true, "Phil"],
        age: ['number', true, 28]
    }
});

var SomeOtherView = View.extend({
    template: "<div>nested view <span data-hook='num'></span></div>",
    session: {
        anInteger: ['number', true, 0]
    },
    bindings: {
        anInteger: '[data-hook~=num]'
    },
    initialize: function () {
        this.interval = setInterval(function () {
            this.anInteger++;
        }.bind(this), 100);
    }
});

var MySubview = View.extend(mixin, {
    template: function (view) {
        return "<div><h1>this is my subview " + view.anInteger + "</h1>Passed In: " + view.aPropFromAbove + "<input type='text'/>Name: " + view.model.name + ": " + view.model.age + "<div data-hook='some-other-view'></div></div>";
    },
    subviews: {
        something: {
            constructor: SomeOtherView,
            hook: 'some-other-view'
        }
    },
    session: {
        anInteger: ['number', true, 0],
        aPropFromAbove: ['string', true, 'default'],
        interval: ['number'],
    },
    initialize: function () {
        window.subviews = window.subviews || [];
        window.subviews.push(this);
        this.renderOnViewChange();
        this.renderOnModelChange();
        //this.on('change:anInteger', this.render);
        //this.on('change:aPropFromAbove', this.render);
        this.interval = setInterval(function () {
            this.anInteger++;
        }.bind(this), 100);
    },
    remove: function () {
        clearInterval(this.interval);
        View.prototype.remove.call(this);
    }
});

var MyView = View.extend(mixin, {
    template: require('./template.jade'),
    components: {
        'my-subview': MySubview
    },
    props: {
        time: ['number', true, 0],
        someString: ['string', true, 'foo'],
        listOfThings: ['array', true]
    },
    events: {
        'click [data-hook=click-me]': 'onClickMe'
    },
    onClickMe: function () {
        console.log('clicked');
    },
    initialize: function () {
        this.renderOnViewChange();
        this.renderOnModelChange();
        //this.on('change:time', this.render);
        //this.on('change:listOfThings', this.render);
        //this.on('change:someString', this.render);

        setInterval(function () {
            this.time = Date.now();
        }.bind(this), 10);

        setInterval(function () {
            this.someString += 'o';
        }.bind(this), 1000);

        this.listOfThings = [1,2,3];

        i = 3;
        setInterval(function () {
            i++;
            this.listOfThings = this.listOfThings.concat([i]);
        }.bind(this), 5000);
    }
});

var me = new Person();
setInterval(function () {
    me.age++;
}, 500);
var myv = new MyView({ model: me });
myv.render();
document.body.appendChild(myv.el);
