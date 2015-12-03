var React = require('react');

var SideBarScenarios = React.createClass({
    render: function() {
        return (
            <div className="link-blue selected">
                <a href="#">
                    <i className="fa fa-newspaper-o"></i> Scenarios
                </a>
                <ul className="sub-links">
                    <li><a href="#">Test</a></li>
                </ul>
            </div>
        );
    }
});

var SideBarFragments = React.createClass({
    render: function() {
        return (
            <div className="link-red">
                <a href="#">
                    <i className="fa fa-object-group"></i> Fragments
                </a>
                <ul className="sub-links">
                    <li><a href="#">Select a scenario first.</a></li>
                </ul>
            </div>
        );
    }
});

var SideBarDomainModel = React.createClass({
    render: function() {
        return (
            <div className="link-green">
                <a href="#">
                    <i className="fa fa-table"></i> Domain Model
                </a>
                <ul className="sub-links">
                    <li><a href="#">Select a scenario first</a></li>
                </ul>
            </div>
        );
    }
});

var SideBarComponent = React.createClass({
    render: function() {
        return (
            <aside className="sidebar-left-collapse">
                <a href="#" className="company-logo">HPI</a>
                <div className="sidebar-links">
                    <SideBarScenarios />
                    <SideBarFragments />
                    <SideBarDomainModel />
                </div>
            </aside>
        )
    }
});

module.exports = SideBarComponent;