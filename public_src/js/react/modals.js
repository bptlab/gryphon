var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');

var DeleteFragmentModal = React.createClass({
    handleClick: function() {
        API.deleteFragment($('#fragmentDeleteModalID').val());
        location.reload();
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="deleteFragmentModalLabel" id="deleteFragmentModal">
                <div className="modal-dialog modal-sm">
                    <div className="modal-body">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="deleteFragmentModalLabel">DELETE A FRAGMENT</h4>
                        </div>
                        <div className="modal-content">
                            Are you sure? Do really want to delete exactly this fragment? Here be dragons.
                        </div>
                        <div className="modal-footer">
                            <input
                                type="hidden"
                                name="fragmentDeleteModalID"
                                id="fragmentDeleteModalID"
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
            var hidden = $('#fragmentDeleteModalID');
            hidden.val(fragid);
            hidden.change();
        })
    }
});

var ModifyFragmentModal = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            id: ''
        }
    },
    getFinalState: function() {
        var hidden = $('#fragmentIDModal').val();
        var name = $('#fragmentNameModal').val();
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
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="changeFragmentModalLabel" id="changeFragmentModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="changeFragmentModalLabel">Change fragment details</h4>
                            </div>
                            <div className="modal-body">
                                <fieldset className="form-group">
                                    <label htmlFor="fragmentNameModal">Fragment Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fragmentNameModal"
                                        placeholder="Fragment name"
                                        />
                                </fieldset>
                                <input
                                    type="hidden"
                                    name="fragmentIDModal"
                                    id="fragmentIDModal"
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
        $('#changeFragmentModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var fragid = button.data('fragid');
            var fragname = button.data('fragname');
            var hidden = $('#fragmentIDModal');
            hidden.val(fragid);
            hidden.change();
            var text = $('#fragmentNameModal');
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
        console.log('Triggered name change.');
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
                                        id="scenarioCreateName"
                                        placeholder="Scenario name"
                                        value={this.state.name}
                                        onChange={this.handleNameChange}
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
    }
});

var ModalComponent = React.createClass({
    render: function() {
        return (
            <div>
                <DeleteFragmentModal />
                <ModifyFragmentModal />
                <CreateScenarioModal />
            </div>
        )
    }
});

module.exports = ModalComponent;