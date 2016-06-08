var React = require('react');
var API = require('./../../api');
var SideBarManager = require('./../../sidebarmanager');

var DeleteScenarioModal = React.createClass({
    getInitialState: function() {
        return {
            scenID: ""
        }
    },
    handleClick: function() {
        if (this.state.scenID != "") {
            API.deleteScenario(this.state.scenID);
            SideBarManager.reload();
            $('#deleteScenarioModal').modal('hide');
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
module.exports = DeleteScenarioModal