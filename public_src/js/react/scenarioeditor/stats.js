var React = require('react');

var ScenarioStatsForm = React.createClass({
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Scenario Stats</h3>
                </div>
                <table className="table">
                    <tbody>
                    <tr>
                        <td>
                            Fragments
                        </td>
                        <td>
                            {this.props.scenario.fragments.length}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Domain Model Classes
                        </td>
                        <td>
                            {this.props.scenario.domainmodel.dataclasses.length}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});
module.exports = ScenarioStatsForm;