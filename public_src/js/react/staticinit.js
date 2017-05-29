var React = require('react');

var StaticInit = React.createClass({
    render: function() {

      // Initialize tooltips
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

      // Dummy DOM object
      return (
        <div>
        </div>
      );
    }
});

module.exports = StaticInit;
