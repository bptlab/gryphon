var React = require('react');
var API = require('./../../api');
var SideBarManager = require('./../../sidebarmanager');

var DeleteFragmentModal = React.createClass({
    getInitialState: function() {
        return {
            fragID: ""
        }
    },
    handleClick: function() {
        if (this.state.fragID != "") {
            API.deleteFragment(this.state.fragID);
            SideBarManager.reload();
            $('#deleteFragmentModal').modal('hide');
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

module.exports = DeleteFragmentModal