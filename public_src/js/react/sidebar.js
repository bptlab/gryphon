var React = require('react');

var SideBarFragments = React.createClass({
    render: function() {
        return (
            <div className="link-blue selected">
                <a href="#">
                    <i className="fa fa-picture-o"></i>Scenarios
                </a>
                <ul className="sub-links">
                    <li><a href="#">Test</a></li>
                </ul>
            </div>
        );
    }
});

var SideBarComponent = React.createClass({
    render: function() {
        return (
            <aside className="sidebar-left-collapse">
                <a href="#" className="company-logo">Logo</a>
                <div className="sidebar-links">
                    <SideBarFragments />
                    <SideBarFragments />
                    <SideBarFragments />
                    <SideBarFragments />
                </div>
            </aside>
        )
    }
});

module.exports = SideBarComponent;