var React = require('react');
var API = require('./../api');
var SideBarComponent = require('./sidebar/sidebar');
var SideBarManager = require('./../sidebarmanager');
var MessageHandler = require('./../messagehandler');
var ScenarioTopBarComponent = require('./topbar/scenariotopbar');
var FragmentTopBarComponent = require('./topbar/fragmenttopbar');

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
      SideBarManager.setHandler(this.loadScenario);
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
      console.log("ScenarioLoader props: ", this.props);
      console.log("ScenarioLoader state: ", this.state);
      //this.props.children.props.params.scenario = this.state.scenario;

      var topBar;
      var componentName = this.props.routes[this.props.routes.length - 1].component.displayName;
      switch (componentName) {
        case "FragmentEditorComponent":
          topBar = <FragmentTopBarComponent scenario={this.state.scenario} fragmentId={this.props.params.fragmentId} />
          break;
        default:
          topBar = <ScenarioTopBarComponent scenario={this.state.scenario} />
          break;
      }

      return (
        <div className="app-container">
        {topBar}
        <SideBarComponent scenario={this.state.scenario} />
          <div className="main-content">
            {this.props.children}
          </div>
        </div>
      )
  }
});

module.exports = ScenarioLoader;
