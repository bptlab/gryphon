var React = require('react');
var API = require('./../api');
var Link = require('react-router').Link;

var SideBarSingleScenario = React.createClass({
    getInitialState: function(){
        return {
            selected: ""
        };
    },
    handleScenarioClick: function(e) {
        var new_state = this.state.selected == 'selected' ? '' : 'selected';
        this.setState({'selected': new_state});
    },
    render: function() {
        var scenario = this.props.scenario;
        var fragmentlist = scenario.fragments.map(function (fragment){
            return (
                <li key={fragment._id}>
                    <div className="btn-group pull-right">
                        <button
                            type="button"
                            className="btn btn-danger btn-xs"
                            data-toggle="modal"
                            data-target="#deleteFragmentModal"
                            data-fragid={fragment._id}
                            >
                            <i className="fa fa-trash"></i>
                        </button>
                        <button
                            type="button"
                            className="btn btn-success btn-xs"
                            data-toggle="modal"
                            data-target="#modifyFragmentModal"
                            data-fragid={fragment._id}
                            data-fragname={fragment.name}
                            >
                            <i className="fa fa-wrench"></i>
                        </button>
                    </div>
                    <Link to={"fragment/" + fragment._id} >{fragment.name}</Link>
                </li>
            );
        });
        return (
            <div className={"link-blue " + this.state.selected} key={scenario._id}>
                <Link to={"scenario/" + scenario._id} onClick={this.handleScenarioClick}>
                    <i className="fa fa-newspaper-o"></i>{scenario.name}
                </Link>
                <ul className="sub-links">
                    {fragmentlist}
                    <li>
                        <Link to={"domainmodel/" + scenario.domainmodel._id}>
                            Domain Model
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
});

var SideBarScenarios = React.createClass({
    getInitialState: function() {
        return {
            list: []
        }
    },
    loadScenarioList: function() {
        API.getAllScenarios(true, function(data) {
            if (data.scenarios) {
                this.setState({list: data.scenarios});
            }
        }.bind(this))
    },
    componentDidMount: function() {
        this.loadScenarioList();
        setInterval(this.saveDiagram,1000*60);
    },
    render: function() {
        var list = this.state.list.map(function (scenario){
            return <SideBarSingleScenario scenario={scenario} key={scenario._id} />
        });
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

var SideBarComponent = React.createClass({
    render: function() {
        return (
            <aside className="sidebar-left-collapse">
                <a href="#">
                    <img src="./img/hpi.png" alt="HPI" style={{width:'100px',height:'100px'}} />
                </a>
                <SideBarScenarios />
            </aside>
        )
    }
});

module.exports = SideBarComponent;