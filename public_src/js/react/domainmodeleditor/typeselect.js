var React = require('react');

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

module.exports = TypeSelect;