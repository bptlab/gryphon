var $ = jQuery = require('jquery');
window.$ = $;
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var Bootstrap = require('bootstrap');

var SideBarComponent = require('./react/sidebar');
var FragmentEditorComponent = require('./react/fragmenteditor');

var App = React.createClass({
    render: function() {
        return (
            <div className="app-container">
                <SideBarComponent />
                <MainComponent />
            </div>
        )
    }
});

var MainComponent = React.createClass({
    render: function() {
        return (
            <div className="main-content">
                <FragmentEditorComponent />
            </div>
        )
    }
});

$(function () {

    ReactDOM.render(
        <App />,
        document.getElementById('app-container')
    );

    var links = $('.sidebar-links > div');
    links.on('click', function () {
        links.removeClass('selected');
        $(this).addClass('selected');
    });
});