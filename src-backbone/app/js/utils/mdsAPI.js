const App = require('utils/sanaAppInstance');


module.exports = {

    login: function(apiUrl, username, password, onSuccess, onFailure) {
        const self = this;
        const formData = {
          username,
          password,
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(formData),
            url: apiUrl + '/login',
            crossDomain: true,
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                console.info(JSON.stringify(response));
                // TODO: Intergate with MDS API to actually retrieve session key
                const apiKey = 'test_api_key';
                onSuccess(apiKey);
            },
            error: onFailure
        });
    },

    pushProcedure: function(apiUrl, apiKey, procedure, onSuccess, onFailure) {
        const formData = {
            procedure_id: 'id',
            procedure_xml: '<test></test>',
            procedure_version: 1
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(formData),
            url: apiUrl + '/procedure/push',
            crossDomain: true,
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                // TODO: Figure out if push was successful
                const apiKey = 'test_api_key';
                onSuccess(apiKey);
            },
            error: onFailure
        });
    },
};
