var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var SideBarManager = require('./../../sidebarmanager');
var SideBarComponent = require('./../sidebar/sidebar');

var ScenarioFragmentList = require('./fragmentlist');
var ScenarioOperations = require('./operations');
var ScenarioEditForm = require('./scenario');
var ScenarioStartConditionForm = require('./startconditions');
var ScenarioStats = require('./stats');
var ScenarioTopBarComponent = require('./../topbar/scenariotopbar');

var ScenarioEditorComponent = React.createClass({
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
        return (
            <div>
            <ScenarioTopBarComponent scenario={this.state.scenario} />
            <SideBarComponent scenario={this.state.scenario} />
                <div className="row">
                  <div className="col-md-12">
                    <ScenarioEditForm scenario={this.state.scenario}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <ScenarioStartConditionForm scenario={this.state.scenario} />
                  </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioEditorComponent;
