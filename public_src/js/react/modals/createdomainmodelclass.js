var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var Config = require('./../../config');
var SideBarManager = require('./../../sidebarmanager');
var MessageHandler = require('./../../messagehandler');

var CreateDomainModelClassModal = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            scenID: "",
        }
    },
    componentDidMount: function() {
        $('#createDomainModelClassModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var scenid = button.data('scenid');
            this.setState({scenID:scenid});
        }.bind(this))
    },
    handleCreateDataclass: function() {
      this.handleCreateClass(false);
    },
    handleCreateEventclass: function() {
      this.handleCreateClass(true);
    },
    handleCreateClass: function(is_event) {
      var dataclass = {
          "name": this.state.name,
          "is_event": is_event,
          "attributes": [],
          "olc": Config.DEFAULT_OLC_XML
      };

      // Loading the scenario *again* in the modal because we can't pass objects into a modal -- nice!
      API.getFullScenario(this.state.scenID,true,function(scenario){
        var dm = scenario.domainmodel;

        if (NameCheck.check(dataclass.name) && NameCheck.isUnique(dataclass.name, dm.dataclasses)) {
          dm.dataclasses.push(dataclass);
          API.exportDomainModel(dm, function(){
            this.setState({name: ''});

            MessageHandler.handleMessage('success', 'Added new class!');

            SideBarManager.reload();
          }.bind(this));
        }
      }.bind(this));

      $('#createDomainModelClassModal').modal('hide');

    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="createDomainModelClassModalTitle" id="createDomainModelClassModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="createDomainModelClassModalTitle">Create a new domain model class</h4>
                            </div>
                            <div className="modal-body">
                                <fieldset className="form-group">
                                    <label htmlFor="fragmentName">Class Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="createDomainModelClassModalName"
                                        placeholder="Class name"
                                        value={this.state.name}
                                        onChange={this.handleNameChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleCreateDataclass}>Create dataclass</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleCreateEventclass}>Create eventclass</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = CreateDomainModelClassModal;
