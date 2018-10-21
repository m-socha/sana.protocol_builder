const App = require('utils/sanaAppInstance');
const ElementModalLayoutView = require('views/common/elementModalLayoutView');
const PushToMDSModalView = require('views/push/pushToMDSModalView');
const MDSInstance = require('models/mdsInstance');

module.exports = {

    pushToMDS: function() {
        var self = this;

        // Fetch mds instance:
        var mdsInstance = new MDSInstance({});
        mdsInstance.fetch({
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function() {
                console.info('Fetched MDS info');
                console.log(JSON.stringify(mdsInstance));
                if (!mdsInstance.api_url) {
                    self.showInputModal(
                        mdsInstance,
                        {
                            headingText: i18n.t('This account has no MDS instance. You can add one below.'),
                        }
                    );
                } else {
                   self.pushProcedure(mdsInstance);
                }
            },
            error: function() {
                console.error('Failed to fetch MDS info');
                App().RootView.showNotification('Failed to fetch MDS info');
            },
        });
    },

    showInputModal: function(mdsInstance, options) {
        options.onSubmit = this.attemptLoginToMds.bind(this, mdsInstance);
        var pushModal = new ElementModalLayoutView({
            title: i18n.t('Push to Mobile'),
            bodyView: new PushToMDSModalView(options),
        });
        App().RootView.showModal(pushModal);
    },

    attemptLoginToMds: function(mdsInstance, url, username, password) {
        App().RootView.modal.hideModal();
        // Try to login to MDS
        mdsInstance.api_url = url;
        this.updateMdsInstance(mdsInstance);
    },

    onMdsLoginSuccess: function(mdsInstance) {
        console.log('Successfully logged into MDS');
        this.updateMdsInstance(mdsInstance);
        this.pushProcedure(mdsInstance);
    },

    onMdsLoginFailure: function(error) {
        // MDS URL not found
        if (true) {
            this.showInputModal({
                headingText: i18n.t('The MDS URL was not found.'),
                url,
                username,
                password,
            });
            // Authentication failed
        } else if (true) {
            this.showInputModal({
                headingText: i18n.t('Authentication failed for the provided username and password.'),
                url,
                username,
                password,
            });
        }
    },

    updateMdsInstance: function(mdsInstance) {
        mdsInstance.updateInstance(
            {
                api_url: mdsInstance.api_url,
                api_key: mdsInstance.api_key,
            },
            function() {
                console.info('Successfully updated MDS info');
            },
            function() {
                console.error('Failed to update MDS info');
                App().RootView.showNotification('Failed to update MDS info');
            }
        );
    },

    pushProcedure: function(mdsInstance) {
        console.log('push procedure');

      // this.showInputModal({
      //     headingText: i18n.t('Your MDS session has expired. Please login again'),
      //     url: mdsInstance.url,
      // });
    },
};
