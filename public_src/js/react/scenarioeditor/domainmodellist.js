var React = require('react');

var ScenarioDomainModelList = React.createClass({
    render: function() {
        var classes = this.props.classes.map(function(dataclass, index) {
            return (
                <li key={index} className="list-group-item">{dataclass.name}</li>
            );
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Domain Model Classnames</div>
                <div className="panel-body">
                    <p>All domain model classes.</p>
                </div>
                <ul className="list-group">
                    {classes}
                </ul>
            </div>
        )
    }
});
module.exports = ScenarioDomainModelList;