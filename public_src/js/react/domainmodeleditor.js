var React = require('react');
var API = require('./../api');

var DataClassAttributeComponent = React.createClass({
    getDefaultProps: function() {
        return {
            onClick: function() {}
        }
    },
    render: function() {
        return (
            <li className="list-group-item clearfix">
                {this.props.name}
                <button type="button" className="btn btn-danger btn-xs pull-right" onClick={this.props.onClick}><i className="fa fa-times"></i></button>
            </li>
        );
    }
});

var DataClassComponent = React.createClass({
    getInitialState: function() {
        return {items: [],newname:""};
    },
    handleChange: function(e) {
        this.setState({newname: e.target.value});
    },
    handleAdd: function() {
        var newItem = this.state.newname;
        if (!newItem || /^\s*$/.test(newItem)) {
            console.log("empty attributes are not allowed!");
        } else {
            var newItems = this.state.items.concat([{name: newItem}]);
            this.props.handleUpdate({
                name: this.props.name,
                attributes: this.state.items
            });
            this.setState({items: newItems,newname:""});
        }
    },
    handleRemove: function(i) {
        var newItems = this.state.items;
        newItems.splice(i, 1);
        this.setState({items: newItems});
    },
    exportClass: function() {
        this.props.handleUpdate({
            name: this.props.name,
            attributes: this.state.items
        });
        this.props.handleExport();
    },
    render: function() {
        var items = this.state.items.map(function(item, i) {
            return (
                <DataClassAttributeComponent name={item.name} key={item.name} onClick={this.handleRemove.bind(null, i)}/>);
        }.bind(this));
        return (
            <div className="panel panel-default">
                <div className="panel-heading clearfix">
                        {this.props.name}
                    <div className="btn-group pull-right">
                        <button type="button" className="btn btn-danger btn-xs" onClick={this.props.handleDelete}>
                            <i className="fa fa-times" ></i>
                        </button>
                        <button type="button" className="btn btn-success btn-xs" onClick={this.exportClass}>
                            <i className="fa fa-floppy-o" ></i>
                        </button>
                    </div>
                </div>
                <ul className="list-group">
                    {items}
                </ul>
                <div className="panel-footer">
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
    handleSubmit: function() {
        this.props.onSubmit(this.state.newname);
        this.setState({newname: ""});
    },
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Create a new dataclass
                </div>
                <div className="panel-body">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="domainmodelDataClassName"
                            placeholder="New dataclass"
                            value = {this.state.newname}
                            onChange = {this.handleChange}
                            />
                        <div className="input-group-btn">
                            <button className="btn btn-primary" onClick={this.handleSubmit}>Create dataclass</button>
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
    handleCreateNew: function(name) {
        var dataclass = {
            "name": name,
            "attributes": []
        };
        var dm = this.state.dm;
        dm.dataclasses.push(dataclass);
        this.setState({'dm':dm});
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
                        initialItems={dataclass.attributes}
                        name={dataclass.name}
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