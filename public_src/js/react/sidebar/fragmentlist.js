var React = require('react');
var API = require('./../../api');
var SideBarManager = require('./../../sidebarmanager');

var SideBarFragment = require('./fragment');

var SideBarFragmentList = React.createClass({
    getInitialState: function() {
        return {
            selected: ""
        }
    },
    setSelectedFragment: function(fragmentId) {
        this.setState({selected: fragmentId});
    },
    render: function() {
        var setSelectedFragment = this.setSelectedFragment;
        var list = this.props.scenario.fragments.sort((a, b) => { if (a.name < b.name) return -1; else if (a.name > b.name) return 1; else return 0; }).map(function (fragment){
          var selected = (fragment._id == this.state.selected) ? 'selected' : '';
          var key = "sidebarfragment_" + fragment._id;
          return <SideBarFragment scenario={this.props.scenario} fragment={fragment} selected={selected} setSelectedFragment={setSelectedFragment} key={key} />
        }.bind(this));
        return (
            <div className="sidebar-links">
                <div className="link-blue selected">
                  <a>
                    Fragments
                  </a>
                  <ul className="sub-links">
                      {list}
                      <li>
                        <button
                            type="button"
                            className="btn btn-link btn-sm"
                            data-toggle="modal"
                            data-target="#createFragmentModal"
                            data-scenid={this.props.scenario._id}
                        >
                            <i className="fa fa-plus"></i> create a fragment
                        </button>
                      </li>
                  </ul>
                </div>
            </div>
        );
    }
});
module.exports = SideBarFragmentList;
