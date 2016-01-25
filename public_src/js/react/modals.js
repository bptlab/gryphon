var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');
var MessageHandler = require('./../messagehandler');

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
    handleClick: function() {
        API.deleteFragment($('#deleteFragmentModalID').val());
        location.reload();
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
                            Are you sure? Do really want to delete exactly this fragment? Here be dragons.
                        </div>
                        <div className="modal-footer">
                            <input
                                type="hidden"
                                name="deleteFragmentModalID"
                                id="deleteFragmentModalID"
                                value=""
                                />
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
            var hidden = $('#deleteFragmentModalID');
            hidden.val(fragid);
            hidden.change();
        })
    }
});

var ModifyFragmentModal = React.createClass({
    getFinalState: function() {
        var hidden = $('#modifyFragmentModalID').val();
        var name = $('#modifyFragmentModalName').val();
        return {
            name: name,
            _id: hidden
        }
    },
    handleSubmit: function() {
        API.exportFragment(this.getFinalState());
        location.reload();
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
                                        />
                                </fieldset>
                                <input
                                    type="hidden"
                                    name="modifyFragmentModalID"
                                    id="modifyFragmentModalID"
                                    value=""
                                    />
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
            var hidden = $('#modifyFragmentModalID');
            hidden.val(fragid);
            hidden.change();
            var text = $('#modifyFragmentModalName');
            text.val(fragname);
            text.change();
        })
    }
});

var CreateScenarioModal = React.createClass({
    getInitialState: function() {
        return {
            name: ''
        }
    },
    handleSubmit: function() {
        if (this.state.name != '') {
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
    handleSubmit: function() {
        var hidden = $('#exportScenarioModalID').val();
        var targeturl = $('#exportScenarioModalURL').val();
        if (targeturl != "") {
            API.exportScenarioToChimera(hidden, targeturl);
            MessageHandler.handleMessage('success','Export succesfull!');
            $('exportScenarioModal').modal('hide');
            //location.reload();
        }
    },
    render: function() {
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
                                <fieldset className="form-group">
                                    <label htmlFor="scenarioName">Target URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exportScenarioModalURL"
                                        placeholder="Target URL"
                                    />
                                    <input
                                        type="hidden"
                                        name="exportScenarioModalID"
                                        id="exportScenarioModalID"
                                        value=""
                                    />
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Export</button>
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
            var hidden = $('#exportScenarioModalID');
            hidden.val(scenid);
            hidden.change();
        })
    }
});

var ModalComponent = React.createClass({
    render: function() {
        return (
            <div>
                <DeleteFragmentModal />
                <ModifyFragmentModal />
                <CreateScenarioModal />
                <ExportScenarioModal />
            </div>
        )
    }
});

module.exports = ModalComponent;