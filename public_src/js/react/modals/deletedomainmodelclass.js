var React = require('react');
var API = require('./../../api');
var NameCheck = require('./../../namecheck');
var Config = require('./../../config');
var SideBarManager = require('./../../sidebarmanager');
var MessageHandler = require('./../../messagehandler');
var Link = require('react-router').Link;

var DeleteDomainModelClassModal = React.createClass({
    getInitialState: function() {
        return {
            scenID: "",
            classID: "",
        }
    },
    componentDidMount: function() {
        $('#DeleteDomainModelClassModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var scenid = button.data('scenid');
            var classid = button.data('classid');
            this.setState({scenID:scenid, classID:classid});
        }.bind(this))
    },
    handleClick: function() {
      // Loading the scenario *again* in the modal because we can't pass objects into a modal -- nice!
      API.getFullScenario(this.state.scenID,true,function(scenario){
        var dm = scenario.domainmodel;

        // Remove dataclass from domain model
        for (var i = 0; i < dm.dataclasses.length; i++) {
          if (dm.dataclasses[i]._id == this.state.classID) {
            dm.dataclasses.splice(i, 1);
            break;
          }
        }

        API.exportDomainModel(dm, function(){
          this.setState({classID: ''});
          MessageHandler.handleMessage('success', 'Removed class!');
          SideBarManager.reload();
        }.bind(this));
      }.bind(this));

      $('#DeleteDomainModelClassModal').modal('hide');
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="DeleteDomainModelClassModalTitle" id="DeleteDomainModelClassModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="DeleteDomainModelClassModalTitle">Delete data class</h4>
                            </div>

                            <div className="modal-body">
                                Are you sure? Do really want to delete this data class?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <Link to={"scenario/" + this.state.scenID}>
                                  <button type="button" className="btn btn-danger" onClick={this.handleClick}>Delete Class</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = DeleteDomainModelClassModal;
