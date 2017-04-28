var React = require('react');

var TopBarInput = React.createClass({
    handleChange: function(event) {
      this.props.onChange(event.target.value);
    },
    handleKeyDown: function(event) {
      // submit on enter
      if(event.keyCode == 13) {
        this.props.handleEnter(event);
      }
      // cancel on esc
      if(event.keyCode == 27) {
        this.props.handleCancel();
      }
    },
    componentDidUpdate: function() {
      if(this.props.editable)
      {
        this.inputRename.focus();
      }
    },
    render: function() {
        var cssClass = "";
        var disabledAttribute = !this.props.editable;
        if(this.props.editable) {
          return (
            <input
              ref={(input) => { this.inputRename = input; }}
              type="text"
              value={this.props.initialValue}
              onChange={this.handleChange}
              className="topbarinput"
              disabled={disabledAttribute}
              onKeyDown={this.handleKeyDown}
            />
          )
        } else {
          return (
            <span>{this.props.initialValue}</span>
          )
        }

    }
});

module.exports = TopBarInput;
