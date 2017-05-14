var React = require('react');
var TopBarInput = require('./topbarinput');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var Link = require('react-router').Link;

var ScenarioTopBarComponent = React.createClass({
    getInitialState: function() {
      return {
        nameIsEditable: false,
        newScenarioName: "",
      };
    },
    componentDidMount: function() {
      this.setState({nameIsEditable: false});
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({newScenarioName: nextProps.scenario.name});
    },
    onScenarioNameChange: function(name) {
      this.setState({newScenarioName: name});
    },
    handleRenameClick: function() {
      if(this.state.nameIsEditable)
      {
        if(this.state.newScenarioName != this.props.scenario.name && this.state.newScenarioName != "")
        {
          var newScenario = this.props.scenario;
          newScenario.name = this.state.newScenarioName;

          if (NameCheck.check(newScenario.name)) {

              API.exportScenario(newScenario, function(data) {

                MessageHandler.handleMessage("success","Saved scenario-details!");

                API.validateScenario(this.props.scenario._id, null, function(){
                    MessageHandler.handleMessage("validation", "Validation failed!");
                }.bind(this));

              }.bind(this));

          }
        }
      }
      this.setState({nameIsEditable: !this.state.nameIsEditable});
    },
    handleRenameCancel : function() {
      this.setState({nameIsEditable: false, newScenarioName: this.props.scenario.name});
    },
    render: function() {
        var changeBtnLabel = this.state.nameIsEditable ? "Done" : "Edit";
        var changeBtnIcon = this.state.nameIsEditable ? "fa fa-check" : "fa fa-pencil";
        return (
            <div className="row topbar">
              <div className="col-md-8 col-xs-12">
                <span className="h1">
                  <a href="#" className="homeIcon">
                    <i className="fa fa-home"></i>
                  </a>
                  &nbsp;

                    <TopBarInput
                      initialValue={this.state.newScenarioName}
                      editable={this.state.nameIsEditable}
                      handleEnter={this.handleRenameClick}
                      onChange={this.onScenarioNameChange}
                      handleCancel={this.handleRenameCancel}
                    />
                  </span>
              </div>
              <div className="col-md-4 col-xs-12">
                <div className="btn-group pull-right">
                  <button
                      type="button"
                      className="btn btn-success"
                      onClick={this.handleRenameClick}
                  >
                      <i className={changeBtnIcon}></i> {changeBtnLabel}
                  </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        data-toggle="modal"
                        data-target="#deleteScenarioModal"
                        data-scenid={this.props.scenario._id}
                    >
                        <i className="fa fa-trash"></i> Delete
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target="#exportScenarioModal"
                        data-scenid={this.props.scenario._id}
                    >
                        <i className="fa fa-wrench"></i> Deploy
                    </button>
                </div>
              </div>
            </div>
        )
    }
});

module.exports = ScenarioTopBarComponent;
