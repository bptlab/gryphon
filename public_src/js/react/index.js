
var React = require('react');
var SideBarComponent = require('./sidebar/sidebar');
var TopBarComponent = require('./topbar/topbar');
var ModalComponent = require('./modals/modals');
var MessageBar = require('./messagebar/messagebar');

var App = React.createClass({
    render: function() {
        console.log(this.props);
        return (
          <div className="container-fluid">
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
