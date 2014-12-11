var React = require('react');
var Model = require('ampersand-model');

var Person = Model.extend({
    props: {
        name: ['string', true, "Phil"],
        age: ['number', true, 28]
    }
});

var MySubview = React.createClass({
    getInitialState: function () {
        return {
            anInteger: 0
        };
    },
    componentDidMount: function () {
        setInterval(function () {
            this.setState({ anInteger: this.state.anInteger+1 });
        }.bind(this), 100);
    },
    render: function () {
        return (
            <div>
                <h1>this is my subview {this.state.anInteger}</h1>
                Passed In: {this.props.aPropFromAbove}
                <input type='text'/>
            </div>
        );
    }
});


var MyView = React.createClass({
    getInitialState: function () {
        return {
            time: 0,
            someString: 'foo',
            listOfThings: [1,2,3]
        };
    },

    componentWillMount: function () {
        setInterval(function () {
            this.setState({ time: Date.now() });
        }.bind(this), 10);

        setInterval(function () {
            this.setState({ someString: this.state.someString + 'o' });
        }.bind(this), 1000);

        this.listOfThings = [1,2,3];

        i = 3;
        setInterval(function () {
            i++;
            this.setState({ listOfThings: this.state.listOfThings.concat([i]) });
        }.bind(this), 1000);
    },

    render: function () {
        var children = this.state.listOfThings.map(function (n) {
            return <MySubview key={n} aPropFromAbove={this.state.someString}/>;
        }.bind(this));

        var subc = null;

        if (this.state.someString.length < 20) {
            subc = <MySubview aPropFromAbove={this.state.someString}/>;
        }

        return (
            <div>
                hi!
                {this.state.time}
                {subc}
                {children}
            </div>
        );
    }
});

React.renderComponent(<MyView />, document.body);
