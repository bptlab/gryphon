'use strict';

var assign = require('lodash/assign');

/**
 * The code for this provider is based on the code of the real provider (availabel in the lib/features/palette module of bpmn-js)
 * It is adapted in a way that the most components are left out. The only options left are the ones to attach another node to the olc.
 */
function PaletteProvider(palette, create, elementFactory, spaceTool, lassoTool) {

    this._create = create;
    this._elementFactory = elementFactory;
    this._spaceTool = spaceTool;
    this._lassoTool = lassoTool;

    palette.registerProvider(this);
}

PaletteProvider.$inject = [ 'palette', 'create', 'elementFactory', 'spaceTool', 'lassoTool' ];

PaletteProvider.prototype.getPaletteEntries = function(element) {

    var actions  = {},
        create = this._create,
        elementFactory = this._elementFactory,
        spaceTool = this._spaceTool,
        lassoTool = this._lassoTool;

    function createParticipant(event, collapsed) {
        create.start(event, elementFactory.createParticipantShape(collapsed));
    }

    function createAction(type, group, className, title, options) {

        function createListener(event) {
            var shape = elementFactory.createShape(assign({ type: type }, options));

            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }

            create.start(event, shape);
        }

        var shortType = type.replace(/^bpmn\:/, '');

        return {
            group: group,
            className: className,
            title: title || 'Create ' + shortType,
            action: {
                dragstart: createListener,
                click: createListener
            }
        };
    }

    assign(actions, {
        'lasso-tool': { //The lasso-tool
            group: 'tools',
            className: 'bpmn-icon-lasso-tool',
            title: 'Activate the lasso tool',
            action: {
                click: function(event) {
                    lassoTool.activateSelection(event);
                }
            }
        },
        'space-tool': { //The space-tool
            group: 'tools',
            className: 'bpmn-icon-space-tool',
            title: 'Activate the create/remove space tool',
            action: {
                click: function(event) {
                    spaceTool.activateSelection(event);
                }
            }
        },
        'tool-separator': { //The seperator-tool
            group: 'tools',
            separator: true
        },
        'create.intermediate-event': createAction( //The tool to create another event in the olc.
            'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none'
        )
    });

    return actions;
};

module.exports = {
    paletteProvider: [ 'type', PaletteProvider ]
};
