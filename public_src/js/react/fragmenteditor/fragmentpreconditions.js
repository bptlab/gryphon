var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var DataObjectReference = require('./../dataobjectreference');

var PreConditionsComponent = React.createClass({
    getInitialState: function() {
        return {
            'preconditions': [''],
            _id: ''
        }
    },
    componentDidMount: function() {
        this.setState({
            preconditions: this.props.fragment.preconditions,
            _id: this.props.fragment._id
          });
    },
    componentDidUpdate: function() {
        if (this.props.fragment._id != this.state._id) {
            this.setState({
                preconditions: this.props.fragment.preconditions,
                _id: this.props.fragment._id
            });
        }
    },
    handleAdd: function() {
        var preconditions = this.state.preconditions;
        preconditions.push("");
        this.setState({preconditions: preconditions});
    },
    handleDelete: function(index) {
        return function() {
            var preconditions = this.state.preconditions;
            preconditions.splice(index, 1);
            this.setState({preconditions: preconditions}, this.submitAll);
        }.bind(this);
    },
    handleSubmit: function(index) {
        return function(preCondition) {
            var preconditions = this.state.preconditions;
            preconditions[index] = preCondition;
            this.setState({preconditions: preconditions}, this.submitAll);
        }.bind(this);
    },
    submitAll: function(index) {
        this.props.onChanged(this.state.preconditions);
    },
    render: function() {
        var preConditionComponents = this.state.preconditions.map(function(preCondition, index) {
            return (
              <DataObjectReference
                scenario = {this.props.scenario}
                handleDelete = {this.handleDelete(index)}
                handleSubmit = {this.handleSubmit(index)}

                dataObjectReference = {preCondition}
                key={"preCondition" + index}
              />
            );
        }.bind(this));

        return (
            <form className="form-horizontal">
              <h3>Pre-Conditions</h3>

              {preConditionComponents}

              <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={this.handleAdd}
              >
                  <i className="fa fa-plus"></i> add pre-condition
              </button>

              <a
                data-toggle="tooltip"
                title="A fragment can execute if one of its pre-conditions is fulfilled. Each pre-condition specifies that certain data objects need to be in a specific state, e.g. Application[archived], CreditCard[activated]."
              >
                <i className="fa fa-info-circle"></i>
              </a>

            </form>
        );
    }
});
module.exports = PreConditionsComponent;
