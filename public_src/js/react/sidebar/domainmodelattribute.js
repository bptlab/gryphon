var React = require('react');
var Link = require('react-router').Link;

var SideBarSingleDomainModelAttribute = React.createClass({
    render: function() {
        return (
          <li key={this.props.dataclass._id}>
              <div className="btn-group pull-right">
              <button
                  type="button"
                  className="btn btn-success btn-xs"
                  data-toggle="modal"
                  data-target="#ModifyDomainModelClassModal"
                  data-scenid={this.props.scenario._id}
                  data-classid={this.props.dataclass._id}
                  data-classname={this.props.dataclass.name}
              >
                  <i className="fa fa-pencil"></i>
              </button>
                  <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      data-toggle="modal"
                      data-target="#DeleteDomainModelClassModal"
                      data-scenid={this.props.scenario._id}
                      data-classid={this.props.dataclass._id}
                  >
                      <i className="fa fa-trash"></i>
                  </button>
              </div>
              <Link
                to={"scenario/" + this.props.scenario._id + "/domainmodel/" + this.props.scenario.domainmodel._id + "/dataclass/" + this.props.dataclass._id}
                onClick={this.handleFragmentClick}
              >
                {this.props.dataclass.name}
              </Link>
          </li>
        );
    }
});

module.exports = SideBarSingleDomainModelAttribute;
