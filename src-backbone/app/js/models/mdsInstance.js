const App = require('utils/sanaAppInstance');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/mdsInstance',

    parse: function(response, options) {
        // Returns collection of length 1, since we are supporting a single MDS
        // instance per user right now.
        return response[0];
    },

    updateInstance: function(formData, successCallback, errorCallback) {
        let self = this;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(formData),
            url: '/api/mdsInstance/update_instance',
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                self.set(response.mds_instance);
                successCallback();
            },
            error: errorCallback,
        });
    },
});
