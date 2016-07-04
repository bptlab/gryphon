var React = require('react');

var ScenarioTopBarComponent = React.createClass({
    getInitialState: function() {
      return {
        scenarioName: this.props.scenario.name
      };
    },
    handleChange: function(event) {
      this.setState({
        scenarioName: event.target.value
      });
    },
    handleRenameClick: function() {
      var nameLabel = document.getElementById('topBarScenarioName');
      var nameInputSpan = document.getElementById('topBarScenarioNameInputSpan');

      nameLabel.className = "h1 hidden";
      nameInputSpan.className = "";
    },
    handleRenameSubmit: function(newValue) {
      var nameLabel = document.getElementById('topBarScenarioName');
      var nameInputSpan = document.getElementById('topBarScenarioNameInputSpan');

      alert(newValue);
      nameInputSpan.className = "hidden";
      nameLabel.className = "h1";

      return false;
    },
    render: function() {
        return (
            <div className="row">
              <div className="col-md-8">
                <a href="#">
                  <img src="./img/hpi.png" alt="HPI" style={{width:'100px',height:'100px'}} />
                </a>
                <span className="h1" id="topBarScenarioName">{this.props.scenario.name}</span>
                <span className="hidden" id="topBarScenarioNameInputSpan">
                    <input
                      type="text"
                      name="topBarScenarioNameInput"
                      value={this.state.scenarioName}
                      onChange={this.handleChange}
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
                      <i className="fa fa-pencil"></i> Edit
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
