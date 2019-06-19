var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var SideBarManager = require('./../../sidebarmanager');

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
    bindToButton: function() {
      $('#modifyFragmentModal').off('show.bs.modal');
      $('#modifyFragmentModal').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget);
          var fragid = button.data('fragid');
          var fragname = button.data('fragname');
          this.setState({fragID:fragid,name:fragname})
          console.log("ModifyFragmentModal on show.bs.modal name: ", fragname, "button: ", button);
      }.bind(this))
    },
    componentDidMount: function() {
      this.bindToButton();
    },
    handleSubmit: function() {
        var newFragment = this.getFinalState();
        if (NameCheck.check(newFragment.name)) {
            API.exportFragment(newFragment);
            SideBarManager.reload();
            $('#modifyFragmentModal').modal('hide');
            this.bindToButton();
        }
    },
    handleChange: function(e) {
        this.setState({name: e.target.value})
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.handleSubmit()
        }
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
                                        onKeyDown={this.handleEnterSubmit}
                                    />
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = ModifyFragmentModal;
