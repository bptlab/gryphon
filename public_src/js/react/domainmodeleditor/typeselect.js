var React = require('react');

var TypeSelect = React.createClass({
    getInitialState: function () {
        return {
            isEvent: this.props.is_event,
            isResource: this.props.is_resource,
            resourceId: this.props.resource_id,
        };
    },
    handleChange: function (event) {
        switch(event.target.name) {
            case "isEvent":
                this.setState({ isEvent: event.target.checked });
                this.props.handleType(event.target.checked, this.state.isResource, this.state.resourceId);
                break;
            case "isResource":
                this.setState({ isResource: event.target.checked });
                let currentResourceId = this.state.resourceId;
                if (currentResourceId == null) {
                    currentResourceId = String(this.props.availableResourceTypes[0]["id"]);
                    this.setState({ 'resourceId': currentResourceId });
                }
                this.props.handleType(this.state.isEvent, event.target.checked, currentResourceId);
                break;
            case "resourceId":
                this.setState({ resourceId: event.target.value });
                this.props.handleType(this.state.isEvent, this.state.isResource, event.target.value);
                break;
        }

    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            isEvent: nextProps.is_event,
            isResource: nextProps.is_resource,
            resourceId: nextProps.resource_id,
        });
    },
    render: function () {
        var value = this.state.value;
        return (
            <div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="isEvent"
                            checked={this.state.isEvent}
                            disabled={this.state.isResource}
                            onChange={this.handleChange}
                        />
                        Use as event type
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="isResource"
                            checked={this.state.isResource}
                            disabled={this.state.isEvent}
                            onChange={this.handleChange}
                        />
                        Use as a resource
                    </label>
                </div>
                {this.state.isResource && this.props.availableResourceTypes && 
                    <div>
                        <select name="resourceId" value={this.state.resourceId} onChange={this.handleChange}>
                        {this.props.availableResourceTypes.map(type => {
                            return(<option key={type["id"]} value={type["id"]}>{type["attributes"]["name"]}</option>);
                        })}
                        </select>
                    </div>
                }
            </div>

        );
    }
});

module.exports = TypeSelect;