var React = require('react');
var ResourceAPI = require('./../../resourceApi');

var TypeSelect = React.createClass({
    getInitialState: function () {
        return {
            isEvent: this.props.is_event,
            isResource: this.props.is_resource
        };
    },
    componentDidMount: function () {
        ResourceAPI.getAvailableResourceTypes(function (data) {
            if (this.isMounted()) {
                this.setState({ 'availableResourceTypes': data["resources"] });
            }
        }.bind(this));
    },
    handleChange: function (event) {
        if (event.target.value === "isEvent") {
            var isEvent = event.target.checked == true;
            this.setState({ isEvent: isEvent });
            this.props.handleType(isEvent, this.state.isResource);
        }
        else {
            var isResource = event.target.checked == true;
            this.setState({ isResource: isResource });
            this.props.handleType(this.state.isEvent, isResource);
        }
        console.log(this.state);

    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            isEvent: nextProps.is_event,
            isResource: nextProps.is_resource
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
                            value="isEvent"
                            checked={this.state.isEvent}
                            onChange={this.handleChange}
                        />
                        Use as event type
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="isResource"
                            checked={this.state.isResource}
                            onChange={this.handleChange}
                        />
                        Use as a resource
                    </label>
                </div>
                {this.state.isResource && this.state.availableResourceTypes && 
                    <div>
                        <select>
                        {this.state.availableResourceTypes.map(type => {
                            return(<option key={type["id"]} value={type["id"]}>{type["name"]}</option>);
                        })}
                        </select>
                    </div>
                }
            </div>

        );
    }
});

module.exports = TypeSelect;