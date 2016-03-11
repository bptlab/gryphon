var Modeler = require('bpmn-js/lib/Modeler');
var inherits = require('inherits');

function OLCModeler(options) {
    Modeler.call(this, options);
}

inherits(OLCModeler, Modeler);

console.log(OLCModeler.prototype._modules);

// Remove the old palette and the old context menu from module list
/* var filtered_modules = OLCModeler.prototype._modules.filter(function(module){
    if (module['__init__'] != undefined) {
        return (['contextPadProvider','paletteProvider'].indexOf(module['__init__'][0]));
    }
    return false;
}); */

console.log('Filetered modules');
//console.log(filtered_modules);

OLCModeler.prototype._modules = [].concat(
    OLCModeler.prototype._modules,
    [
        require('./context'),
        require('./palette')
    ]
);

module.exports = OLCModeler;