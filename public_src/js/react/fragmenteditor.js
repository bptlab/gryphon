var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./../editor');
var API = require('./../api');

var FragmentEditorComponent = React.createClass({
    getInitialState: function() {
        return {
            editor: null,
            fragment: null
        }
    },
    render: function() {
        return (<div className="canvas" id="fragment-canvas"></div>)
    },
    componentDidMount: function() {
        var editor = new Editor($('#fragment-canvas'));
        this.state.editor = editor;
        API.getFragment(this.props.params.id,function(data,resp) {
            this.state.fragment = data;
            editor.openDiagram(data.content, function(err){
                //TODO Handle Error!
            })
        });
        setInterval(this.saveDiagram,this.props.saveinterval);
    },
    saveDiagram: function() {
        if (this.state.editor !== null && this.state.fragment !== null) {
            //this.state.editor.exportFragment(this.state.fragment, function(err){
            //TODO Handle Error!
            //});
        }
    },
    componentWillUnmount: function() {
        this.saveDiagram();
    }
});

module.exports = FragmentEditorComponent;