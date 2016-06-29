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
        var list = this.props.fragments.map(function (fragment){
          var selected = (fragment._id == this.state.selected) ? 'selected' : '';
          return <SideBarFragment fragment={fragment} selected={selected} setSelectedFragment={setSelectedFragment}/>
        }.bind(this));
        return (
            <div className="sidebar-links">
                <div className="link-blue selected">
                  <a href="#">
                    <i className="fa fa-newspaper-o"></i>Fragments
                  </a>
                  <ul className="sub-links">
                      {list}
                      <li>
                        <a
                            href="#"
                            data-toggle="modal"
                            data-target="#createFragmentModal"
                        >
                            <i className="fa fa-plus"></i> Create a fragment
                        </a>
                      </li>
                  </ul>
                </div>
            </div>
        );
    }
});
module.exports = SideBarFragmentList;
