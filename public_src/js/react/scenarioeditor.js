var React = require('react');
var Link = require('react-router').Link;
var API = require('./../api');
var MessageHandler = require('./../messagehandler');

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
        var split = terminationcondition.split(" ");
        var ret = true;
        split.forEach(function(dataobject){
            var end = dataobject.indexOf("[");
            var realend = dataobject.indexOf("]")
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
        var handler = function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions[index] = e.target.value;
            var state = this.validateTerminationCondition(e.target.value);
            // Dibbilydubbely find my grandgrandparent!
            if (state == false) {
                $(e.target).parent().parent().parent().addClass('has-error');
            } else {
                $(e.target).parent().parent().parent().removeClass('has-error');
            }
            this.setState({terminationconditions: terminationconditions});
        }.bind(this);
        return handler;
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
        API.exportScenario(this.state);
        MessageHandler.handleMessage("success","Saved scenario-details!");
    },
    handleAddTerminationCondition: function(e) {
        var terminationconditions = this.state.terminationconditions;
        terminationconditions.push("New termination condition");
        this.setState({terminationconditions: terminationconditions});
    },
    handleTerminationConditionDelete: function(index) {
        var handler = function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions.splice(index, 1);
            this.setState({terminationconditions: terminationconditions});
        }.bind(this)
        return handler;
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
                                />
                            <span className="input-group-btn">
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={this.handleTerminationConditionDelete(index)}><i className="fa fa-times"></i>
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

var ScenarioStatsForm = React.createClass({
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Scenario Stats</h3>
                </div>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>
                                Fragments
                            </td>
                            <td>
                                {this.props.scenario.fragments.length}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Domain Model Classes
                            </td>
                            <td>
                                {this.props.scenario.domainmodel.dataclasses.length}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

var ScenarioFragmentList = React.createClass({
    getInitialState: function() {
        return {
            newname: ''
        };
    },
    handleNameChange: function(e) {
        this.setState({newname: e.target.value})
    },
    handleFragmentClick: function(e) {
        var newItem = this.state.newname;
        if (newItem && /^[a-zA-Z0-9_]+$/.test(newItem)
            && this.props.scenario.fragments.every(
                function (element, index, array) {
                    return element.name != newItem;
                })) {
            API.createFragment(newItem,function(data, res){
                API.associateFragment(this.props.scenario._id,data._id,function(data, res){
                    this.setState({newname: ''});
                    MessageHandler.handleMessage('success', 'Added new fragment!');
                    this.props.forceRerender();
                }.bind(this));
            }.bind(this));
        } else {
            MessageHandler.handleMessage("warning", "Only unique alphanumeric (+\"_\") names are allowed!");
        }
    },
    render: function() {
        var fragments = this.props.scenario.fragments.map(function(fragment) {
            return (
                <li key={fragment._id} className="list-group-item"><Link to={"fragment/" + fragment._id}>{fragment.name}</Link></li>
            );
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Fragments</div>
                <div className="panel-body">
                    <p>All scenario fragments.</p>
                </div>
                <ul className="list-group">
                    {fragments}
                </ul>
                <div className="panel-footer clearfix">
                    <div className="input-group pull-right">
                        <input type="text" className="form-control" name="newfragmentname" onChange={this.handleNameChange} placeholder="New fragment" />
                        <span className="input-group-btn">
                            <button className="btn btn-success" type="button" onClick={this.handleFragmentClick}>
                                <i className="fa fa-plus"></i> Add fragment
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
});

var ScenarioDomainModelList = React.createClass({
    render: function() {
        var classes = this.props.classes.map(function(dataclass, index) {
            return (
                <li key={index} className="list-group-item">{dataclass.name}</li>
            );
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Domain Model Classnames</div>
                <div className="panel-body">
                    <p>All domain model classes.</p>
                </div>
                <ul className="list-group">
                    {classes}
                </ul>
            </div>
        )
    }
});

var ScenarioOperations = React.createClass({
    handleDelete: function() {
        API.deleteScenario(this.props.scenario._id, function(data, res){
            
        });
    },
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Operations</div>
                <ul className="list-group">
                    <li className="list-group-item">
                        <button
                            type="button"
                            className="btn btn-default btn-block"
                            data-toggle="modal"
                            data-target="#exportScenarioModal"
                            data-scenid={this.props.scenario._id}
                        >
                            Export scenario to chimera
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-block"
                            onClick={this.handleDelete}
                        >
                            Delete scenario
                        </button>
                    </li>
                </ul>
            </div>
        )
    }
});

var ScenarioEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            scenario: {
                name: "",
                revision: 0,
                fragments: [],
                domainmodel: {
                    name: "",
                    revision: 0,
                    dataclasses: []
                },
                terminationconditions: []
            }
        }
    },
    loadScenario: function() {
        var scen_id = this.props.params.id;
        API.getFullScenario(scen_id,true,function(data){
            this.setState({scenario: data});
        }.bind(this));
    },
    componentDidMount: function() {
        this.loadScenario();
    },
    componentDidUpdate: function() {
        if (this.state.scenario._id !== this.props.params.id) {
            this.loadScenario();
        }
    },
    forceRerender: function() {
        this.loadScenario();
    },
    render: function() {
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        <ScenarioEditForm scenario={this.state.scenario}/>
                        <ScenarioFragmentList scenario={this.state.scenario} forceRerender={this.forceRerender} />
                    </div>
                    <div className="col-md-6">
                        <ScenarioStatsForm scenario={this.state.scenario} />
                        <ScenarioOperations scenario={this.state.scenario}/>
                        <ScenarioDomainModelList classes={this.state.scenario.domainmodel.dataclasses}/>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioEditorComponent;