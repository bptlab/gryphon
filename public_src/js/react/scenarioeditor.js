var React = require('react');
var Link = require('react-router').Link;
var API = require('./../api');

var ScenarioEditForm = React.createClass({
    getInitialState: function() {
        return {
            'name': '',
            'terminationcondition': '',
            '_id': ''
        }
    },
    componentDidMount: function() {
        this.setState({
            name: this.props.scenario.name,
            terminationcondition: this.props.scenario.terminationcondition,
            _id: this.props.scenario._id
        });
    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    handleTerminationConditionChange: function(e) {
        this.setState({terminationcondition: e.target.value});
    },
    componentDidUpdate: function() {
        if (this.props.scenario._id != this.state._id) {
            this.setState({
                name: this.props.scenario.name,
                terminationcondition: this.props.scenario.terminationcondition,
                _id: this.props.scenario._id
            });
        }
    },
    handleSubmit: function(e) {
        API.exportScenario(this.state, false, function(res){});
    },
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Scenario Stats</h3>
                </div>
                <div className="panel-body">
                    <form className="form-horizontal" onSubmit={this.handleSubmit} >
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
                    <div className="form-group">
                        <label htmlFor="terminationcondition" className="col-sm-2 control-label">Termination Condition</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                id="terminationcondition"
                                placeholder="Termination Condition"
                                value = {this.state.terminationcondition}
                                onChange = {this.handleTerminationConditionChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">Submit</button>
                        </div>
                    </div>
                    </form>
                </div>
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
    render: function() {
        var fragments = this.props.fragments.map(function(fragment) {
            return (
                <li className="list-group-item"><Link to={"fragment/" + fragment._id}>{fragment.name}</Link></li>
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
            </div>
        )
    }
});

var ScenarioDomainModelList = React.createClass({
    render: function() {
        var classes = this.props.classes.map(function(dataclass) {
            return (
                <li className="list-group-item">{dataclass.name}</li>
            );
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Domain Model classNamees</div>
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
                }
            }
        }
    },
    loadScenario: function() {
        var scen_id = this.props.params.id;
        API.getFullScenario(scen_id,'1',function(data){
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
    render: function() {
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        <ScenarioEditForm scenario={this.state.scenario}/>
                    </div>
                    <div className="col-md-6">
                        <ScenarioStatsForm scenario={this.state.scenario} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ScenarioFragmentList fragments={this.state.scenario.fragments} />
                    </div>
                    <div className="col-md-6">
                        <ScenarioDomainModelList classes={this.state.scenario.domainmodel.dataclasses}/>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioEditorComponent;