var Scenario = require('./../models/scenario').model;
var _ = require('lodash');

/**
 * This module contains 2 functions that help to update references to dataclasses.
 * @module helpers.updaterefs
 */

/**
 * When the name of an attribute of an dataclass gets changed, it's necessary to update all references to it. This is
 * exactly what this method does. It updates all references to a given attribute in case the name has changed.
 * @class changeDClassAttrReferences
 * @param newclass The updated dataclass
 * @param oldclass The old version of the dataclass
 * @param scenario The scenario that should get updated
 */
var changeDClassAttrReferences = function(newclass, oldclass, scenario) {
    oldclass.attributes.forEach(function(old_attr) {
        newclass.attributes.forEach(function(new_attr){
            if (old_attr._id == new_attr._id
		&& old_attr.name != new_attr.name) { // found renamed attribute
		// update references to renamed attribute in case start triggers
		
		console.log(JSON.stringify(scenario.startconditions))
		scenario.startconditions = scenario.startconditions.map(function (startcondition) {
		    // go through all case start triggers
                    startcondition.dataclasses = startcondition.dataclasses.map(function (dataclass) {
			// go through all data classes of a case start trigger
                        if (dataclass.classname == newclass.name) {
			    // go through all attributes belonging to a mapping 
                            dataclass.mapping = dataclass.mapping.map(function(attribute){
                                if (attribute.attr == old_attr.name) {
                                    attribute.attr = new_attr.name;
                                }
				// return the attribute, possibly with updated name
                                return attribute;
                            })
			}
			// return the data class mapping, possibly with updated mapping
                        return dataclass;
                    })
		    // return the case start trigger, possibly updated
                    return startcondition;
                })
		console.log(JSON.stringify(scenario.startconditions))
            }
        })
    });
};

/**
 * In case the dataclasses were changed it's necessary to update all references to them. This is exactly what this
 * function does. This works asynchronous because of the datacase-calls that are needed to load all fragments.
 * @class changeDClassReferences
 * @param dm_id The ID of the domainmodel
 * @param old_classes The old versions of the dataclasses
 * @param new_classes The new versions of the dataclasses
 * @param done {Function} The function that should be called when the updating is done.
 */
var changeDClassReferences = function(dm_id, old_classes, new_classes, done) {
    Scenario.findOne({domainmodel:dm_id}).populate('fragments').exec(function(err, result){
        if (err) {
            console.error(err);
            return;
        }
        if (result !== null) {
            old_classes.forEach(function(oldclass){
                new_classes.forEach(function(newclass){
                    if ((newclass._id == oldclass._id.toString()) && (newclass.name != oldclass.name)) {
                        result.terminationconditions = result.terminationconditions.map(function(termcon) {
                            return termcon.split(oldclass.name + '[').join(newclass.name + '[');
                        });
                        result.startconditions = result.startconditions.map(function(startcon){
                            startcon.dataclasses = startcon.dataclasses.map(function(mapping) {
                                if (mapping.classname == oldclass.name) {
                                    mapping.classname = newclass.name;
                                }
                                return mapping;
                            });
                            return startcon;
                        });
                        result.save();

                        result.fragments.forEach(function(fragment){
                            fragment.content = fragment.content
                                .split('griffin:dataclass="' + oldclass.name + '"')
                                .join('griffin:dataclass="' + newclass.name + '"');
                            fragment.content = fragment.content
                                .split('name="' + oldclass.name + '[')
                                .join('name="' + newclass.name + '[');
                            fragment.save();
                        })
                    }
                    if ((newclass._id == oldclass._id.toString()) && !_.isEqual(newclass.attributes, oldclass.attributes)) {
                        changeDClassAttrReferences(newclass, oldclass, result);
			result.save();
                    }
                });
            });
            done()
        }
    })
};

module.exports = {
    'changeDClassAttrReferences': changeDClassAttrReferences,
    'changeDClassReferences': changeDClassReferences
};
