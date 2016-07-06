var React = require('react');
var TopBarInput = require('./topbarinput');

var ScenarioTopBarComponent = React.createClass({
    getInitialState: function() {
      return {
        nameIsEditable: false

      };
    },
    componentDidMount: function() {
      this.setState({nameIsEditable: false});
    },
    handleRenameClick: function() {
      if(this.state.nameIsEditable)
      {
          // update scenario name
      }

      this.setState({nameIsEditable: !this.state.nameIsEditable});
    },
    render: function() {
        return (
            <div className="row">
              <div className="col-md-8">
                <span className="h1">
                    <TopBarInput
                      initialValue={this.props.scenario.name}
                      editable={this.state.nameIsEditable}
                      handleEnter={this.handleRenameClick}
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
                      //data-toggle="modal"
                      //data-target="#handleRenameClick"
                      //data-target="#exportScenarioModal"
                      //data-scenid={this.props.scenario._id}
                  >
                      <i className="fa fa-pencil"></i> {this.state.nameIsEditable ? "Done" : "Edit"}
                  </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        data-toggle="modal"
                        data-target="#deleteScenarioModal"
                        data-fragid={this.props.scenario._id}
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
