var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../olc/editor');
var MessageHandler = require('./../messagehandler');
var API = require('./../api');
var Config = require('./../config');
var Validator = require('./../bpmnext/validator');

var OLCEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            editor: null
        }
    },
    render: function() {
        return (
            <div className="fragmentEditor">
                <div className="lowerRightButtons" id="upperRightButtons">
                    <button type="button" className="btn btn-success">Save OLC</button>
                </div>
                <div className="canvas" id="fragment-canvas" />
            </div>
        )
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'));
        this.setState({editor: editor});
    }
});

module.exports = OLCEditorComponent;