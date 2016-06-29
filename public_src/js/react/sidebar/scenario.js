var React = require('react');
var Link = require('react-router').Link;
var SideBarSingleFragment = require('./fragment');

var SideBarSingleScenario = React.createClass({
    handleScenarioClick: function(e) {
        this.props.setSelectedScenario(this.props.scenario._id);
    },
    render: function() {
        var scenario = this.props.scenario;
        var fragmentlist = scenario.fragments.map(function (fragment){
            return (
              <SideBarSingleFragment fragment={fragment}/>
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
