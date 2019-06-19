var xml2json = require('xml2json');

/**
 * @module helpers.json
 */

/**
 * Given an xml-string that contains a valid BPMN-XML this function parses it and generates an JS-Object out of it.
 * @class parseToBPMNObject
 * @param xml {string}
 * @returns {{}}
 */
var parseToBPMNObject = function(xml) {

    if (xml == "" || xml == undefined) {
        return {}   ;
    }
    // What am I doing here? I remove all namespaces to make parsing easier. All but the griffin notations.
    xml = xml.replace(/<bpmn:/g, '<');
    xml = xml.replace(/<bpmndi:/g, '<');
    xml = xml.replace(/<di:/g, '<');
    xml = xml.replace(/<dc:/g, '<');


    xml = xml.replace(/<\/bpmn:/g, '</');
    xml = xml.replace(/<\/bpmndi:/g, '</');
    xml = xml.replace(/<\/di:/g, '</');
    xml = xml.replace(/<\/dc:/g, '</');

    xml = xml.replace(/ xsi:/g, ' ');

    var options = {
        object: true,
        reversible: false,
        coerce: false,
        sanitize: true,
        trim: true,
        arrayNotation: true
    };

    var parsed = xml2json.toJson(xml, options);

    return parsed.definitions[0].process[0];
};

/**
 * Given an valid BPMN-XML-String this function generates an OLC-object out of it.
 * @class parseToOLC
 * @param xml {string}
 * @returns {{}}
 */
var parseToOLC = function(xml) {
    var parsed = parseToBPMNObject(xml);
    delete parsed["id"];
    delete parsed["isExecutable"];
    if ("intermediateThrowEvent" in parsed) {
        parsed["state"] = parsed["intermediateThrowEvent"].map(function(task){
            task.id = task.id.replace("IntermediateThrowEvent","State");
            return task;
        });
        delete parsed["task"];
    }
    if ("sequenceFlow" in parsed) {
        parsed["sequenceFlow"] = parsed["sequenceFlow"].map(function(sequenceFlow){
            if ("sourceRef" in sequenceFlow) {
                sequenceFlow['sourceRef'] = sequenceFlow['sourceRef'].replace("IntermediateThrowEvent","State");
            }
            if ("targetRef" in sequenceFlow) {
                sequenceFlow['targetRef'] = sequenceFlow['targetRef'].replace("IntermediateThrowEvent","State");
            }
            return sequenceFlow;
        })
    }
    return parsed;
};

/**
 * This method creates adjacency lists for every dataclass according to it's olc.
 * If there is no valid olc model for the dataclass (including at least one state) it's invalid.
 * @method parseOLCPaths
 * @param domainmodel {Domainmodel}
 * @returns {{}}
 */
var parseOLCPaths = function(domainmodel) {
    var olcPaths = {};
    domainmodel.dataclasses.forEach(function(dclass){
        if (dclass.olc != undefined) {
            var olc = parseToOLC(dclass.olc);
            var adjlist = {};
            var namemap  = {};
            if ('state' in olc) {

                olc['state'].forEach(function(state){
                    if ('name' in state) {
                        namemap[state['id']] = state['name'];
                    } else {
                        namemap[state['id']] = state['id'];
                    }
                    adjlist[namemap[state['id']]] = [];
                });

                if ('sequenceFlow' in olc) {
                    olc['sequenceFlow'].forEach(function(seqFlow){
                        if ((seqFlow['sourceRef'] in namemap) && (seqFlow['targetRef'] in namemap)) {
                            adjlist[namemap[seqFlow['sourceRef']]].push(namemap[seqFlow['targetRef']]);
                        }
                    });
                    olcPaths[dclass.name] = adjlist;
                } else {
                    olcPaths[dclass.name] = null;
                }
            } else {
                olcPaths[dclass.name] = null;
            }
        } else {
            olcPaths[dclass.name] = null;
        }
    }.bind(this))
    return olcPaths;
};

module.exports = {parseToBPMNObject: parseToBPMNObject, parseToOLC: parseToOLC, parseOLCPaths: parseOLCPaths};
