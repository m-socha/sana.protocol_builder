const ModalLayoutView = require('views/common/modalLayoutView');


module.exports = Marionette.LayoutView.extend({
    template: require('templates/push/pushToMDSModalView'),

    events: {
        'click a#submit-btn': '_onSubmit',
    },

    ui: {
        urlField: 'input#mds-endpoint',
        usernameField: 'input#mds-username',
        passwordField: 'input#mds-password',
    },

    templateHelpers: function() {
        return {
            headingText: this.headingText,
            url: this.url,
            username: this.username,
            password: this.password,
        };
    },

    initialize: function(options) {
        this.headingText = options.headingText;
        this.url = options.url;
        this.username = options.username;
        this.password = options.password;

        this.onSubmit = options.onSubmit;
    },

    _onSubmit: function() {
        const url = this.ui.urlField.val();
        const username = this.ui.usernameField.val();
        const password = this.ui.passwordField.val();

        this.onSubmit(url, username, password);
    },
});
