var React = require('react');
var MessageHandler = require('./../../messagehandler');
var NameCheck = require('./../../namecheck');
var Link = require('react-router').Link;

var TypeSelect = React.createClass({
    getInitialState: function() {
        return {isEvent: this.props.is_event};
    },
    handleChange: function(event) {
        var isEvent = event.target.checked == true;
        this.setState({isEvent: isEvent});
        this.props.handleType(isEvent);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({isEvent: nextProps.is_event});
    },
    render: function() {
        var value = this.state.value;
        return (
            <div className="checkbox">
                <label>
                <input
                    type="checkbox"
                    checked={this.state.isEvent}
                    onChange={this.handleChange}
                />
                Use as event type
                </label>
            </div>
        );
    }
});

var TypeSelectDB = React.createClass({
    getInitialState: function() {
        return {isDBClass: this.props.is_dbclass};
    },
    handleChange: function(event) {
        var isDBClass = event.target.checked == true;
        this.setState({isDBClass: isDBClass});
        this.props.handleType(isDBClass);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({isDBClass: nextProps.is_DBClass});
    },
    render: function() {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={this.state.isDBClass}
                        onChange={this.handleChange}
                    />
                    Use as DB type
                </label>
            </div>
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
        var availableFixedTypes = ["String","Integer","Double","Boolean","Enum","Date","File"].map(function(dt){
            var key="fixedType_" + dt;
            return (
                <option value={dt} key={key}>{dt}</option>
            )
        });
        var availableTypes = this.props.availableDataTypes.map(function(dt){
            var key = "classType_" + dt;
            return (
                <option value={dt} key={key}>{dt}</option>
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
                            onChange={this.handleNameChange}
                            onKeyDown={this.props.handleEnterSubmit}
                        />
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
        return (
            <div className="panel-heading clearfix">
                <div className="row">
                    <div className="col-sm-8 col-md-6 col-lg-4">
                        <TypeSelect
                            is_event={this.props.is_event}
                            handleType={this.props.handleType}
                        />
                    </div>
                    <div className="col-sm-1">
                      <a
                        data-toggle="tooltip"
                        data-container="body"
                        title="Data classes store information available in a case. Event classes specify expected external events and are registered with Unicorn."
                      >
                        <i className="fa fa-info-circle"></i>
                      </a>
                    </div>
                    <div className="col-sm-8 col-md-6 col-lg-4">
                        <TypeSelectDB
                            is_DBClass={this.props.is_DBClass}
                            handleTypeDB={this.props.handleTypeDB}
                        />
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
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.handleAdd()
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
                                onKeyDown = {this.handleEnterSubmit}
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
        return {
          items: [{_id:"0",name:"",datatype:"String"}],
          newname:""
        };
    },
    handleAttrAdd: function(newItem) {
        if (NameCheck.check(newItem) && NameCheck.isUnique(newItem, this.state.items)) {
            var newItems = this.state.items.concat([{name: newItem, datatype: 'String'}]);
            this.setState({items: newItems,newname:""});
            this.props.handleUpdate({
                name: this.props.name,
                is_event: this.props.is_event,
                is_CBClass: this.props.is_DBClass,
                attributes: newItems,
                _id: this.props.id
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
    update: function() {
        this.props.handleUpdate({
            name: this.props.name,
            is_event: this.props.is_event,
            is_CBClass: this.props.is_DBClass,
            attributes: this.state.items,
            _id: this.props.id
        });
    },
    handleType: function(new_is_event) {
        var is_event = new_is_event;
        this.props.handleUpdate({
            name: this.props.name,
            is_event: is_event,
            is_CBClass: this.props.is_DBClass,
            attributes: this.state.items,
            _id: this.props.id
        });
    },
    handleTypeDB: function(new_is_dbType) {
        this.props.handleUpdate({
            name: this.props.name,
            is_event: this.props.is_event,
            is_CBClass: new_is_dbType,
            attributes: this.state.items,
            _id: this.props.id
        });
    },
    handleClassNameChange: function(e) {
        this.props.handleUpdate({
            name: e.target.value,
            is_event: this.props.is_event,
            is_CBClass: this.props.is_DBClass,
            attributes: this.state.items,
            _id: this.props.id
        });
    },
    exportClass: function() {
        this.update();
        this.props.handleExport();
    },
    handleAttrNameChange: function(i) {
        return (function(e) {
            var value = e.target.value;
            var items = this.state.items;
            items[i].name = value;
            this.setState({items: items});
            this.update();
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
                is_CBClass: this.props.is_DBClass,
                attributes: this.state.items,
                _id: this.props.id
            });
        }).bind(this);
    },
    handleEnterSubmit: function(e) {
        if (e.keyCode == 13) {
            this.props.handleExport()
        }
    },
    render: function() {
      if(!this.state.items) {
        return (<div className="panel panel-default">loading...</div>);
      }
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
                    handleEnterSubmit={this.handleEnterSubmit}
                />);
        }.bind(this));

        return (
            <div className="panel panel-default">
                <DataClassHeaderComponent
                    name={this.props.name}
                    id={this.props.id}
                    dmid={this.props.dmid}
                    handleType={this.handleType}
                    handleTypeDB={this.handleTypeDB}
                    handleDelete={this.props.handleDelete}
                    exportClass={this.exportClass}
                    is_event={this.props.is_event}
                    is_DBClass={this.props.is_DBClass}
                    scenid={this.props.scenid}
                    changed={this.props.modelChanged}
                />
                <ul className="list-group">
                    {items}
                </ul>
                <DataClassFooterComponent handleAdd={this.handleAttrAdd} />
            </div>
        );
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({
        items: nextProps.initialItems
      });
    },
    componentDidMount: function() {
        this.setState({
            items: this.props.initialItems
        });
    }
});

module.exports = DataClassComponent;
