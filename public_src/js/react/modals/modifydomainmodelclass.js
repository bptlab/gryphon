var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var Config = require('./../../config');
var SideBarManager = require('./../../sidebarmanager');
var MessageHandler = require('./../../messagehandler');

var ModifyDomainModelClassModal = React.createClass({
    getInitialState: function() {
        return {
            name: "",
            scenID: "",
            classID: "",
        }
    },
    componentDidMount: function() {
        $('#ModifyDomainModelClassModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var scenid = button.data('scenid');
            var classid = button.data('classid');
            var classname = button.data('classname');
            this.setState({scenID:scenid, classID:classid, name:classname});
        }.bind(this))
    },
    handleClick: function() {
      // Loading the scenario *again* in the modal because we can't pass objects into a modal -- nice!
      API.getFullScenario(this.state.scenID,true,function(scenario){
        var dm = scenario.domainmodel;

        // Change dataclass name
        for (var i = 0; i < dm.dataclasses.length; i++) {
          if (dm.dataclasses[i]._id == this.state.classID) {
            dm.dataclasses[i].name = this.state.name;
            break;
          }
        }

        console.log("new dm: ", dm);

        API.exportDomainModel(dm, function(){
          this.setState({classID: ''});
          this.setState({name: ''});
          MessageHandler.handleMessage('success', 'Renamed class!');
          SideBarManager.reload();
        }.bind(this));
      }.bind(this));

      $('#ModifyDomainModelClassModal').modal('hide');
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
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="ModifyDomainModelClassModalTitle" id="ModifyDomainModelClassModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="ModifyDomainModelClassModalTitle">Rename domain model class</h4>
                            </div>

                            <div className="modal-body">
                                <fieldset className="form-group">
                                    <label htmlFor="fragmentName">Class Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modifyDomainModelClassModalName"
                                        placeholder="Class name"
                                        value={this.state.name}
                                        onChange={this.handleNameChange}
                                        onKeyDown={this.handleEnterSubmit}
                                    />
                                </fieldset>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleClick}>Save Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = ModifyDomainModelClassModal;
