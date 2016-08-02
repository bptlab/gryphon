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
                  data-target="#modifyFragmentModal"
                  data-fragid={this.props.dataclass._id}
                  data-fragname={this.props.dataclass.name}
              >
                  <i className="fa fa-pencil"></i>
              </button>
                  <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      data-toggle="modal"
                      data-target="#deleteFragmentModal"
                      data-fragid={this.props.dataclass._id}
                  >
                      <i className="fa fa-trash"></i>
                  </button>
              </div>
              <Link
                to={"scenario/" + this.props.scenario._id + "/domainmodel/" + this.props.dataclass._id}
                onClick={this.handleFragmentClick}
              >
                {this.props.dataclass.name}
              </Link>
          </li>
        );
    }
});

module.exports = SideBarSingleDomainModelAttribute;
