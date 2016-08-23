var React = require('react');
var TopBarInput = require('./topbarinput');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');

var FragmentTopBarComponent = React.createClass({
    getInitialState: function() {
      return {
        nameIsEditable: false,
        newFragmentName: "",
      };
    },
    componentDidMount: function() {
      this.setState({nameIsEditable: false});
    },
    componentWillReceiveProps: function(nextProps) {
      var fragmentName = "";
      nextProps.scenario.fragments.forEach(function(fragment) {
        if (fragment._id == nextProps.fragmentId) {
          fragmentName = fragment.name;
        }
      });
      this.setState({newFragmentName: fragmentName});
    },
    onFragmentNameChange: function(name) {
      this.setState({newScenarioName: name});
    },
    handleRenameClick: function() {
      if(this.state.nameIsEditable)
      {
        var newScenario = this.props.scenario;
        newScenario.name = this.state.newScenarioName;

        if (NameCheck.check(newScenario.name)) {
            API.exportScenario(newScenario);
            MessageHandler.handleMessage("success","Saved scenario-details!");
        }
      }
      this.setState({nameIsEditable: !this.state.nameIsEditable});
    },
    render: function() {
        return (
            <div className="row">
              <div className="col-md-8">
                <span className="h1">
                  <a href="#">
                    <i className="fa fa-home"></i>
                  </a>
                  &nbsp;

                  {this.props.scenario.name}&nbsp;/&nbsp;

                    <TopBarInput
                      initialValue={this.state.newFragmentName}
                      editable={this.state.nameIsEditable}
                      handleEnter={this.handleRenameClick}
                      onChange={this.onFragmentNameChange}
                    />
                  </span>
                <hr />
              </div>
              <div className="col-md-3">
                <div className="btn-group pull-right">
                  <button
                      type="button"
                      className="btn btn-success"
                      onClick={this.handleRenameClick}
                  >
                      <i className="fa fa-pencil"></i> {this.state.nameIsEditable ? "Done" : "Edit"}
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

module.exports = FragmentTopBarComponent;
