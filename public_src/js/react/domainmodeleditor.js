var React = require('react');
var MessageHandler = require('./../messagehandler');
var NameCheck = require('./../namecheck');
var API = require('./../api');
var Config = require('./../config');
var Link = require('react-router').Link;

var TypeSelect = React.createClass({
    getInitialState: function() {
        var type;
        if (this.props.is_event) {type = "event"} else {type = "data"};
        return {value: type};
    },
    handleChange: function(event) {
        var newState = event.target.value;
        this.setState({value: newState});
        this.props.handleType(newState);
    },

    render: function() {
        var value = this.state.value;
        return (
            <select value={value} onChange={this.handleChange} className="form-control">
                <option value="data">Data</option>
                <option value="event">Event</option>
            </select>
        );
    }
});

var DataClassAttributeComponent = React.createClass({
    getDefaultProps: function() {
        return {
            onClick: function() {}
        }
    },
    handleNameChange: function(e) {
        this.props.handleNameChange(e);
    },
    handleDataTypeChange: function(e) {
        this.props.handleDataTypeChange(e);
    },
    render: function() {
        var availableFixedTypes = ["String","Integer","Double","Boolean","Enum"].map(function(dt){
            return (
                <option value={dt}>{dt}</option>
            )
        });
        var availableTypes = this.props.availableDataTypes.map(function(dt){
            return (
                <option value={dt}>{dt}</option>
            )
        });
        return (
            <li className="list-group-item clearfix">
                <div className="row">
                    <div className="col-sm-5">
                        <input
                            type="text"
                            className="form-control"
                            value={this.props.name}
                            onChange={this.handleNameChange} />
                    </div>
                    <div className="col-sm-5">
                        <select className="selectpicker" onChange={this.handleDataTypeChange} value={this.props.datatype} data-live-search="true" id={this.props.name + "-dtselect"}>
                            <optgroup label="Scalar Type">
                                {availableFixedTypes}
                            </optgroup>
                            <optgroup label="Class-Reference">
                                {availableTypes}
                            </optgroup>
                        </select>
                    </div>
                    <div className="col-sm-1">
                        <button type="button" className="btn btn-danger" onClick={this.props.onDelete}><i className="fa fa-times"></i></button>
                    </div>
                </div>
            </li>
        );
    },
    componentDidMount: function() {
        $('#' + this.props.name + '-dtselect').selectpicker();
    },
    componentDidUpdate: function() {
        $('#' + this.props.name + '-dtselect').selectpicker();
    }
});

