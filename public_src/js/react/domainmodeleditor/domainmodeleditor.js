var React = require('react');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var API = require('./../../api');
var Config = require('./../../config');
var DataClassComponent = require('./dataclass');

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
                        <button className="btn btn-default">Export events</button>
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
            changed: false
        }
    },
    handleExport: function() {
        API.exportDomainModel(this.state.dm,function(data){
            this.setState({'changed':false,'dm':data});
        }.bind(this));
        MessageHandler.handleMessage('success','Saved domain model.');
    },
    handleUpdate: function(index) {
        return function(dataclass) {
            var dm = this.state.dm;
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
            var dm = this.state.dm;
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
        var dm = this.state.dm;
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
        return this.state.dm.dataclasses.some(function(dataclass){
            return (dataclass.name == type)
        })
    },
    getAvailableDataTypes: function() {
        var types = [];
        types = types.concat(this.state.dm.dataclasses.map(function(dataclass){
            return dataclass.name;
        }));
        return types;
    },
    render: function() {
        var cols = [[],[],[]];
        var cols_length = [0,0,0];
        var smallest = 0;
        this.state.dm.dataclasses.forEach(function(dataclass, index) {
            cols_length[smallest] += (2 + dataclass.attributes.length);
            cols[smallest].push(dataclass);
            smallest = 0;
            var smallest_length = Number.MAX_VALUE;
            cols_length.forEach(function(col_length, index) {
                if (col_length < smallest_length) {
                    smallest_length = col_length;
                    smallest = index;
                }
            });
        });
        cols = cols.map(function(col, colindex){
            var content = col.map(function(dataclass, classindex) {
                var realIndex = (classindex * 3) + colindex;
                return (
                    <DataClassComponent
                        handleUpdate={this.handleUpdate(realIndex)}
                        handleDelete={this.handleDelete(realIndex)}
                        handleExport={this.handleExport}
                        validateAttrType={this.validateAttrType}
                        initialItems={dataclass.attributes}
                        name={dataclass.name}
                        is_event={dataclass.is_event}
                        availableDataTypes={this.getAvailableDataTypes()}
                        modelChanged={this.state.changed}
                        id={dataclass._id}
                        dmid = {this.state.dm._id}
                        />
                )
            }.bind(this));
            return (
                <div className="col-md-4">
                    {content}
                </div>
            );
        }.bind(this));
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        <OperationsComponent onSave={this.handleExport} />
                    </div>
                    <div className="col-md-6">
                        <CreateNewClassComponent onSubmit={this.handleCreateNew} />
                    </div>
                </div>
                <div className="row">
                    {cols}
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        API.loadDomainModel(this.props.params.id, function(data,resp) {
            this.setState({'dm': data});
            MessageHandler.resetMessages();
        }.bind(this));
    },
    componentDidUpdate: function() {
        if (this.props.params.id != this.state.dm._id) {
            API.loadDomainModel(this.props.params.id, function(data,resp) {
                this.setState({'dm': data});
                MessageHandler.resetMessages();
            }.bind(this));
        }
    }
});

module.exports = DomainModelEditorComponent;