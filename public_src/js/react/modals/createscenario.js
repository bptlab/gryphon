var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var SideBarManager = require('./../../sidebarmanager');

var CreateScenarioModal = React.createClass({
    getInitialState: function() {
        return {
            name: ''
        }
    },
    handleSubmit: function() {
        if (NameCheck.check(this.state.name)) {
            API.createScenario(this.state.name);
            SideBarManager.reload();
            $('#createScenarioModal').modal('hide');
        }
    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.handleSubmit()
        }
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
                                        onKeyDown={this.handleEnterSubmit}
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
module.exports = CreateScenarioModal;