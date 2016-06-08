var React = require('react');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var SideBarManager = require('./../../sidebarmanager');

var ScenarioDomainModelList = require('./domainmodellist');
var ScenarioFragmentList = require('./fragmentlist');
var ScenarioOperations = require('./operations');
var ScenarioEditForm = require('./scenario');
var ScenarioStartConditionForm = require('./startconditions');
var ScenarioStats = require('./stats');

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
        var scen_id = this.props.params.id;
        API.getFullScenario(scen_id,true,function(data){
            this.setState({scenario: data});
        }.bind(this));
    },
    componentDidMount: function() {
        this.loadScenario();
        MessageHandler.resetMessages();
    },
    componentDidUpdate: function() {
        if (this.state.scenario._id !== this.props.params.id) {
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
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        <ScenarioEditForm scenario={this.state.scenario}/>
                        <ScenarioFragmentList scenario={this.state.scenario} forceRerender={this.forceRerender} />
                    </div>
                    <div className="col-md-6">
                        <ScenarioStats scenario={this.state.scenario} />
                        <ScenarioOperations scenario={this.state.scenario}/>
                        <ScenarioDomainModelList classes={this.state.scenario.domainmodel.dataclasses}/>
                        <ScenarioStartConditionForm scenario={this.state.scenario} />
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioEditorComponent;