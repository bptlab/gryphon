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
            value={this.props.initialValue}
            onChange={this.handleChange}
            className={cssClass}
            disabled={disabledAttribute}
            onKeyDown={this.handleKeyDown}
          />
        )
    }
});

module.exports = TopBarInput;