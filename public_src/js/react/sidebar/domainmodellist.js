var React = require('react');
var API = require('./../../api');
var SideBarManager = require('./../../sidebarmanager');
var SideBarSingleDomainModelAttribute = require('./domainmodelattribute');
var Link = require('react-router').Link;


var SideBarDomainModel = React.createClass({
  render: function() {;
    var list = this.props.scenario.domainmodel.dataclasses.map(function (dataclass){
      return <SideBarSingleDomainModelAttribute scenario={this.props.scenario} dataclass={dataclass} />
    }.bind(this));

    return (
      <div className="sidebar-links">
          <div className="link-blue selected">
              <Link to={"scenario/" + this.props.scenario._id + "/domainmodel/" + this.props.scenario.domainmodel._id} >
                  <i className="fa fa-newspaper-o"></i>DomainModel
              </Link>
              <ul className="sub-links">
                  {list}
                  <li>
                    <a
                        href="#"
                        data-toggle="modal"
                        data-target="#createFragmentModal"
                    >
                        <i className="fa fa-plus"></i> Create a data class
                    </a>
                  </li>
              </ul>
          </div>
      </div>
    );
  }
}
);
module.exports = SideBarDomainModel;
