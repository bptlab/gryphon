var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');

var SideBarFragments = React.createClass({
    render: function() {
        return (
            <div className="link-blue selected">
                <a href="#">
                    <i className="fa fa-picture-o"></i>Scenarios
                </a>
                <ul className="sub-links">
                    <li><a href="#">Test</a></li>
                </ul>
            </div>
        );
    }
});

var SideBarComponent = React.createClass({
    render: function() {
        return (
            <aside className="sidebar-left-collapse">
                <a href="#" className="company-logo">Logo</a>
                <div className="sidebar-links">
                    <SideBarFragments />
                    <SideBarFragments />
                    <SideBarFragments />
                    <SideBarFragments />
                </div>
            </aside>
        )
    }
});

$(function () {

    ReactDOM.render(
        <SideBarComponent />,
        document.getElementById('content')
    );

    var links = $('.sidebar-links > div');
    links.on('click', function () {
        links.removeClass('selected');
        $(this).addClass('selected');
    });
});