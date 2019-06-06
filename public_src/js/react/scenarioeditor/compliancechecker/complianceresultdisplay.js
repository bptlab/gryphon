var React = require('react');
var API = require('./../../../api');

var ComplianceResultDisplayComponent = React.createClass({
    render: function () {

        if (!this.props.complianceResult) {
            return (<span></span>);
        }

        if (this.props.complianceResult.error) {
            return (<span>Error: {this.props.complianceResult.error}</span>);
        }

        var custom_check = this.props.complianceResult.checks["custom_check"];
        if (!custom_check) {
            return (<span>compliance result does not contain 'custom_check' check</span>);
        }

        console.log(custom_check);

        var generalResult = <p>Formula is satisfied: {custom_check.result ? "true" : "false"}</p>;
        
        var witnessPath = "";
        if (custom_check.witness_path) {
            witnessPathListElements = custom_check.witness_path.map(function(witnessPathElement, index) {
                return <li key={index}>{witnessPathElement}</li>;
            });
            witnessPath = <span>Witness path:<br/><ol>{witnessPathListElements}</ol></span>;
        }

        var witnessState = "";
        if (custom_check.witness_state) {
            witnessStateListElements = Object.keys(custom_check.witness_state).map(function(key, index) {
                return <li key={index}>{key}: {custom_check.witness_state[key]}</li>
            })
            witnessState = <span>Witness state (marking):<br/><ul>{witnessStateListElements}</ul></span>;
        }

        return (
            <div>
                {generalResult}
                {witnessPath}
                {witnessState}
            </div>
        );
    }
});
module.exports = ComplianceResultDisplayComponent;
