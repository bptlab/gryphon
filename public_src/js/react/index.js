
var React = require('react');
var SideBarComponent = require('./sidebar/sidebar');
var TopBarComponent = require('./topbar/topbar');
var ModalComponent = require('./modals/modals');
var MessageBar = require('./messagebar/messagebar');
var StaticInit = require('./staticinit');

var App = React.createClass({
    render: function() {
        return (
          <div className="container-fluid full-height">
            <StaticInit />
            <ModalComponent />
            <MessageBar />
            <div className="app-container">
              {this.props.children}
            </div>
          </div>
        )
    }
});

module.exports = App;
