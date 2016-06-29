var React = require('react');
var Link = require('react-router').Link;

var SideBarSingleDomainModelAttribute = React.createClass({
    handleFragmentClick: function(e) {
        this.props.setSelectedFragment(this.props.fragment._id);
    },
    render: function() {
        return (
          <li key={this.props.fragment._id}>
              <div className="btn-group pull-right">
                  <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      data-toggle="modal"
                      data-target="#deleteFragmentModal"
                      data-fragid={this.props.fragment._id}
                  >
                      <i className="fa fa-trash"></i>
                  </button>
                  <button
                      type="button"
                      className="btn btn-success btn-xs"
                      data-toggle="modal"
                      data-target="#modifyFragmentModal"
                      data-fragid={this.props.fragment._id}
                      data-fragname={this.props.fragment.name}
                  >
                      <i className="fa fa-wrench"></i>
                  </button>
              </div>
              <Link
                to={"fragment/" + this.props.fragment._id}
                onClick={this.handleFragmentClick}
              >
                {this.props.fragment.name}
              </Link>
          </li>
        );
    }
});

module.exports = SideBarSingleFragment;
