var React = require('react');
var Link = require('react-router').Link;
var TopBarInput = require('./topbarinput');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var SideBarManager = require('./../../sidebarmanager');

var FragmentTopBarComponent = React.createClass({
    getInitialState: function() {
      return {
        nameIsEditable: false,
        newFragmentName: "",
        fragmentID: "",
      };
    },
    componentDidMount: function() {
      this.setState({nameIsEditable: false});
    },
    componentWillReceiveProps: function(nextProps) {
      this.resetFragmentName(nextProps);
    },
    resetFragmentName: function(nextProps) {
      var fragmentName = "";
      var fragID = "";
      nextProps.scenario.fragments.forEach(function(fragment) {
        if (fragment._id == nextProps.fragmentId) {
          fragmentName = fragment.name;
          fragID = fragment._id;
        }
      });
      this.setState({newFragmentName: fragmentName, fragmentID: fragID});
    },
    onFragmentNameChange: function(name) {
      this.setState({newFragmentName: name});
    },
    handleRenameClick: function() {
      if(this.state.nameIsEditable)
      {
        var newFragment = "";
        var fragID = this.state.fragmentID;
        var newFragName = this.state.newFragmentName;
        var oldFragName = "";
        this.props.scenario.fragments.forEach(function(fragment) {
          if(fragment._id == fragID) {
            oldFragName = fragment.name;
            newFragment = JSON.parse(JSON.stringify(fragment)); // clone the object, not the pointer
            newFragment.name = newFragName;
          }
        });

        if (NameCheck.check(this.state.newFragmentName)
        && (this.state.newFragmentName != oldFragName)
        && NameCheck.isUnique(this.state.newFragmentName, this.props.scenario.fragments)) {
          API.exportFragment(newFragment, function() {
            MessageHandler.handleMessage("success","Saved new fragment name!");
            SideBarManager.reload();
          });
        }
      }
      this.setState({nameIsEditable: !this.state.nameIsEditable});
    },
    handleRenameCancel : function() {
      this.setState({nameIsEditable: false});
      this.resetFragmentName(this.props);
    },
    handleSaveClick: function() {
      this.props.editorSave();
    },
    render: function() {
        return (
            <div className="row topbar">
              <div className="col-md-8 col-xs-12">
                <span className="h1">
                  <a href="#" className="homeIcon">
                    <i className="fa fa-home"></i>
                  </a>
                  &nbsp;

                  <Link to={"scenario/" + this.props.scenario._id}>
                    {this.props.scenario.name}
                  </Link>
                  &nbsp;/&nbsp;

                    <TopBarInput
                      initialValue={this.state.newFragmentName}
                      editable={this.state.nameIsEditable}
                      handleEnter={this.handleRenameClick}
                      onChange={this.onFragmentNameChange}
                      handleCancel={this.handleRenameCancel}
                    />
                  </span>
              </div>
              <div className="col-md-4 col-xs-12">
                <div className="btn-group pull-right">
                  <button
                      type="button"
                      className="btn btn-success"
                      onClick={this.handleRenameClick}
                  >
                      <i className="fa fa-pencil"></i> {this.state.nameIsEditable ? "Done" : "Edit"}
                  </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        data-toggle="modal"
                        data-target="#deleteFragmentModal"
                        data-fragid={this.state.fragmentID}
                    >
                        <i className="fa fa-trash"></i> Delete
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={this.handleSaveClick}
                    >
                        <i className="fa fa-check"></i> Save
                    </button>
                </div>
              </div>
            </div>
        )
    }
});

module.exports = FragmentTopBarComponent;
