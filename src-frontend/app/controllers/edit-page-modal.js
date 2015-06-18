import Ember from 'ember';
import SanaElement from '../models/element';

export default Ember.Controller.extend({
    types: function() {
        return SanaElement.TYPES;
    }.property(SanaElement.TYPES),

    actions: {
        addElement: function(selectedIndex) {
            var page = this.get('model');

            var newElement = this.store.createRecord('element', {
                page: page,
                displayIndex: targetIndex
            });

            newElement.save().then(function() {
                page.reload();
            });
        },

        deleteElement: function(element) {
            element.deleteRecord();
            element.save();
        },

        save: function() {
            this.get('model.elements').forEach(function(element) {
                element.save();
            });
        }
    }
});
