var React = require('react');

var ScenarioOperations = React.createClass({
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Operations</div>
                <ul className="list-group">
                    <li className="list-group-item">
                        <button
                            type="button"
                            className="btn btn-default btn-block"
                            data-toggle="modal"
                            data-target="#exportScenarioModal"
                            data-scenid={this.props.scenario._id}
                        >
                            Export scenario to chimera
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-block"
                            data-toggle="modal"
                            data-target="#deleteScenarioModal"
                            data-scenid={this.props.scenario._id}
                        >
                            Delete scenario
                        </button>
                    </li>
                </ul>
            </div>
        )
    }
});

module.exports = ScenarioOperations;
