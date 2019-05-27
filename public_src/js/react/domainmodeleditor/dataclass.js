var React = require('react');
var MessageHandler = require('../../messagehandler');
var NameCheck = require('../../namecheck');
var DataClassAttributeComponent = require('./dataclassattribute');
var DataClassHeaderComponent = require('./dataclassheader');
var DataClassFooterComponent = require('./dataclassfooter');
var ResourceAPI = require('./../../resourceApi');

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
                resource_id: this.props.resource_id,
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
            resource_id: this.props.resource_id,
            attributes: this.state.items,
            _id: this.props.id
        });
    },
    handleType: function(new_is_event, new_is_resource, new_resource_id) {
        var is_event = new_is_event;
        var is_resource = new_is_resource;
        var resource_id = new_resource_id;

        var attributeItems = this.state.items;

        if (new_is_resource != this.props.is_resource || new_resource_id != this.props.resource_id) {
            attributeItems = this.getResourceTypeAttributes(new_is_resource, new_resource_id);
        }

        this.props.handleUpdate({
            name: this.props.name,
            is_event: is_event,
            is_resource: is_resource,
            resource_id: resource_id,
            attributes: attributeItems,
            _id: this.props.id
        });
    },
    getResourceTypeAttributes: function(isResource, resourceId) {
        if (!isResource) {
            return [];
        }
        const newItems = [];
        const selectedResourceType = this.state.availableResourceTypes.find((resourceType) => {
            return (resourceType.id === resourceId);
        });
        for (attribute of selectedResourceType.attributes.attributes) {
            const capitalizedType = attribute.dataType.charAt(0).toUpperCase() + attribute.dataType.slice(1);
            newItems.push({name: attribute.name, datatype: capitalizedType});
        }
        return newItems;
    },
    handleClassNameChange: function(e) {
        this.props.handleUpdate({
            name: e.target.value,
            is_event: this.props.is_event,
            is_resource: this.props.is_resource,
            resource_id: this.props.resource_id,
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
                resource_id: this.props.resource_id,
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
                    readOnly={this.props.is_resource}
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
                    availableResourceTypes={this.state.availableResourceTypes}
                    resource_id={this.props.resource_id}
                    scenid={this.props.scenid}
                    changed={this.props.modelChanged}
                />
                <ul className="list-group">
                    {items}
                </ul>
                {!this.props.is_resource &&
                    <DataClassFooterComponent handleAdd={this.handleAttrAdd} />
                }
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
        ResourceAPI.getAvailableResourceTypes(function (data) {
            if (this.isMounted()) {
                this.setState({ 'availableResourceTypes': data });
            }
        }.bind(this));
    }
});

module.exports = DataClassComponent;