var DataClassHeaderComponent = React.createClass({
    render: function() {
        var olcStatus = '';
        if (this.props.changed == false) {
            olcStatus = (
                <Link to={"olc/" + this.props.dmid + "/" + this.props.id} className="btn btn-primary">
                    Edit OLC
                </Link>
            )
        }
        return (
            <div className="panel-heading clearfix">
                <div className="row">
                    <div className="col-sm-6">
                        <TypeSelect
                            is_event={this.props.is_event}
                            handleType={this.props.handleType}
                            />
                    </div>
                    <div className="col-sm-6">
                        <div className="btn-group">
                            <button type="button" className="btn btn-danger" onClick={this.props.handleDelete}>
                                <i className="fa fa-times" ></i>
                            </button>
                            {olcStatus}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DataClassFooterComponent = React.createClass({
    getInitialState: function() {
        return {newname: ''}
    },
    handleChange: function(e) {
        this.setState({newname: e.target.value});
    },
    handleAdd: function() {
            if (this.props.handleAdd(this.state.newname)) {
                this.setState({newname: ''});
            }
    },
    render: function() {
        return (
            <div className="panel-footer">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="New attribute"
                                value = {this.state.newname}
                                onChange = {this.handleChange}
                                />
                            <div className="input-group-btn">
                                <button className="btn btn-primary" onClick={this.handleAdd}>New attribute</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DataClassComponent = React.createClass({
    getInitialState: function() {
        return {items: [],newname:""};
    },
    handleAttrAdd: function(newItem) {
        if (NameCheck.check(newItem) && NameCheck.isUnique(newItem, this.state.items)) {
            var newItems = this.state.items.concat([{name: newItem, datatype: 'String'}]);
            this.setState({items: newItems,newname:""});
            this.props.handleUpdate({
                name: this.props.name,
                is_event: this.props.is_event,
                attributes: newItems
            });
            return true;
        }
    },
    handleRemove: function(i) {
        return (function() {
            var newItems = this.state.items;
            newItems.splice(i, 1);
            this.setState({items: newItems});
        }).bind(this);
    },
    handleType: function(type) {
        var is_event = false;
        if (type == "event") {is_event = true;}
        this.props.handleUpdate({
            name: this.props.name,
            is_event: is_event,
            attributes: this.state.items
        });
    },
    handleClassNameChange: function(e) {
        this.props.handleUpdate({
            name: e.target.value,
            is_event: this.props.is_event,
            attributes: this.state.items
        });
    },
    exportClass: function() {
        this.props.handleUpdate({
            name: this.props.name,
            is_event: this.props.is_event,
            attributes: this.state.items
        });
        this.props.handleExport();
    },
    handleAttrNameChange: function(i) {
        return (function(e) {
            var value = e.target.value;
            var items = this.state.items;
            items[i].name = value;
            this.setState({items: items});
            this.props.handleUpdate({
                name: this.props.name,
                is_event: this.props.is_event,
                attributes: this.state.items
            });
        }).bind(this);
    },
    handleAttrTypeChange: function(i) {
        return (function(e) {
            var value = e.target.value;
            if (!this.props.validateAttrType(value)) {
                MessageHandler.handleMessage("warning", "You've entered an invalid DataType.");
                $(e.target).parent().addClass('has-error');
            } else {
                $(e.target).parent().removeClass('has-error');
            }
            var items = this.state.items;
            items[i].datatype = value;
            this.setState({items: items});
            this.props.handleUpdate({
                name: this.props.name,
                is_event: this.props.is_event,
                attributes: this.state.items
            });
        }).bind(this);
    },
    render: function() {
        var items = this.state.items.map(function(item, i) {
            return (
                <DataClassAttributeComponent
                    name={item.name}
                    key={"dataclass"+i}
                    datatype={item.datatype}
                    onDelete={this.handleRemove(i)}
                    handleDataTypeChange={this.handleAttrTypeChange(i)}
                    handleNameChange={this.handleAttrNameChange(i)}
                    availableDataTypes={this.props.availableDataTypes}
                />);
        }.bind(this));
        return (
            <div className="panel panel-default">
                <DataClassHeaderComponent
                    name={this.props.name}
                    id={this.props.id}
                    dmid={this.props.dmid}
                    handleType={this.handleType}
                    handleDelete={this.props.handleDelete}
                    exportClass={this.exportClass}
                    is_event={this.props.is_event}
                    changed={this.props.modelChanged}
                />
                <ul className="list-group">
                    <li className="list-group-item clearfix">
                        <input
                                    type="text"
                                    className="form-control"
                                    value={this.props.name}
                                    onChange={this.handleClassNameChange}
                            />
                    </li>
                    {items}
                </ul>
                <DataClassFooterComponent handleAdd={this.handleAttrAdd} />
            </div>
        );
    },
    componentDidMount: function() {
        this.setState({
            items: this.props.initialItems
        });
    }
});

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
        var handler = function(dataclass) {
            var dm = this.state.dm;
            dm.dataclasses[index] = dataclass;
            this.setState({'dm':dm, 'changed':true});
        }.bind(this);
        return handler;
    },
    handleDelete: function(index) {
        var handler = function() {
            var dm = this.state.dm;
            dm.dataclasses.splice(index,1);
            this.setState({'dm':dm, 'changed':true});
        }.bind(this);
        return handler;
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