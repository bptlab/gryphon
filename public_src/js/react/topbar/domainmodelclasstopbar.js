var React = require('react');
var Link = require('react-router').Link;
var TopBarInput = require('./topbarinput');
var API = require('./../../api');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var SideBarManager = require('./../../sidebarmanager');

var DomainModelClassTopBarComponent = React.createClass({
    getInitialState: function() {
      return {
        nameIsEditable: false,
        newClassName: "",
        dataclassId: "",
      };
    },
    componentDidMount: function() {
      this.setState({nameIsEditable: false});
    },
    componentWillReceiveProps: function(nextProps) {
      var className = "";
      var classId = "";
      nextProps.scenario.domainmodel.dataclasses.forEach(function(dataclass) {
        if (dataclass._id == nextProps.dataclassId) {
          className = dataclass.name;
          classId = dataclass._id;
        }
      });
      this.setState({newClassName: className, dataclassId: classId});
    },
    onClassNameChange: function(name) {
      this.setState({newClassName: name});
    },
    handleRenameClick: function() {
      if(this.state.nameIsEditable)
      {
        var dataclassId = this.state.dataclassId;
        var newClassName = this.state.newClassName;
        var oldClassName = "";
        var dm = JSON.parse(JSON.stringify(this.props.scenario.domainmodel));
        dm.dataclasses.forEach(function(dataclass) {
          if(dataclass._id == dataclassId) {
            oldClassName = dataclass.name;
            dataclass.name = newClassName;
          }
        });

        if (NameCheck.check(this.state.newClassName)
        && (this.state.newClassName != oldClassName)
        && NameCheck.isUnique(this.state.newClassName, this.props.scenario.domainmodel.dataclasses)) {
          API.exportDomainModel(dm, function(){
            this.setState({dataclassId: ''});
            this.setState({newClassName: ''});
            MessageHandler.handleMessage('success', 'Renamed class!');
            SideBarManager.reload();
          }.bind(this));
        }
      }
      this.setState({nameIsEditable: !this.state.nameIsEditable});
    },
    handleSaveClick: function() {
      this.props.editorSave();
    },
    render: function() {
        return (
            <div className="row">
              <div className="col-md-8">
                <span className="h1">
                  <a href="#">
                    <i className="fa fa-home"></i>
                  </a>
                  &nbsp;

                  <Link to={"scenario/" + this.props.scenario._id}>
                    {this.props.scenario.name}
                  </Link>
                  &nbsp;/&nbsp;

                    <TopBarInput
                      initialValue={this.state.newClassName}
                      editable={this.state.nameIsEditable}
                      handleEnter={this.handleRenameClick}
                      onChange={this.onClassNameChange}
                    />
                  </span>
                <hr />
              </div>
              <div className="col-md-3">
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
                        data-target="#DeleteDomainModelClassModal"
                        data-scenid={this.props.scenario._id}
                        data-classid={this.state.dataclassId}
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

module.exports = DomainModelClassTopBarComponent;
