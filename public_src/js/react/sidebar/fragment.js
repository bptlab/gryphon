var React = require('react');
var Link = require('react-router').Link;

var SideBarSingleFragment = React.createClass({
    handleFragmentClick: function(e) {
        this.props.setSelectedFragment(this.props.fragment._id);
    },
    render: function() {
        console.log("Fragment render this.props.fragment: ", this.props.fragment);
        return (
          <li key={this.props.fragment._id}>
              <div className="btn-group pull-right">
              <button
                  type="button"
                  className="btn btn-success btn-xs"
                  data-toggle="modal"
                  data-target="#modifyFragmentModal"
                  data-fragid={this.props.fragment._id}
                  data-fragname={this.props.fragment.name}
              >
                  <i className="fa fa-pencil"></i>
              </button>
                  <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      data-toggle="modal"
                      data-target="#deleteFragmentModal"
                      data-fragid={this.props.fragment._id}
                  >
                      <i className="fa fa-trash"></i>
                  </button>
              </div>
              <Link
                to={"scenario/" + this.props.scenario._id + "/fragment/" + this.props.fragment._id}
                onClick={this.handleFragmentClick}
              >
                {this.props.fragment.name}
              </Link>
          </li>
        );
    }
});

module.exports = SideBarSingleFragment;
