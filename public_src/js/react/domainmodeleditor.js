var React = require('react');
var MessageHandler = require('./../messagehandler');
var API = require('./../api');

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
                        <input type="text"
                               className="form-control"
                               value={this.props.datatype}
                               onChange={this.handleDataTypeChange} />
                    </div>
                    <div className="col-sm-1">
                        <button type="button" className="btn btn-danger" onClick={this.props.onDelete}><i className="fa fa-times"></i></button>
                    </div>
                </div>
            </li>
        );
    }
});

var DataClassHeaderComponent = React.createClass({
    render: function() {
        return (
            <div className="panel-heading clearfix">
                <div className="row">
                    <div className="col-sm-5">
                        <h3 className="panel-title">
                            {this.props.name}</h3>
                    </div>
                    <div className="col-sm-4">
                        <TypeSelect
                            is_event={this.props.is_event}
                            handleType={this.props.handleType}
                            />
                    </div>
                    <div className="col-sm-3">
                        <div className="btn-group">
                            <button type="button" className="btn btn-danger" onClick={this.props.handleDelete}>
                                <i className="fa fa-times" ></i>
                            </button>
                            <button type="button" className="btn btn-success" onClick={this.props.exportClass}>
                                <i className="fa fa-floppy-o" ></i>
                            </button>
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
        this.props.handleAdd(this.state.newname);
        this.setState({newname: ''});
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
        if (newItem && /^[a-zA-Z0-9_]+$/.test(newItem)
            && this.state.items.every(
                function (element) {
                return element.name != newItem;
            })) {
            var newItems = this.state.items.concat([{name: newItem, datatype: 'String'}]);
            this.props.handleUpdate({
                name: this.props.name,
                is_event: this.props.is_event,
                attributes: this.state.items
            });
            this.setState({items: newItems,newname:""});
        } else {
            MessageHandler.handleMessage("warning","Only unique alphanumeric (+\"_\") names are allowed!");
        };
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
        if (type == "event") {is_event = true;};
        this.props.handleUpdate({
            name: this.props.name,
            is_event: is_event,
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
                />);
        }.bind(this));
        return (
            <div className="panel panel-default">
                <DataClassHeaderComponent name={this.props.name} handleType={this.handleType} handleDelete={this.props.handleDelete} exportClass={this.exportClass} is_event={this.props.is_event} />
                <ul className="list-group">
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
        if (type == "event") {is_event = true;};
        var newItem = this.state.newname;
        if (newItem && /^[a-zA-Z0-9_]+$/.test(newItem)) {
            //console.log("[DBG] creating a new " + type + " class, so is_event = " + is_event);
            if (this.props.onSubmit(newItem, is_event)) {
                this.setState({newname: ''});
            } else {
                MessageHandler.handleMessage("warning","Only unique names are allowed!");
            }
        } else {
            MessageHandler.handleMessage("warning", "Only alphanumeric (+\"_\") names are allowed!");
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
            }
        }
    },
    handleExport: function() {
        API.exportDomainModel(this.state.dm);
        MessageHandler.handleMessage('success','Saved domain model.');
    },
    handleUpdate: function(index) {
        var handler = function(dataclass) {
            var dm = this.state.dm;
            dm.dataclasses[index] = dataclass;
            this.setState({'dm':dm});
        }.bind(this);
        return handler;
    },
    handleDelete: function(index) {
        var handler = function() {
            var dm = this.state.dm;
            dm.dataclasses.splice(index,1);
            this.setState({'dm':dm});
        }.bind(this);
        return handler;
    },
    handleCreateNew: function(name, is_event) {
        var dataclass = {
            "name": name,
            "is_event": is_event,
            "attributes": []
        };
        var dm = this.state.dm;
        if (dm.dataclasses.every(
                function (element, index, array) {
                    return element.name != dataclass.name;
                })) {
            dm.dataclasses.push(dataclass);
            this.setState({'dm':dm});
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
    render: function() {
        var cols = [[],[],[]];
        this.state.dm.dataclasses.forEach(function(dataclass, index) {
            cols[index % 3].push(dataclass);
        });
        var cols = cols.map(function(col, colindex){
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
        }.bind(this));
    },
    componentDidUpdate: function() {
        if (this.props.params.id != this.state.dm._id) {
            API.loadDomainModel(this.props.params.id, function(data,resp) {
                this.setState({'dm': data});
            }.bind(this));
        }
    }
});

module.exports = DomainModelEditorComponent;