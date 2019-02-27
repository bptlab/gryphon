var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var SideBarManager = require('./../../sidebarmanager');

var ScenarioFragmentList = require('./fragmentlist');
var ScenarioOperations = require('./operations');
var ScenarioEditForm = require('./scenario');
var ScenarioStartConditionForm = require('./startconditions');
var ScenarioStats = require('./stats');
var TerminationConditionsComponent = require('./terminationconditions');
var ScenarioDescription = require('./scenariodescription');
var CaseClassSelectorComponent = require('./caseclassselector');
var ComplianceCheckerComponent = require('./compliancechecker/compliancechecker');

var ScenarioEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            scenario: {
                name: "",
                revision: 0,
                description: "",
                fragments: [],
                domainmodel: {
                    name: "",
                    revision: 0,
                    caseclass: "",
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
                <div className="row">
                  <div className="col-md-12">
                    <ComplianceCheckerComponent scenario={this.state.scenario} />
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="col-md-12">
                    <ScenarioDescription scenario={this.state.scenario}/>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12">
                    <CaseClassSelectorComponent scenario={this.state.scenario} />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12">
                    <TerminationConditionsComponent scenario={this.state.scenario}/>
                  </div>
                </div>
                <hr />
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
