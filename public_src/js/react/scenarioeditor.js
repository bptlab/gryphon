var React = require('react');
var Link = require('react-router').Link;
var API = require('./../api');
var MessageHandler = require('./../messagehandler');
var NameCheck = require('./../namecheck');
var SideBarManager = require('./../sidebarmanager');

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
        var handler = function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions[index] = e.target.value;
            this.setState({terminationconditions: terminationconditions});
        }.bind(this);
        return handler;
    },
    validateTerminationConditionChange: function(index) {
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
        var handler = function(e) {
            var terminationconditions = this.state.terminationconditions;
            terminationconditions.splice(index, 1);
            this.setState({terminationconditions: terminationconditions});
        }.bind(this);
        return handler;
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

var ScenarioStartConditionForm = React.createClass({
    getInitialState: function() {
        return {
            'startconditions':[],
            '_id':''
        }
    },
    handleUpdate: function(index){
        return function(obj) {
            var startconditions = this.state.startconditions;
            startconditions[index] = obj;
            this.setState({
                'startconditions':startconditions
            })
        }.bind(this)
    },
    componentDidUpdate: function() {
        if (this.state._id != this.props.scenario._id && this.props.scenario._id != undefined) {
            this.setState(
                {
                    '_id':this.props.scenario._id,
                    'startconditions':this.props.scenario.startconditions
                }
            )
        }
    },
    handleSubmit: function() {
        API.exportScenario(this.state);
    },
    handleAdd: function() {
        var conds = this.state.startconditions;
        conds.push({
            'query':'',
            'mapping':[{'attr':'','classname':'','path':''}]
        });
        this.setState({
            'startconditions':conds
        })
    },
    handleDelete: function(index){
        return function() {
            var startconditions = this.state.startconditions;
            startconditions.splice(index,1);
            this.setState({
                'startconditions':startconditions
            })
        }.bind(this)
    },
    render: function() {
        var conditions = this.state.startconditions.map(function(condition,index){
            return (
                <ScenarioSingleStartCondition
                    id={condition._id}
                    mapping={condition.mapping}
                    query={condition.query}
                    handleChange={this.handleUpdate(index)}
                    availableClasses={this.props.scenario.domainmodel.dataclasses}
                    handleSubmit={this.handleSubmit}
                    handleDelete={this.handleDelete(index)}
                />
            )
        }.bind(this));
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Start-Conditions</h3>
                </div>
                <div className="panel-body">
                    <div className="panel-group">
                        {conditions}
                    </div>
                </div>
                <div className="panel-footer clearfix">
                    <div className="btn-group pull-right">
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit} >Submit</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleAdd} >Add new</button>
                    </div>
                </div>
            </div>
        )
    }
});

