var React = require('react');
var API = require('./../api');
var SideBarComponent = require('./sidebar/sidebar');
var ScenarioTopBarComponent = require('./topbar/scenariotopbar');

var ScenarioLoader = React.createClass({
  getInitialState: function() {
      return {
          scenario: {
              name: "",
              revision: 0,
              fragments: [],
              domainmodel: {
                  name: "",
                  revision: 0,
                  dataclasses: []
              },
              terminationconditions: [],
              _id: "",
              startconditions: []
          }
      }
  },
  loadScenario: function() {
      var scen_id = this.props.params.scenarioId;
      API.getFullScenario(scen_id,true,function(data){
          this.setState({scenario: data});
      }.bind(this));
  },
  componentDidMount: function() {
      this.loadScenario();
      MessageHandler.resetMessages();
  },
  componentDidUpdate: function() {
      if (this.state.scenario._id !== this.props.params.scenarioId) {
          this.loadScenario();
          MessageHandler.resetMessages();
      }
  },
  forceRerender: function() {
      this.loadScenario();
      SideBarManager.reload();
  },
  render: function() {
      console.log(this.props);
      this.props.children.props.params.scenario = this.state.scenario;
      return (
        <div className="app-container">
        <ScenarioTopBarComponent scenario={this.state.scenario} />
        <SideBarComponent scenario={this.state.scenario} />
          <div className="main-content">
            {this.props.children}
          </div>
        </div>
      )
  }
});

module.exports = ScenarioLoader;
