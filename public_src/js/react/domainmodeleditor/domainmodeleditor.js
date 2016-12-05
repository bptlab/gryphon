var React = require('react');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var API = require('./../../api');
var Config = require('./../../config');
var DataClassComponent = require('./dataclass');
var OLCEditorComponent = require('./../olceditor');

var CreateNewClassComponent = React.createClass({
    getInitialState: function() {
        return {
            newname: ''
        }
    },
    handleChange: function(e) {
        this.setState({newname: e.target.value});
    },
    handleSubmit: function(type) {
        var is_event = false;
        if (type == "event") {is_event = true;}
        var newItem = this.state.newname;
        if (NameCheck.check(newItem)) {
            if (this.props.onSubmit(newItem, is_event)) {
                this.setState({newname: ''});
            }
        }
    },
    submitData: function() {
        this.handleSubmit("data");
    },
    submitEvent: function() {
        this.handleSubmit("event");
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.submitData()
        }
    },
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Create a new class
                </div>
                <div className="panel-body">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="domainmodelDataClassName"
                            placeholder="New class"
                            value = {this.state.newname}
                            onChange = {this.handleChange}
                            onKeyDown = {this.handleEnterSubmit}
                            />
                        <div className="input-group-btn">
                            <button className="btn btn-primary" onClick={this.submitData}>Create dataclass</button>
                            <button className="btn btn-primary" onClick={this.submitEvent}>Create eventclass</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var OperationsComponent = React.createClass({
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Operations
                </div>
                <div className="panel-body">
                    <div className="btn-group btn-block">
                        <button className="btn btn-success" onClick={this.props.onSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
});

var DomainModelEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            dm: {
                name: "",
                dataclasses: []
            },
            changed: false,
            editorInstance: {}
        }
    },
    saveDiagram: function(show_success) {
      this.handleExport();
      this.refs.OLCEditor.saveDiagram(show_success);
    },
    handleExport: function() {
        API.exportDomainModel(this.props.scenario.domainmodel,function(data){
            this.setState({'changed':false,'dm':data});
        }.bind(this));
        MessageHandler.handleMessage('success','Saved domain model.');
    },
    handleUpdate: function(index) {
        console.log("DomainModelEditor handleUpdate()");
        return function(dataclass) {
            var dm = this.props.scenario.domainmodel;
            for (var attr in dataclass) {
                if (dataclass.hasOwnProperty(attr)) {
                    dm.dataclasses[index][attr] = dataclass[attr];
                }
            }
            this.setState({'dm':dm, 'changed':true});
        }.bind(this);
    },
    handleDelete: function(index) {
        return function() {
            var dm = this.props.scenario.domainmodel;
            dm.dataclasses.splice(index,1);
            this.setState({'dm':dm, 'changed':true});
        }.bind(this);
    },
    handleCreateNew: function(name, is_event) {
        var dataclass = {
            "name": name,
            "is_event": is_event,
            "attributes": [],
            "olc": Config.DEFAULT_OLC_XML
        };
        var dm = this.props.scenario.domainmodel;
        if (NameCheck.isUnique(dataclass.name, dm.dataclasses)) {
            dm.dataclasses.push(dataclass);
            this.setState({'dm':dm, 'changed':true});
            return true; //signal successful creation (evaluated by invoking component)
        }
    },
    validateAttrType: function(type){
        var types = ["String","Integer","Double","Boolean","Enum"];
        if (types.indexOf(type) >= 0) {
            return true;
        }
        return this.props.scenario.domainmodel.dataclasses.some(function(dataclass){
            return (dataclass.name == type)
        })
    },
    getAvailableDataTypes: function() {
        var types = [];
        types = types.concat(this.props.scenario.domainmodel.dataclasses.map(function(dataclass){
            return dataclass.name;
        }));
        return types;
    },
    render: function() {
      console.log("DomainModelEditor.render() props: ", this.props);
        var selectedDataclass = {};
        var i = 0;
        for (var i = 0; i < this.props.scenario.domainmodel.dataclasses.length; i++){
          if(this.props.scenario.domainmodel.dataclasses[i]._id == this.props.params.dataclassId) {
            selectedDataclass = this.props.scenario.domainmodel.dataclasses[i];
            break;
          }
        }
        content =
          <DataClassComponent
              handleUpdate={this.handleUpdate(i)}
              handleDelete={this.handleDelete(i)}
              handleExport={this.handleExport}
              validateAttrType={this.validateAttrType}
              initialItems={selectedDataclass.attributes}
              name={selectedDataclass.name}
              is_event={selectedDataclass.is_event}
              availableDataTypes={this.getAvailableDataTypes()}
              modelChanged={this.state.changed}
              id={selectedDataclass._id}
              dmid = {this.props.scenario.domainmodel._id}
              scenid = {this.props.scenario._id}
              />;

        return (
          <div>
            <div className="col-md-12">
                <div className="row">
                  <div className="col-md-8 col-md-offset-2">
                    {content}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <a data-toggle="collapse" href="#collapseExample">
                          <h3 className="panel-title">OLC Editor</h3>
                        </a>
                      </div>
                      <div className="panel-body collapse" id="collapseExample">
                        <div style={{height: "300px"}}>
                        <OLCEditorComponent
                          scenarioId={this.props.params.scenarioId}
                          domainmodelId={this.props.params.domainmodelId}
                          dataclassId={this.props.params.dataclassId}
                          ref="OLCEditor"
                        />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        )
    },
    componentDidMount: function() {
        API.loadDomainModel(this.props.params.domainmodelId, function(data,resp) {
            this.setState({'dm': data});
            MessageHandler.resetMessages();
        }.bind(this));
        this.props.setEditorInstance(this);
    },
    componentDidUpdate: function() {
        if (this.props.params.domainmodelId != this.props.scenario.domainmodel._id) {
            API.loadDomainModel(this.props.params.domainmodelId, function(data,resp) {
                this.setState({'dm': data});
                MessageHandler.resetMessages();
            }.bind(this));
        }
    }
});

module.exports = DomainModelEditorComponent;
