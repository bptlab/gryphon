var React = require('react');

var TypeSelect = React.createClass({
    getInitialState: function () {
        return {
            isEvent: this.props.is_event,
            isResource: this.props.is_resource
        };
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
        );
    }
});

module.exports = TypeSelect;