var ScenarioSingleStartCondition = React.createClass({
    getInitialState: function() {
        return {
            'collapsed': ''
        }
    },
    handleDataClassChange: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping[index]['classname'] = e.target.value;
            new_mapping[index]['attr'] = '';
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleDataClassAttrChange: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping[index]['attr'] = e.target.value;
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleJSONPathChange: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping[index]['path'] = e.target.value;
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleAdd: function() {
        var new_mapping = this.props.mapping;
        new_mapping.push({
            'path': '',
            'classname': '',
            'attr': ''
        });
        this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
    },
    handleDelete: function(index) {
        return function(e) {
            var new_mapping = this.props.mapping;
            new_mapping.splice(index, 1);
            this.props.handleChange({'mapping':new_mapping,'query': this.props.query});
        }.bind(this)
    },
    handleStartConditionChange: function(e) {
        this.props.handleChange({'mapping':this.props.mapping, 'query': e.target.value})
    },
    handleCollapse: function() {
        var collapsed = this.state.collapsed == '' ? 'in' : '';
        this.setState({'collapsed':collapsed})
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.props.handleSubmit()
        }
    },
    updateSelect: function() {
        console.log('Dont care');
        this.props.mapping.forEach(function(mapel){
            $('#' + mapel._id + "-dtselect-class").selectpicker();
            $('#' + mapel._id + "-dtselect-attr").selectpicker()
        });
    },
    /*
    componentDidMount: function() {
        this.updateSelect()
    },
    componentDidUpdate: function() {
        this.updateSelect()
    }, */
    render: function() {
        var mapping = this.props.mapping.map(function(mapel, index){
            var dmclass = this.props.availableClasses.filter(function(dmclass){
                return dmclass.name == mapel.classname;
            });

            var availableClasses = this.props.availableClasses.map(function(dmclass){
                return (
                    <option value={dmclass.name}>{dmclass.name}</option>
                )
            });

            var availableAttributes = [];
            if (dmclass.length == 1) {
                availableAttributes = dmclass[0].attributes.map(function(attr){
                    return (
                        <option value={attr.name}>{attr.name}</option>
                    )
                })
            }
            return (
                <tr key={mapel._id}>
                    <td>
                        <select className="form-control" onChange={this.handleDataClassChange(index)} value={mapel.classname} id={mapel._id + "-dtselect-class"}>
                            <optgroup label="Available Data Classes">
                                <option value="">Nothing</option>
                                {availableClasses}
                            </optgroup>
                        </select></td>
                    <td>
                        <select className="form-control" onChange={this.handleDataClassAttrChange(index)} value={mapel.attr} id={mapel._id + "-dtselect-attr"}>
                            <optgroup label="Available Attributes">
                                <option value="">Nothing</option>
                                {availableAttributes}
                            </optgroup>
                        </select></td>
                    <td>
                        <input type="text"
                               onKeyDown={this.handleEnterSubmit}
                               className="form-control"
                               onChange={this.handleJSONPathChange(index)}
                               value={mapel.jsonpath}
                        />
                    </td>
                    <td>
                        <button type="button" className="btn btn-danger" onClick={this.handleDelete(index)}><i className="fa fa-times" /></button>
                    </td>
                </tr>
            )
        }.bind(this));
        var btntext = this.state.collapsed == '' ? 'Show' : 'Hide';
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Startcondition
                        <button type="button" className="btn btn-xs pull-right" onClick={this.handleCollapse}>{btntext}</button>
                        <button type="button" className="btn btn-xs pull-right btn-danger" onClick={this.props.handleDelete}><i className="fa fa-times" /></button>
                    </h3>
                </div>
                <div className={"panel-collapse collapse " + this.state.collapsed} id={"StartConditionPanel" + this.props.id}>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <input type="text"
                                       className="form-control"
                                       onChange={this.handleStartConditionChange}
                                       value={this.props.query}
                                       onKeyDown={this.handleEnterSubmit}
                                />
                            </div>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Dataclass</th>
                                <th>Attribute</th>
                                <th>JSON-Path</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mapping}
                        </tbody>
                    </table>
                    <div className="panel-footer">
                        <button type="button" className="btn btn-primary" onClick={this.handleAdd} >Add new</button>
                    </div>
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
        if (NameCheck.check(newItem) &&
            NameCheck.isUnique(newItem, this.props.scenario.fragments)) {
            API.createFragment(newItem,function(data, res){
                API.associateFragment(this.props.scenario._id,data._id,function(data, res){
                    this.setState({newname: ''});
                    MessageHandler.handleMessage('success', 'Added new fragment!');
                    this.props.forceRerender();
                }.bind(this));
            }.bind(this));
        }
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.handleFragmentClick(e)
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
                        <input type="text"
                               className="form-control"
                               name="newfragmentname"
                               onChange={this.handleNameChange}
                               placeholder="New fragment"
                               value={this.state.newname}
                               onKeyDown={this.handleEnterSubmit}
                        />
                        <span className="input-group-btn">
                            <button className="btn btn-success" type="button" onClick={this.handleFragmentClick}>
                                <i className="fa fa-plus" /> Add fragment
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
                            data-toggle="modal"
                            data-target="#deleteScenarioModal"
                            data-scenid={this.props.scenario._id}
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
                terminationconditions: [],
                _id: "",
                startconditions: []
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
        MessageHandler.resetMessages();
    },
    componentDidUpdate: function() {
        if (this.state.scenario._id !== this.props.params.id) {
            this.loadScenario();
            MessageHandler.resetMessages();
        }
    },
    forceRerender: function() {
        this.loadScenario();
        SideBarManager.reload();
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
                        <ScenarioStartConditionForm scenario={this.state.scenario} />
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioEditorComponent;