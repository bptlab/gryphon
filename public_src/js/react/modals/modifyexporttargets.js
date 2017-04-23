var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var SideBarManager = require('./../../sidebarmanager');
var ExportConfigComponent = require('./../exportconfig/exportconfig');

var ModifyExportTargetsModal = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            fragID: ''
        }
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="modifyExportTargetsModalLabel" id="modifyExportTargetsModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="modifyExportTargetsModalLabel">Modify export targets</h4>
                            </div>
                            <div className="modal-body">

                                <ExportConfigComponent />

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn" data-dismiss="modal">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = ModifyExportTargetsModal;
