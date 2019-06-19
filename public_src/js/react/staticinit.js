var React = require('react');

var StaticInit = React.createClass({
    render: function() {

      // Initialize tooltips
      $("body").tooltip({
          selector: '[data-toggle="tooltip"]'
      });

      // Dummy DOM object
      return (
        <div>
        </div>
      );
    }
});

module.exports = StaticInit;
