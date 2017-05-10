var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var InputWithToggleComponent = require('./inputwithtoggle');

var TerminationConditionsComponent = React.createClass({
    getInitialState: function() {
        return {
            'name': '',
            'terminationconditions': [],
            '_id': '',
        }
    },
    componentDidMount: function() {
        this.setState({
            name: this.props.scenario.name,
            terminationconditions: this.props.scenario.terminationconditions,
            _id: this.props.scenario._id,
        });
    },
    handleNameChange: function(e) {
      return function(e) {
        console.log("e: ", e);
        this.setState({name: e.target.value});
      }.bind(this);
    },
    validateTerminationCondition: function(terminationcondition) {
        var split = terminationcondition.split(", ");
        var ret = true;
        split.forEach(function(dataobject){
            var end = dataobject.indexOf("[");
            var realend = dataobject.indexOf("]");
            if (end == dataobject.length - 1 || end == -1 || realend < dataobject.length - 1) {
                MessageHandler.handleMessage("danger","You must specify a state for your termination condition in: " + dataobject);
                ret = false;
            } else {
                var substr = dataobject.substring(0,end);
                console.log(substr);
                var found = false;
                this.props.scenario.domainmodel.dataclasses.forEach(function(dataclass){
                    found = found || (dataclass.name == substr)
                }.bind(this));
                if (!found) {
                    MessageHandler.handleMessage("danger","You referenced an invalid dataclass: " + dataobject);
                    ret = false;
                }
            }
        }.bind(this));
        return ret;
    },
    handleTerminationConditionChange: function(index) {
        return handler = function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions[index] = e.target.value;
            this.setState({terminationconditions: terminationconditions});
        }.bind(this);
    },
    validateTerminationConditionChange: function(index) {
        return function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions[index] = e.target.value;
            var state = this.validateTerminationCondition(e.target.value);
            // Dibbilydubbely find my grandgrandparent!
            if (state == false) {
                $(e.target).parent().parent().parent().addClass('has-error');
            } else {
                $(e.target).parent().parent().parent().removeClass('has-error');
            }
        }.bind(this);

    },
    componentDidUpdate: function() {
        if (this.props.scenario._id != this.state._id) {
            this.setState({
                name: this.props.scenario.name,
                terminationconditions: this.props.scenario.terminationconditions,
                _id: this.props.scenario._id,
            });
        }
    },
    handleSubmit: function() {
        if (NameCheck.check(this.state.name)) {
            var validationSuccess = true;
            this.state.terminationconditions.forEach(function(terminationCondition) {
              console.log("validating ", terminationCondition);
              if (!this.validateTerminationCondition(terminationCondition)) {
                validationSuccess = false;
              }
            }.bind(this));

            if (validationSuccess) {
              API.exportScenario(this.state);
              MessageHandler.handleMessage("success","Saved scenario-details!");
            }
        }
    },
    handleAddTerminationCondition: function(e) {
        var terminationconditions = this.state.terminationconditions;
        terminationconditions.push("");
        this.setState({terminationconditions: terminationconditions});
    },
    handleTerminationConditionDelete: function(index) {
        return function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions.splice(index, 1);
            this.setState({terminationconditions: terminationconditions}, this.handleSubmit);
        }.bind(this);
    },
    render: function() {
        var terminationConditions = this.state.terminationconditions.map(function(terminationcondition, index) {
            return (
              <InputWithToggleComponent
                initialValue={terminationcondition}
                placeholder="New Termination Condition"
                label="Termination Condition"
                deletable={true}
                handleChange={this.handleTerminationConditionChange(index)}
                handleDelete={this.handleTerminationConditionDelete(index)}
                handleSubmit={this.handleSubmit}
                key={"terminationCondition" + index}
              />
            );
        }.bind(this));
        return (
            <form className="form-horizontal">
              {terminationConditions}

              <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={this.handleAddTerminationCondition}
              >
                  <i className="fa fa-plus"></i> add termination condition
              </button>
            </form>
        );
    }
});
module.exports = TerminationConditionsComponent;
