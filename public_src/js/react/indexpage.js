var React = require('react');
var Link = require('react-router').Link;
var API = require('./../api');

var IndexComponent = React.createClass({
    getInitialState: function() {
        return {
            scenarios: []
        }
    },
    componentDidMount: function() {
        this.loadScenarioList();
    },
    loadScenarioList: function() {
        API.getAllScenarios(true, function(data) {
            if (data) {
                this.setState({scenarios: data});
            }
        }.bind(this))
    },
    render: function() {
        var scenarios = this.state.scenarios.map(function(scenario){
            var fragments = scenario.fragments.map(function(fragment){
                return (
                    <li className="list-group-item" key={fragment._id}><Link to={"fragment/" + fragment._id}>{fragment.name}</Link></li>
                )
            });
            return (
                <div className="panel panel-default" key={scenario._id}>
                    <div className="panel-heading">
                        <h3 className="panel-title">
                            <Link to={"scenario/" + scenario._id}>
                                {scenario.name}
                            </Link>
                        </h3>
                    </div>
                    <ul className="list-group">
                        {fragments}
                    </ul>
                </div>
            )
        });
        return (
            <div className="col-md-12">
                {scenarios}
            </div>
        )
    }
});

module.exports = IndexComponent;