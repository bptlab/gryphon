var React = require('react');

var TopBarInput = React.createClass({
    getInitialState: function() {
      return {
        value: this.props.initialValue
      };
    },
    componentWillReceiveProps: function(nextProps) {
      console.log(nextProps);
      this.setState({value: nextProps.initialValue});
    },
    handleChange: function(event) {
      console.log(event);
      console.log(event.keyCode);
      this.setState({value: event.target.value});
    },
    render: function() {
        var cssClass = "";
        var disabledAttribute = !this.props.editable;
        if(!this.props.editable)
        {
          cssClass = "inputLabel";
        }
        return (
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            className={cssClass}
            disabled={disabledAttribute}
            onKeyDown={this.props.handleEnter}
          />
        )
    }
});

module.exports = TopBarInput;
