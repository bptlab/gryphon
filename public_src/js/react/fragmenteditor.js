var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');

var FragmentEditorComponent = React.createClass({
    render: function() {
        return (<div className="canvas" id="fragment-canvas"></div>)
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'));
    }
});

module.exports = FragmentEditorComponent;