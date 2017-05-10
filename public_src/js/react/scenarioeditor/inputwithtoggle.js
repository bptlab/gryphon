var React = require('react');

var InputWithToggleComponent = React.createClass({
    getInitialState: function() {
        return {
            'value': '',
            'initialValue': '',
            'isEditable': false
        }
    },
    componentDidMount: function() {
        this.setState({
          value : this.props.initialValue,
          initialValue : this.props.initialValue
        });
    },
    componentWillReceiveProps: function(nextProps) {
      if (this.state.initialValue != nextProps.initialValue) {
        this.setState({
          value : this.nextProps.initialValue,
          initialValue : this.nextProps.initialValue
        });
      }
    },
    handleChange: function(event) {
      if (this.props.onChange)
        this.props.onChange(event.target.value);
    },
    handleOnBlur: function(event) {
      if (this.props.handleOnBlur)
        this.props.handleOnBlur(event.target.value);
    },
    handleDelete: function() {
      if (this.props.deletable && this.props.handleDelete)
        this.props.handleDelete();
    },
    handleOnKeyDown: function(e) {
        // submit on enter
        if (e.keyCode == 13) {
            this.props.handleSubmit();
        }
        // cancel on esc
        if (e.keyCode == 27) {
          this.setState({
            value : this.state.initialValue,
            isEditable : false
          });
        }
    },
    handleEditButtonClicked: function() {
        if (this.state.isEditable) {
          this.props.handleSubmit();
        }
        this.setState({isEditable: !this.state.isEditable});
    },
    render: function() {
            var disabled = this.state.isEditable == false;
            var editButtonIcon = disabled ? "fa fa-pencil" : "fa fa-check";

            var editButton =
              <button
                  className="btn btn-success"
                  type="button"
                  onClick={this.handleEditButtonClicked}
              >
                <i className={editButtonIcon} />
              </button>

            var deleteButton =
              <button
                className="btn btn-danger"
                type="button"
                onClick={this.handleDelete}
              >
                <i className="fa fa-times" />
              </button>;

            var buttons = "";
            if (this.props.deletable) {
              buttons =
                <span className="input-group-btn">
                  {editButton}
                  {deleteButton}
                </span>
            } else {
              buttons =
                <span className="input-group-btn">
                  {editButton}
                </span>
            }

            return (
                <div className="form-group">
                    <label htmlFor={"inputwithtoggle" + this.props.key} className="col-sm-2 control-label">{this.props.label}</label>
                    <div className="col-sm-10">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id={"inputwithtoggle" + this.props.key}
                                placeholder={this.props.placeholder}
                                value = {this.state.value}
                                onChange = {this.handleChange}
                                onBlur = {this.handleOnBlur}
                                onKeyDown = {this.handleOnKeyDown}
                                disabled = {disabled}
                            />
                            {buttons}
                        </div>
                    </div>
                </div>
            );
    }
});
module.exports = InputWithToggleComponent;
