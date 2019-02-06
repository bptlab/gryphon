var React = require('react');
var MessageHandler = require('../../messagehandler');
var NameCheck = require('../../namecheck');
var DataClassAttributeComponent = require('./dataclassattribute');
var DataClassHeaderComponent = require('./dataclassheader');
var DataClassFooterComponent = require('./dataclassfooter');
var Link = require('react-router').Link;

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
                is_resource: this.props.is_resource,
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
            is_resource: this.props.is_resource,
            attributes: this.state.items,
            _id: this.props.id
        });
    },
    handleType: function(new_is_event, new_is_resource) {
        var is_event = new_is_event;
        var is_resource = new_is_resource;
        this.props.handleUpdate({
            name: this.props.name,
            is_event: is_event,
            is_resource: is_resource,
            attributes: this.state.items,
            _id: this.props.id
        });
    },
    handleClassNameChange: function(e) {
        this.props.handleUpdate({
            name: e.target.value,
            is_event: this.props.is_event,
            is_resource: this.props.is_resource,
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
                is_resource: this.props.is_resource,
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
                    handleDelete={this.props.handleDelete}
                    exportClass={this.exportClass}
                    is_event={this.props.is_event}
                    is_resource={this.props.is_resource}
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
