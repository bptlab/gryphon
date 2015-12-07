var React = require('react');

var ScenarioEditForm = React.createClass({
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Scenario Stats</h3>
                </div>
                <div className="panel-body">
                    <form class="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="scenarioname" className="col-sm-2 control-label">Name</label>
                        <div className="col-sm-10">
                            <input type="email" className="form-control" id="scenarioname" placeholder="Name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="terminationcondition" className="col-sm-2 control-label">Termination Condition</label>
                        <div className="col-sm-10">
                            <input type="email" className="form-control" id="terminationcondition" placeholder="Termination Condition" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">Submit</button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        );
    }
});

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
                                3
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Domain Model Classes
                            </td>
                            <td>
                                7
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

var ScenarioFragmentList = React.createClass({
    render: function() {
        var fragments = [
            "fragment1",
            "fragment2"
        ];
        fragments = fragments.map(function(fragmentname) {
            return (
                <li className="list-group-item">{fragmentname}</li>
            );
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Fragments</div>
                <div className="panel-body">
                    <p>All scenario fragments.</p>
                </div>
                <ul className="list-group">
                    {fragments}
                </ul>
            </div>
        )
    }
});

var ScenarioDomainModelList = React.createClass({
    render: function() {
        var fragments = [
            "dm1",
            "dm2"
        ];
        fragments = fragments.map(function(fragmentname) {
            return (
                <li className="list-group-item">{fragmentname}</li>
            );
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Domain Model classNamees</div>
                <div className="panel-body">
                    <p>All domain model classes.</p>
                </div>
                <ul className="list-group">
                    {fragments}
                </ul>
            </div>
        )
    }
});

var ScenarioEditorComponent = React.createClass({
    render: function() {
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        <ScenarioEditForm />
                    </div>
                    <div className="col-md-6">
                        <ScenarioStatsForm />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ScenarioFragmentList />
                    </div>
                    <div className="col-md-6">
                        <ScenarioDomainModelList />
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ScenarioEditorComponent;