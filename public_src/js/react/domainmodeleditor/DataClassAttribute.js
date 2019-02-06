var React = require('react');

var DataClassAttributeComponent = React.createClass({
    getDefaultProps: function() {
        return {
            onClick: function() {}
        }
    },
    handleNameChange: function(e) {
        this.props.handleNameChange(e);
    },
    handleDataTypeChange: function(e) {
        this.props.handleDataTypeChange(e);
    },
    render: function() {
        var availableFixedTypes = ["String","Integer","Double","Boolean","Enum","Date","File"].map(function(dt){
            var key="fixedType_" + dt;
            return (
                <option value={dt} key={key}>{dt}</option>
            )
        });
        var availableTypes = this.props.availableDataTypes.map(function(dt){
            var key = "classType_" + dt;
            return (
                <option value={dt} key={key}>{dt}</option>
            )
        });
        return (
            <li className="list-group-item clearfix">
                <div className="row">
                    <div className="col-sm-5">
                        <input
                            type="text"
                            className="form-control"
                            value={this.props.name}
                            onChange={this.handleNameChange}
                            onKeyDown={this.props.handleEnterSubmit}
                        />
                    </div>
                    <div className="col-sm-5">
                        <select className="selectpicker" onChange={this.handleDataTypeChange} value={this.props.datatype} data-live-search="true" id={this.props.name + "-dtselect"}>
                            <optgroup label="Scalar Type">
                                {availableFixedTypes}
                            </optgroup>
                            <optgroup label="Class-Reference">
                                {availableTypes}
                            </optgroup>
                        </select>
                    </div>
                    <div className="col-sm-1">
                        <button type="button" className="btn btn-danger" onClick={this.props.onDelete}><i className="fa fa-times"></i></button>
                    </div>
                </div>
            </li>
        );
    },
    componentDidMount: function() {
        $('#' + this.props.name + '-dtselect').selectpicker();
    },
    componentDidUpdate: function() {
        $('#' + this.props.name + '-dtselect').selectpicker();
    }
});

module.exports = DataClassAttributeComponent;