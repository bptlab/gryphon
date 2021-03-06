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
          value : nextProps.initialValue,
          initialValue : nextProps.initialValue
        });
      }
    },
    handleChange: function(event) {
      if (this.props.handleChange)
        this.props.handleChange(event);
    },
    handleOnBlur: function(event) {
      if (this.props.handleOnBlur)
        this.props.handleOnBlur(event);
    },
    handleDelete: function() {
      if (this.props.deletable && this.props.handleDelete)
        this.props.handleDelete();
    },
    handleOnKeyDown: function(e) {
        // submit on enter
        if (e.keyCode == 13 && this.state.isEditable) {
            this.props.handleSubmit();
            this.setState({isEditable: false});
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

            var label = "";
            var inputGridClassName = "col-sm-12";
            if (this.props.label) {
              inputGridClassName = "col-sm-10";
              var tooltip = "";
              if (this.props.tooltip) {
                tooltip =
                  <a
                    data-toggle="tooltip"
                    title={this.props.tooltip}
                  >
                    <i className="fa fa-info-circle"></i>
                  </a>
              }
              label =
                <label
                  htmlFor={"inputwithtoggle" + this.props.key}
                  className="col-sm-2 control-label"
                >
                  {this.props.label}
                  &nbsp;
                  {tooltip}
                </label>
            }

            return (
                <div className="form-group">
                  {label}
                    <div className={inputGridClassName}>
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
