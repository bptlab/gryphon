var React = require('react');
var API = require('./../api');
var MessageHandler = require('./../messagehandler');
var NameCheck = require('./../namecheck');
var InputWithToggleComponent = require('./inputwithtoggle');

var DataObjectReference = React.createClass({
    getInitialState: function() {
        return {
            'dataObjectReference': '',
            'initialValue': '',
        }
    },
    componentWillReceiveProps: function(newProps) {
        if (this.state.initialValue != newProps.dataObjectReference) {
          this.setState({
            dataObjectReference : newProps.dataObjectReference,
            initialValue : newProps.dataObjectReference
          })
        }
    },
    validateDataObjectReference: function(dataObjectReference, showErrors) {
        var individualReferences = dataObjectReference.split(',');
        var ret = true;
        individualReferences.forEach(function(reference) {
            reference = reference.trim();
            ret |= this.validateReference(reference, showErrors);
        }.bind(this));
        return ret;
    },
    validateReference: function(individualReference, showErrors) {
      console.log(individualReference);
      var end = individualReference.indexOf("[");
      var realend = individualReference.indexOf("]");
      if (end == individualReference.length - 1 || end == -1 || realend < individualReference.length - 1) {
          if (showErrors)
            MessageHandler.handleMessage("danger","You must specify a state for your data object reference in: " + individualReference);

          return false;
      } else {
          var substr = individualReference.substring(0,end);
          console.log(substr);
          var found = false;
          this.props.scenario.domainmodel.dataclasses.forEach(function(dataclass){
              found = found || (dataclass.name == substr);
          }.bind(this));
          if (!found) {
              if (showErrors)
                MessageHandler.handleMessage("danger","You referenced an invalid dataclass: " + individualReference);

              return false;
          }
      }
      return true;
    },
    handleChange: function(e) {
        this.setState({dataObjectReference: e.target.value}, this.validateDataObjectReferenceChange);
    },
    validateChange: function() {
        var state = this.validateDataObjectReference(this.state.dataObjectReference, false);
        // // Dibbilydubbely find my grandgrandparent!
        // if (state == false) {
        //     $(e.target).parent().parent().parent().addClass('has-error');
        // } else {
        //     $(e.target).parent().parent().parent().removeClass('has-error');
        // }
    },

    handleSubmit: function() {
        console.log("validating ", this.state.dataObjectReference);
        if (!this.validateDataObjectReference(this.state.dataObjectReference, true)) {
          return false;
        }

        this.props.handleSubmit(this.state.dataObjectReference);
    },
    handleDelete: function() {
        this.props.handleDelete();
    },
    render: function() {
        return (
          <InputWithToggleComponent
            initialValue={this.state.dataObjectReference}
            placeholder="e.g. Application[archived], CreditCard[activated]"
            deletable={true}
            handleChange={this.handleChange}
            handleDelete={this.handleDelete}
            handleSubmit={this.handleSubmit}
          />
        );
    }
});
module.exports = DataObjectReference;
