var React = require('react');
var SideBarComponent = require('./sidebar/sidebar');
var ModalComponent = require('./modals/modals');
var MessageBar = require('./messagebar/messagebar').MessageBarComponent;

var App = React.createClass({
    render: function() {
        return (
            <div className="app-container">
                <ModalComponent />
                <SideBarComponent />
                <div className="main-content">
                    <MessageBar />
                    {this.props.children}
                </div>
            </div>
        )
    }
});

module.exports = App;