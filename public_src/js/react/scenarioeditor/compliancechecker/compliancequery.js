var React = require('react');
var InputWithToggleComponent = require('./../../inputwithtoggle');

var ComplianceQueryComponent = React.createClass({
    getInitialState: function() {
        return {
            'query': ''
        }
    },
    componentDidMount: function() {
    },
    componentDidUpdate: function() {
    },
    handleChange: function(e) {
        this.setState({query: e.target.value});
    },
    handleSubmit: function() {
        console.log(this.props);
        if (this.props.handleChange) {
            this.props.handleChange(this.state.query);
        }
    },
    render: function() {
        return (
              <InputWithToggleComponent
                initialValue={this.state.query}
                placeholder="Your compliance query"
                deletable={false}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
              />
        );
    }
});
module.exports = ComplianceQueryComponent;
