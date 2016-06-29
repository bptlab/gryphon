var React = require('react');
var SideBarDomainModel = require('./domainmodellist')
var SideBarFragmentList = require('./fragmentlist');

var SideBarComponent = React.createClass({
    render: function() {
        console.log(this.props);
        return (
            <aside className="sidebar-left-collapse">
                <a href="#">
                    <img src="./img/hpi.png" alt="HPI" style={{width:'100px',height:'100px'}} />
                </a>
                <SideBarFragmentList fragments={this.props.scenario.fragments} />
                <SideBarDomainModel domainmodel={this.props.scenario.domainmodel} />
            </aside>
        )
    }
});

module.exports = SideBarComponent;
