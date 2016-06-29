var React = require('react');
var Link = require('react-router').Link;

var SideBarSingleDomainModelAttribute = React.createClass({
    render: function() {
        return (
          <li key={this.props.attribute._id}>
              <div className="btn-group pull-right">
                  <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      data-toggle="modal"
                      data-target="#deleteFragmentModal"
                      data-fragid={this.props.attribute._id}
                  >
                      <i className="fa fa-trash"></i>
                  </button>
                  <button
                      type="button"
                      className="btn btn-success btn-xs"
                      data-toggle="modal"
                      data-target="#modifyFragmentModal"
                      data-fragid={this.props.attribute._id}
                      data-fragname={this.props.attribute.name}
                  >
                      <i className="fa fa-wrench"></i>
                  </button>
              </div>
              <Link
                to={"domainmodel/" + this.props.attribute._id}
                onClick={this.handleFragmentClick}
              >
                {this.props.attribute.name}
              </Link>
          </li>
        );
    }
});

module.exports = SideBarSingleDomainModelAttribute;
