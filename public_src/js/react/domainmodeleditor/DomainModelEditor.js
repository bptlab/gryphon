var React = require('react');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var API = require('./../../api');
var Config = require('./../../config');
var DataClassComponent = require('./DataClass');
var OLCEditorComponent = require('./../olceditor');

var DomainModelEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            dm: {
                name: "",
                dataclasses: []
            },
            changed: false,
            editorInstance: {},
            editorIsCollapsed: false,
        }
    },
    saveDiagram: function(show_success) {
      this.refs.OLCEditor.saveDiagram(show_success);
      // This is ugly as sin, but saveDiagram will callback this.handleOlcChanged, which will update the state and *after that* call this.handleExport. Sorry!
      //this.handleExport();
    },
    handleExport: function() {
        API.exportDomainModel(this.state.dm,function(data){
            this.setState({'changed':false,'dm':data});
        }.bind(this));
        MessageHandler.handleMessage('success','Saved domain model.');
    },
    handleUpdate: function(index) {
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
    handleOlcChanged: function(olcDm) {
        var targetClassId = this.props.params.dataclassId;
        var mergedDomainModelClasses = this.state.dm.dataclasses.map(function(dataclass) {
            // Find the data class with the updated OLC and merge that into our state
            if (dataclass._id == targetClassId) {
              var dataClassWithNewOLC = olcDm.dataclasses.find(function(dclass) {
                  return dclass._id == targetClassId;
              });
              if (dataClassWithNewOLC) {
                dataclass.olc = dataClassWithNewOLC.olc;
              }
            }
            return dataclass;
        });
        var newDm = this.state.dm;
        newDm.dataclasses = mergedDomainModelClasses;

        this.setState({'dm':newDm, 'changed':true}, function () {
          this.handleExport();
        });
    },
    validateAttrType: function(type){
        var types = ["String","Integer","Double","Boolean","Enum","Date","File"];
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
    collapseOlcEditor: function() {
      this.setState({editorIsCollapsed: true});
    },
    render: function() {
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

        var editorCssClasses = "panel-body";
        if (this.state.editorIsCollapsed) {
          editorCssClasses += " collapse";
        }

        return (
              <div>

                <div className="row">
                  <div className="col-md-8">
                    {content}
                  </div>
                </div>

                <div className="row">
                <div className="col-md-12">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <a data-toggle="collapse" href="#editorCollapse">
                        <span className="h3 panel-title">OLC Editor</span>
                      </a>
                      &nbsp;
                      <a
                        data-toggle="tooltip"
                        data-container="body"
                        title="This editor allows to model the object lifecycle (OLC) of a data class. The OLC defines states and valid state transitions for data objects of that data class. Fragments are validated against the OLC, e.g. no activities are allowed to change the state of a data object if this transition is not allowed in the OLC."
                      >
                        <i className="fa fa-info-circle"></i>
                      </a>
                    </div>
                    <div className={editorCssClasses} id="editorCollapse">
                      <OLCEditorComponent
                        scenarioId={this.props.params.scenarioId}
                        domainmodelId={this.props.params.domainmodelId}
                        dataclassId={this.props.params.dataclassId}
                        changeHandler={this.handleOlcChanged}
                        diagramLoadedCallback={this.collapseOlcEditor}
                        ref="OLCEditor"
                      />
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
