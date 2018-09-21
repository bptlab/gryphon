var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');

var InputWithToggleComponent = require('./../inputwithtoggle');

var Description = React.createClass({
    getInitialState: function() {
        return {
            'description': '',
            _id: ''
        }
    },
    componentDidMount: function() {
        this.setState({
            description: this.props.scenario.description,
            _id: this.props.scenario._id
        });
    },
    componentDidUpdate: function() {
        if (this.props.scenario._id != this.state._id) {
            this.setState({
                description: this.props.scenario.description,
                _id: this.props.scenario._id
            });
        }
    },
    handleChange: function(e) {
        this.setState({description: e.target.value});
    },
    handleSubmit: function() {
        API.exportScenario(this.state, function() {
            MessageHandler.handleMessage("success","Saved description!");
        }.bind(this));
    },
    render: function() {
        return (
          <form className="form-horizontal">
              <h3>Description</h3>
              <InputWithToggleComponent
                initialValue={this.state.description}
                placeholder="The description for the Case Model"
                deletable={false}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
              />
          </form>
        );
    }
});
module.exports = Description;
