var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');

var TerminationConditionsComponent = React.createClass({
    getInitialState: function() {
        return {
            'name': '',
            'terminationconditions': [],
            '_id': '',
            'isEditable': []
        }
    },
    componentDidMount: function() {
        var isEditable = this.props.scenario.terminationconditions.map(function(condition){ return false });
        this.setState({
            name: this.props.scenario.name,
            terminationconditions: this.props.scenario.terminationconditions,
            _id: this.props.scenario._id,
            isEditable : isEditable
        });
    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
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
                _id: this.props.scenario._id
            });
        }
    },
    handleSubmit: function() {
        if (NameCheck.check(this.state.name)) {
            API.exportScenario(this.state);
            MessageHandler.handleMessage("success","Saved scenario-details!");
        }
    },
    handleAddTerminationCondition: function(e) {
        var terminationconditions = this.state.terminationconditions;
        terminationconditions.push("New termination condition");
        var isEditable = this.state.isEditable;
        isEditable.push(true);
        this.setState({terminationconditions: terminationconditions, isEditable: isEditable});
    },
    handleTerminationConditionDelete: function(index) {
        return function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions.splice(index, 1);
            this.setState({terminationconditions: terminationconditions});
        }.bind(this);
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.handleSubmit()
        }
    },
    handleEditButtonClicked: function(index) {
      console.log("handleEditButtonClicked isEditable: ", this.state.isEditable);
        if (this.state.isEditable[index]) {
          this.handleSubmit();
        }
        var newIsEditable = this.state.isEditable;
        newIsEditable[index] = ! newIsEditable[index];
        this.setState({isEditable: newIsEditable});
    },
    render: function() {
        var terminationConditions = this.state.terminationconditions.map(function(terminationcondition, index) {
            var editButtonIcon = this.state.isEditable[index] ? "fa fa-check" : "fa fa-pencil";
            var disabled = this.state.isEditable[index] == false;
            console.log("disabled: ", disabled, " index: ", index);
            return (
                <div className="form-group" key={index}>
                    <label htmlFor={"terminationcondition" + index} className="col-sm-2 control-label">Termination Condition {index + 1}</label>
                    <div className="col-sm-10">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id={"terminationcondition" + index}
                                placeholder="Termination Condition"
                                value = {terminationcondition}
                                onChange = {this.handleTerminationConditionChange(index)}
                                onBlur = {this.validateTerminationConditionChange(index)}
                                onKeyDown = {this.handleEnterSubmit}
                                disabled = {disabled}
                            />
                            <span className="input-group-btn">
                              <button
                                  className="btn btn-success"
                                  type="button"
                                  onClick={this.handleEditButtonClicked}><i className={editButtonIcon} />
                              </button>
                              <button
                                  className="btn btn-danger"
                                  type="button"
                                  onClick={this.handleTerminationConditionDelete(index)}><i className="fa fa-times" />
                              </button>
                            </span>
                        </div>
                    </div>
                </div>
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
              <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={this.handleSubmit}
              >
                  <i className="fa fa-plus"></i> submit
              </button>
            </form>
        );
    }
});
module.exports = TerminationConditionsComponent;
