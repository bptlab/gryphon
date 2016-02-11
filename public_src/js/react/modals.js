var Config = require('./../config');
var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');
var MessageHandler = require('./../messagehandler');
var MessageComponent = require('./messagebar').MessageComponent;
var Link = require('react-router').Link;
var NameCheck = require('./../namecheck');

/**
 * All modals used in the project
 * They are up here because bootstrap modals should be placed below the root node of the page.
 * Calling them becomes quite complex because of this (It would be necessary to provide a callback down through every module)
 * Instead of this I used the basic bootstrap logic (attributes of buttons or links)
 * This made the transport of data to the modal quite complex.
 * The data is stored as attribute in the calling button or link and is read here again when the modal is created.
 * This is a quite ugly way (totally not the react-way of life, but it's the way
 * preferred by bootstrap) but it seemed as the best solution when I wrote that.
 * I'm sorry.
 */

var DeleteFragmentModal = React.createClass({
    getInitialState: function() {
        return {
            fragID: ""
        }
    },
    handleClick: function() {
        if (this.state.fragID != "") {
            API.deleteFragment(this.state.fragID);
            location.reload();
        }
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="deleteFragmentModalLabel" id="deleteFragmentModal">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="deleteFragmentModalLabel">DELETE A FRAGMENT</h4>
                        </div>
                        <div className="modal-body">
                            Are you sure? Do really want to delete this fragment?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" onClick={this.handleClick}>Delete Fragment</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        $('#deleteFragmentModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var fragid = button.data('fragid');
            this.setState({fragID:fragid});
        }.bind(this))
    }
});

var DeleteScenarioModal = React.createClass({
    getInitialState: function() {
        return {
            scenID: ""
        }
    },
    handleClick: function() {
        if (this.state.scenID != "") {
            API.deleteScenario(this.state.scenID);
            location.reload();
        }
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="deleteScenarioModalLabel" id="deleteScenarioModal">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="deleteScenarioModalLabel">DELETE A SCENARIO</h4>
                        </div>
                        <div className="modal-body">
                            Are you sure? Do really want to delete this scenario?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" onClick={this.handleClick}>Delete Scenario</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        $('#deleteScenarioModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var scenid = button.data('scenid');
            this.setState({scenID:scenid});
        }.bind(this))
    }
});

var ModifyFragmentModal = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            fragID: ''
        }
    },
    getFinalState: function() {
        return {
            name: this.state.name,
            _id: this.state.fragID
        }
    },
    handleSubmit: function() {
        var newFragment = this.getFinalState();
        if (NameCheck.check(newFragment.name)) {
            API.exportFragment(newFragment);
            location.reload();
        }
    },
    handleChange: function(e) {
        this.setState({name: e.target.value})
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="modifyFragmentModalLabel" id="modifyFragmentModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="modifyFragmentModalLabel">Change fragment details</h4>
                            </div>
                            <div className="modal-body">
                                <fieldset className="form-group">
                                    <label htmlFor="fragmentNameModal">Fragment Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modifyFragmentModalName"
                                        placeholder="Fragment name"
                                        onChange={this.handleChange}
                                        value={this.state.name}
                                        />
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        $('#modifyFragmentModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var fragid = button.data('fragid');
            var fragname = button.data('fragname');
            this.setState({fragID:fragid,name:fragname})
        }.bind(this))
    }
});

var CreateScenarioModal = React.createClass({
    getInitialState: function() {
        return {
            name: ''
        }
    },
    handleSubmit: function() {
        if (NameCheck.check(this.state.name)) {
            API.createScenario(this.state.name);
            location.reload();
        }
    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="createScenarioModalTitle" id="createScenarioModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="createScenarioModalTitle">Create a new scenario</h4>
                            </div>
                            <div className="modal-body">
                                <fieldset className="form-group">
                                    <label htmlFor="scenarioName">Scenario Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="createScenarioModalName"
                                        placeholder="Scenario name"
                                        value={this.state.name}
                                        onChange={this.handleNameChange}
                                        />
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create scenario</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});

var ExportScenarioModal = React.createClass({
    getInitialState: function() {
        return {
            messages: [],
            targets: [],
            selectedTargetURL: "Download scenario as JSON.",
            selectedTarget: "",
            scenID: ""
        }
    },
    handleTargetChange: function(e) {
        this.setState({selectedTarget: e.target.value});
        this.state.targets.forEach(function(target){
            if (target._id == e.target.value) {
                this.setState({selectedTargetURL: target.url});
            }
        }.bind(this));
        if (e.target.value == "") {
            this.setState({selectedTargetURL: "Download scenario as JSON."})
        }
    },
    handleSubmit: function() {
        if (this.state.selectedTarget != "") {
            API.exportScenarioToChimera(this.state.scenID, this.state.selectedTarget, function(response){
                MessageHandler.handleMessage('success','Export succesfull!');
            });
            $('#exportScenarioModal').modal('hide');
        } else {
            window.location.replace(Config.API_HOST + 'scenario/' + this.state.scenID + '?populate=true&download=true');
        }
    },
    render: function() {
        var messages = this.state.messages.map(function(message){
            return (<MessageComponent type={message.type} text={message.text} allow_dismiss={false} />);
        });
        var btn_state = ((messages.length > 0) ? "danger" : "primary");
        if (messages.length == 0) {
            messages.push(<MessageComponent type="success" text="Scenario validated, everything okay!" allow_dismiss={false} />);
        }
        var targets = this.state.targets.map(function(target){
            return <option value={target._id}>{target.name}</option>
        });
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="exportScenarioModalTitle" id="exportScenarioModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="exportScenarioModalTitle">Export this scenario</h4>
                            </div>
                            <div className="modal-body">
                                {messages}
                                <fieldset className="form-group">
                                    <label htmlFor="exportScenarioModalTargetSelect">Target</label>
                                    <div className="row">
                                        <div className="col-md-9">
                                            <select name="exportScenarioModalTargetSelect"
                                                    id="exportScenarioModalTargetSelect"
                                                    value={this.state.selectedTarget}
                                                    onChange={this.handleTargetChange}
                                                    className="form-control">
                                                <option value="">Download scenario</option>
                                                {targets}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <Link to="exportconfig" className="btn btn-success btn-block">
                                                Add target
                                            </Link>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Target URL</label>
                                    <input type="text" className="form-control" value={this.state.selectedTargetURL} readOnly="true"/>
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className={"btn btn-" + btn_state} onClick={this.handleSubmit}>Export</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        $('#exportScenarioModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var scenid = button.data('scenid');
            this.setState({scenID: scenid});
            API.validateScenario(scenid, function(data){
                this.setState({messages: data});
            }.bind(this));
            API.getAvailableExports(function(exports){
                this.setState({targets: exports});
            }.bind(this))
        }.bind(this))
    }
});

var ModalComponent = React.createClass({
    render: function() {
        return (
            <div>
                <DeleteFragmentModal />
                <ModifyFragmentModal />
                <CreateScenarioModal />
                <DeleteScenarioModal />
                <ExportScenarioModal />
            </div>
        )
    }
});

module.exports = ModalComponent;