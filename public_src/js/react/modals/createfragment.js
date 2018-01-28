var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var SideBarManager = require('./../../sidebarmanager');
var MessageHandler = require('./../../messagehandler');
var Redirecter = require('./../../redirecter');

var CreateFragmentModal = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            scenID: "",
        }
    },
    componentDidMount: function() {
        $('#createFragmentModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var scenid = button.data('scenid');
            this.setState({scenID:scenid});
        }.bind(this))
    },
    handleSubmit: function() {
      // we should do a duplicate check here
      //  && NameCheck.isUnique(this.state.name, this.state.scenario.fragments)
      // but using the data- attribute of the button, we only get strings, not objects (afaik)
      if (NameCheck.check(this.state.name)) {
        API.createFragment(this.state.name,function(fragmentData, res){
          API.associateFragment(this.state.scenID,fragmentData._id,function(data, res){
            this.setState({newname: ''});
            MessageHandler.handleMessage('success', 'Added new fragment!');
            SideBarManager.reload();

            // Redirect to new fragment page
            Redirecter.redirectToFragment(this.state.scenID, fragmentData._id);
          }.bind(this));
        }.bind(this));
        $('#createFragmentModal').modal('hide');
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
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="createFragmentModalTitle" id="createFragmentModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="createFragmentModalTitle">Create a new fragment</h4>
                            </div>
                            <div className="modal-body">
                                <fieldset className="form-group">
                                    <label htmlFor="fragmentName">Fragment Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="createFragmentModalName"
                                        placeholder="Fragment name"
                                        value={this.state.name}
                                        onChange={this.handleNameChange}
                                        onKeyDown={this.handleEnterSubmit}
                                    />
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-default btn-primary" onClick={this.handleSubmit}>Create fragment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = CreateFragmentModal;
