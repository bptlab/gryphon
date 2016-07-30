var React = require('react');
var API = require('./../../api');
var SideBarManager = require('./../../sidebarmanager');

var SideBarScenario = require('./scenario');

var SideBarScenarios = React.createClass({
    getInitialState: function() {
        return {
            list: [],
            selected: ""
        }
    },
    loadScenarioList: function() {
        API.getAllScenarios(true, function(data) {
            if (data) {
                this.setState({list: data});
            }
        }.bind(this))
    },
    componentDidMount: function() {
        SideBarManager.setHandler(this.loadScenarioList);
        this.loadScenarioList();
    },
    setSelectedScenario: function(scenid) {
        this.setState({selected: scenid});
    },
    render: function() {
        var setSelectedScenario = this.setSelectedScenario;
        var list = this.state.list.map(function (scenario){
            var selected = (scenario._id == this.state.selected) ? 'selected' : '';
            return <SideBarScenario scenario={scenario} key={scenario._id} selected={selected} setSelectedScenario={setSelectedScenario}/>
        }.bind(this));
        return (
            <div className="sidebar-links">
                <div className="link-red">
                    <a
                        href="#"
                        data-toggle="modal"
                        data-target="#createScenarioModal"
                    >
                        <i className="fa fa-plus"></i>Create a scenario
                    </a>
                </div>
                {list}
            </div>
        );
    }
});
module.exports = SideBarScenarios;