var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var InputWithToggleComponent = require('./../inputwithtoggle');

var FragmentPreconditionsComponent = React.createClass({
    getInitialState: function() {
        return {
            'name': '',
            'preconditions': [],
            '_id': '',
        }
    },
    componentDidMount: function() {
        this.setState({
            name: this.props.fragment.name,
            preconditions: this.props.fragment.preconditions,
            _id: this.props.fragment._id,
        });
    },
    handleNameChange: function(e) {
      return function(e) {
        console.log("e: ", e);
        this.setState({name: e.target.value});
      }.bind(this);
    },
    validatePreCondition: function(precondition) {
        return true;
        // var split = precondition.split(", ");
        // var ret = true;
        // split.forEach(function(dataobject){
        //     var end = dataobject.indexOf("[");
        //     var realend = dataobject.indexOf("]");
        //     if (end == dataobject.length - 1 || end == -1 || realend < dataobject.length - 1) {
        //         MessageHandler.handleMessage("danger","You must specify a state for your pre-condition in: " + dataobject);
        //         return false;
        //     } else {
        //         var substr = dataobject.substring(0,end);
        //         console.log(substr);
        //         var found = false;
        //         this.props.fragment.domainmodel.dataclasses.forEach(function(dataclass){
        //             found = found || (dataclass.name == substr);
        //         }.bind(this));
        //         if (!found) {
        //             MessageHandler.handleMessage("danger","You referenced an invalid dataclass: " + dataobject);
        //             return false;
        //         }
        //     }
        // }.bind(this));
        // return ret;
    },
    handlePreConditionChange: function(index) {
        return handler = function(e) {
            var preconditions = this.state.preconditions;
            preconditions[index] = e.target.value;
            this.setState({preconditions: preconditions});
        }.bind(this);
    },
    validatePreConditionChange: function(index) {
        return function(e) {
            var preconditions = this.state.preconditions;
            preconditions[index] = e.target.value;
            var state = this.validatePreCondition(e.target.value);
            // Dibbilydubbely find my grandgrandparent!
            if (state == false) {
                $(e.target).parent().parent().parent().addClass('has-error');
            } else {
                $(e.target).parent().parent().parent().removeClass('has-error');
            }
        }.bind(this);
    },
    componentDidUpdate: function() {
        if (this.props.fragment._id != this.state._id) {
            this.setState({
                name: this.props.fragment.name,
                preconditions: this.props.fragment.preconditions,
                _id: this.props.fragment._id,
            });
        }
    },
    handleSubmit: function() {
        if (NameCheck.check(this.state.name)) {
            var validationSuccess = true;
            this.state.preconditions.forEach(function(preCondition) {
              console.log("validating ", preCondition);
              if (!this.validatePreCondition(preCondition)) {
                validationSuccess = false;
              }
            }.bind(this));

            MessageHandler.handleMessage("warning","TODO implement saving of Fragment Pre-Conditions!");
            if (validationSuccess) {
              //API.exportScenario(this.state);
              //MessageHandler.handleMessage("success","Saved fragment-details!");
            }
        }
    },
    handleAddPreCondition: function(e) {
        var preconditions = this.state.preconditions;
        preconditions.push("");
        this.setState({preconditions: preconditions});
    },
    handlePreConditionDelete: function(index) {
        return function(e) {
            var preconditions = this.state.preconditions;
            preconditions.splice(index, 1);
            this.setState({preconditions: preconditions}, this.handleSubmit);
        }.bind(this);
    },
    render: function() {
        var preConditions = this.state.preconditions.map(function(precondition, index) {
            return (
              <InputWithToggleComponent
                initialValue={precondition}
                placeholder="New Pre-Condition"
                deletable={true}
                handleChange={this.handlePreConditionChange(index)}
                handleDelete={this.handlePreConditionDelete(index)}
                handleSubmit={this.handleSubmit}
                key={"preCondition" + index}
              />
            );
        }.bind(this));
        return (
            <form className="form-horizontal">
              <h3>Pre-Conditions</h3>

              {preConditions}

              <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={this.handleAddPreCondition}
              >
                  <i className="fa fa-plus"></i> add pre-condition
              </button>

            </form>
        );
    }
});
module.exports = FragmentPreconditionsComponent;
