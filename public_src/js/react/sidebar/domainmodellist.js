var React = require('react');
var API = require('./../../api');
var SideBarManager = require('./../../sidebarmanager');
var SideBarSingleDomainModelAttribute = require('./domainmodelattribute');
var Link = require('react-router').Link;


var SideBarDomainModel = React.createClass({
  render: function() {;
    var list = this.props.scenario.domainmodel.dataclasses.sort((a, b) => { if (a.name < b.name) return -1; else if (a.name > b.name) return 1; else return 0; }).map(function (dataclass){
      var key= "sidebardomainmodelattribute_" + dataclass._id;
      return (
        <SideBarSingleDomainModelAttribute scenario={this.props.scenario} dataclass={dataclass} key={key} />
      )
    }.bind(this));

    return (
      <div className="sidebar-links">
          <div className="link-blue selected">
              <a>
                Data Model
              </a>
              <ul className="sub-links">
                  {list}
                  <li>
                    <button
                        type="button"
                        className="btn btn-link btn-sm"
                        data-toggle="modal"
                        data-target="#createDomainModelClassModal"
                        data-scenid={this.props.scenario._id}
                    >
                        <i className="fa fa-plus"></i> create a data class
                    </button>
                  </li>
              </ul>
          </div>
      </div>
    );
  }
}
);
module.exports = SideBarDomainModel;
