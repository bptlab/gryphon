var React = require('react');
var API = require('./../api');
var Link = require('react-router').Link;

var SideBarScenarios = React.createClass({
    render: function() {
        var list = this.props.list.map(function (scenario){
            return (
                <li>
                    <button type="button" className="btn btn-danger btn-xs pull-right"><i className="fa fa-trash"></i></button>
                    <Link to={"scenario/" + scenario._id}>{scenario.name}</Link>
                </li>
            );
        });
        return (
            <div className="link-blue selected">
                <a href="#">
                    <i className="fa fa-newspaper-o"></i> Scenarios
                </a>
                <ul className="sub-links">
                    {list}
                </ul>
            </div>
        );
    }
});

var SideBarFragments = React.createClass({
    render: function() {
        var list = this.props.list.map(function (fragment){
            return (
                <li>
                    <button type="button" className="btn btn-danger btn-xs pull-right"><i className="fa fa-trash"></i></button>
                    <button type="button" className="btn btn-success btn-xs pull-right"><i className="fa fa-wrench"></i></button>
                    <Link to={"fragment/" + fragment._id} >{fragment.name}</Link>
                </li>
            );
        });
        return (
            <div className="link-red">
                <a href="#">
                    <i className="fa fa-object-group"></i> Fragments
                </a>
                <ul className="sub-links">
                    {list}
                </ul>
            </div>
        );
    }
});

var SideBarDomainModel = React.createClass({
    handleClick: function() {
        //Show DM-Editor
    },
    render: function() {
        return (
            <div className="link-green">
                <a href="#" onClick={this.handleClick}>
                    <i className="fa fa-table"></i> Domain Model
                </a>
            </div>
        );
    }
});

var SideBarComponent = React.createClass({
    render: function() {
        var scenarioList = [
            {"name":"S1","_id":1},
            {"name":"S2","_id":2},
            {"name":"S3","_id":3},
        ];
        var fragmentList = [
            {"name":"Fragment 1","_id":1},
            {"name":"Fragment 2","_id":2},
        ];
        var domainModelList = [
            {"name":"Domain Model 1"},
            {"name":"Domain Model 1"},
            {"name":"Domain Model 1"},
        ];
        return (
            <aside className="sidebar-left-collapse">
                <a href="#" className="company-logo">HPI</a>
                <div className="sidebar-links">
                    <SideBarScenarios list={scenarioList} />
                    <SideBarFragments list={fragmentList} />
                    <SideBarDomainModel list={domainModelList} />
                </div>
            </aside>
        )
    }
});

module.exports = SideBarComponent;