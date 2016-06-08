var React = require('react');
var SideBarScenarios = require('./scenariolist');

var SideBarComponent = React.createClass({
    render: function() {
        return (
            <aside className="sidebar-left-collapse">
                <a href="#">
                    <img src="./img/hpi.png" alt="HPI" style={{width:'100px',height:'100px'}} />
                </a>
                <SideBarScenarios />
            </aside>
        )
    }
});

module.exports = SideBarComponent;