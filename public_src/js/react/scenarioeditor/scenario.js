var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');

var ScenarioEditForm = React.createClass({
    getInitialState: function() {
        return {
            'name': '',
            'terminationconditions': [],
            '_id': ''
        }
    },
    componentDidMount: function() {
        this.setState({
            name: this.props.scenario.name,
            terminationconditions: this.props.scenario.terminationconditions,
            _id: this.props.scenario._id
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
        this.setState({terminationconditions: terminationconditions});
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
    render: function() {
        var terminationConditions = this.state.terminationconditions.map(function(terminationcondition, index) {
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
                            />
                            <span className="input-group-btn">
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
            <div className="panel panel-default">
                <form className="form-horizontal">
                    <div className="panel-heading">
                        <h3 className="panel-title">Scenario Stats</h3>
                    </div>
                    <div className="panel-body">
                        <div className="form-group">
                            <label htmlFor="scenarioname" className="col-sm-2 control-label">Name</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="scenarioname"
                                    placeholder="Name"
                                    value={this.state.name}
                                    onChange = {this.handleNameChange}
                                    onKeyDown = {this.handleEnterSubmit}
                                />
                            </div>
                        </div>
                        {terminationConditions}
                    </div>
                    <div className="panel-footer clearfix">
                        <div className="btn-group pull-right">
                            <button type="button" className="btn btn-primary" onClick={this.handleSubmit} >Submit</button>
                            <button type="button" className="btn btn-default" onClick={this.handleAddTerminationCondition}>Add termination condition</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});
module.exports = ScenarioEditForm;