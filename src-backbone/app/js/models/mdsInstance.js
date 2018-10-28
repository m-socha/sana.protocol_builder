const App = require('utils/sanaAppInstance');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/mdsInstance',

    updateInstance: function(formData, successCallback, errorCallback) {
        let self = this;

        $.ajax({
            type: 'PATCH',
            data: JSON.stringify(formData),
            url: '/api/mdsInstance/update_instance',
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                self.set(response.user);
                successCallback();
            },
            error: errorCallback,
        });
    },
});
