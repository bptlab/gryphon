var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var DataObjectReference = require('./../dataobjectreference');

var TerminationConditionsComponent = React.createClass({
    getInitialState: function() {
        return {
            'terminationconditions': [''],
            _id: ''
        }
    },
    componentDidMount: function() {
        this.setState({
            terminationconditions: this.props.scenario.terminationconditions,
            _id: this.props.scenario._id
          });
    },
    componentDidUpdate: function() {
        if (this.props.scenario._id != this.state._id) {
            this.setState({
                terminationconditions: this.props.scenario.terminationconditions,
                _id: this.props.scenario._id
            });
        }
    },
    handleAdd: function() {
        var terminationconditions = this.state.terminationconditions;
        terminationconditions.push("");
        this.setState({terminationconditions: terminationconditions});
    },
    handleDelete: function(index) {
        return function() {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions.splice(index, 1);
            this.setState({terminationconditions: terminationconditions}, this.submitAll);
        }.bind(this);
    },
    handleSubmit: function(index) {
        return function(terminationCondition) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions[index] = terminationCondition;
            this.setState({terminationconditions: terminationconditions}, this.submitAll);
        }.bind(this);
    },
    submitAll: function(index) {
        API.exportScenario(this.state, function() {
            MessageHandler.handleMessage("success","Saved termination conditions!");
        }.bind(this));
    },
    render: function() {
        var terminationConditionComponents = this.state.terminationconditions.map(function(terminationCondition, index) {
            return (
              <DataObjectReference
                scenario = {this.props.scenario}
                handleDelete = {this.handleDelete(index)}
                handleSubmit = {this.handleSubmit(index)}

                dataObjectReference = {terminationCondition}
                key={"terminationCondition" + index}
              />
            );
        }.bind(this));

        return (
            <form className="form-horizontal">
              <h3>Termination Conditions</h3>

              {terminationConditionComponents}

              <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={this.handleAdd}
              >
                  <i className="fa fa-plus"></i> add termination condition
              </button>

              <a
                data-toggle="tooltip"
                title="A case can terminate if one of its termination conditions is fulfilled. Each termination condition specifies that certain data objects need to be in a specific state, e.g. Application[archived], CreditCard[activated]."
              >
                <i className="fa fa-info-circle"></i>
              </a>

            </form>
        );
    }
});
module.exports = TerminationConditionsComponent;
