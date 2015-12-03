var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');

var SideBarComponent = require('./react/sidebar');

var App = React.createClass({
    render: function() {
        return (
            <div className="main">
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
                Bodybodybody
            </div>
        )
    }
});

$(function () {

    ReactDOM.render(
        <App />,
        document.body
    );

    var links = $('.sidebar-links > div');
    links.on('click', function () {
        links.removeClass('selected');
        $(this).addClass('selected');
    });
});