var React = require('react');
var API = require('./../../api');
var SideBarManager = require('./../../sidebarmanager');

var SideBarDomainModel = React.createClass({
  render: function() {
    return (
      <div className="sidebar-links">
          <div className="link-blue">
              <a
                  href="#"
                  data-toggle="modal"
                  data-target="#createScenarioModal"
              >
                  <i className="fa fa-newspaper-o"></i>DomainModel
              </a>
          </div>
          The<br/>
          List<br/>
      </div>
    );
  }
}
);
module.exports = SideBarDomainModel;
