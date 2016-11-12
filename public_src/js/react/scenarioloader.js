var React = require('react');
var API = require('./../api');
var SideBarComponent = require('./sidebar/sidebar');
var SideBarManager = require('./../sidebarmanager');
var MessageHandler = require('./../messagehandler');
var ScenarioTopBarComponent = require('./topbar/scenariotopbar');
var FragmentTopBarComponent = require('./topbar/fragmenttopbar');
var DomainModelClassTopBarComponent = require('./topbar/domainmodelclasstopbar');

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
          },
          editorInstance: 0
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
  setEditorInstance : function(instance) {
      this.setState({editorInstance: instance});
      console.log("Editor instance: ", instance);
  },
  editorSave: function() {
    this.state.editorInstance.saveDiagram(true);
  },
  render: function() {
      console.log("ScenarioLoader props: ", this.props);
      console.log("ScenarioLoader state: ", this.state);
      //this.props.children.props.params.scenario = this.state.scenario;

      var editor = React.Children.map(this.props.children, function(child) {
        console.log("child: ", child);
        return React.cloneElement(child, { scenario: this.state.scenario, setEditorInstance: this.setEditorInstance });
      }.bind(this));

      var topBar = <ScenarioTopBarComponent scenario={this.state.scenario} />
      if (this.props.params.dataclassId !== undefined)
      {
        topBar = <DomainModelClassTopBarComponent scenario={this.state.scenario} dataclassId={this.props.params.dataclassId} />
      }
      else if (this.props.params.fragmentId !== undefined)
      {
        topBar = <FragmentTopBarComponent scenario={this.state.scenario} fragmentId={this.props.params.fragmentId} editorSave={this.editorSave} />
      }

      return (
        <div className="app-container">
        {topBar}
        <SideBarComponent scenario={this.state.scenario} />
          <div className="main-content">
            {editor}
          </div>
        </div>
      )
  }
});

module.exports = ScenarioLoader;
