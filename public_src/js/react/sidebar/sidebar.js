var React = require('react');
var SideBarDomainModel = require('./domainmodellist')
var SideBarFragmentList = require('./fragmentlist');

var SideBarComponent = React.createClass({
    render: function() {
        return (
            <aside className="sidebar-left-collapse">
                <SideBarFragmentList scenario={this.props.scenario} />
                <SideBarDomainModel scenario={this.props.scenario} />
            </aside>
        )
    }
});

module.exports = SideBarComponent;
