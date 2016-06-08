var React = require('react');
var Link = require('react-router').Link;

var SideBarSingleScenario = React.createClass({
    handleScenarioClick: function(e) {
        this.props.setSelectedScenario(this.props.scenario._id);
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
            <div className={"link-blue " + this.props.selected} key={scenario._id}>
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

module.exports = SideBarSingleScenario;