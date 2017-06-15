var Config = require('./../../config');
var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var MessageComponent = require('./../messagebar/message');
var Link = require('react-router').Link;

var ExportScenarioModal = React.createClass({
    getInitialState: function() {
        return {
            messages: [],
            targets: [],
            selectedTargetURL: "Download scenario as JSON.",
            selectedTarget: "",
            scenID: ""
        }
    },
    handleTargetChange: function(e) {
        this.setState({selectedTarget: e.target.value});
        this.state.targets.forEach(function(target){
            if (target._id == e.target.value) {
                this.setState({selectedTargetURL: target.url});
            }
        }.bind(this));
        if (e.target.value == "") {
            this.setState({selectedTargetURL: "Download scenario as JSON."})
        }
    },
    handleSubmit: function() {
        if (this.state.selectedTarget != "") {
            API.exportScenarioToChimera(this.state.scenID, this.state.selectedTarget, function(response){
                MessageHandler.handleMessage('success','Exporting scenario');
                if (response != null && response.constructor === Array) {
                    response.forEach(function(message){
                        MessageHandler.handleMessage(message['type'],message['text']);
                    });
                }
            });
            $('#exportScenarioModal').modal('hide');
        } else {
            window.location.replace(Config.API_HOST + 'scenario/' + this.state.scenID + '?populate=true&download=true');
        }
    },
    handleTargetAdd: function() {
      $('#exportScenarioModal').modal('hide');
      $('#modifyExportTargetsModal').modal('show');
    },
    render: function() {
        var messages = this.state.messages.map(function(message){
            return (<MessageComponent type={message.type} text={message.text} allow_dismiss={false} />);
        });
        var btn_state = ((messages.length > 0) ? "danger" : "primary");
        if (messages.length == 0) {
            messages.push(<MessageComponent type="success" text="Scenario validated, everything okay!" allow_dismiss={false} />);
        }
        var targets = this.state.targets.map(function(target){
            return <option value={target._id} key={target._id}>{target.name}</option>
        });
        return (
            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="exportScenarioModalTitle" id="exportScenarioModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="exportScenarioModalTitle">Export this scenario</h4>
                            </div>
                            <div className="modal-body">
                                {messages}
                                <fieldset className="form-group">
                                    <label htmlFor="exportScenarioModalTargetSelect">Target</label>
                                    <div className="row">
                                        <div className="col-md-9">
                                            <select name="exportScenarioModalTargetSelect"
                                                    id="exportScenarioModalTargetSelect"
                                                    value={this.state.selectedTarget}
                                                    onChange={this.handleTargetChange}
                                                    className="form-control">
                                                <option value="">Download scenario</option>
                                                {targets}
                                            </select>
                                        </div>
                                        <div className="col-md-3">

                                          <button
                                              type="button"
                                              className="btn btn-primary"
                                              onClick={this.handleTargetAdd}
                                          >
                                              Add target
                                          </button>
                                          &nbsp;
                                          <a
                                            data-toggle="tooltip"
                                            title="Enter the endpoint for the REST API of the Chimera instance you want to connect, e.g. http://localhost:8080/&#8203;Chimera/&#8203;api/&#8203;interface/&#8203;v2 ."
                                          >
                                            <i className="fa fa-info-circle"></i>
                                          </a>

                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Target URL</label>
                                    <input type="text" className="form-control" value={this.state.selectedTargetURL} readOnly="true"/>
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className={"btn btn-" + btn_state} onClick={this.handleSubmit}>Export</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        $('#exportScenarioModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var scenid = button.data('scenid');
            this.setState({scenID: scenid});
            API.validateScenario(scenid, function(data){
                this.setState({messages: data});
            }.bind(this));
            API.getAvailableExports(function(exports){
                this.setState({targets: exports});
            }.bind(this))
        }.bind(this))
    }
});
module.exports = ExportScenarioModal;
