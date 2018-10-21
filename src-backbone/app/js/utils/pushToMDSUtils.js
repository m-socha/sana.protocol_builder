const App = require('utils/sanaAppInstance');
const ElementModalLayoutView = require('views/common/elementModalLayoutView');
const PushToMDSModalView = require('views/push/pushToMDSModalView');
const MDSApi = require('utils/mdsAPI');
const MDSInstance = require('models/mdsInstance');

module.exports = {

    pushToMDS: function() {
        const self = this;

        // Fetch mds instance:
        const mdsInstance = new MDSInstance({});
        mdsInstance.fetch({
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function() {
                console.info('Fetched MDS info');
                if (!mdsInstance.get('api_url')) {
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
        const pushModal = new ElementModalLayoutView({
            title: i18n.t('Push to Mobile'),
            bodyView: new PushToMDSModalView(options),
        });
        App().RootView.showModal(pushModal);
    },

    attemptLoginToMds: function(mdsInstance, url, username, password) {
        const self = this;

        MDSApi.login(
            url,
            username,
            password,
            function (apiKey) {
                console.info('Successfully logged into MDS');
                mdsInstance.set({
                    api_url: url,
                    api_key: apiKey,
                });
                self.updateMdsInstance(mdsInstance);
                self.pushProcedure(mdsInstance);
            },
            function (error) {
                // MDS URL not found
                switch (error.response) {
                    case 401:
                        console.error('Failed to login to MDS because auth failed');
                        self.showInputModal(
                            mdsInstance,
                            {
                                headingText: i18n.t('Authentication failed for the provided username and password.'),
                                url,
                                username,
                                password,
                            }
                        );
                        break;
                    case 404:
                        console.error('Failed to login to MDS because endpoint not found');
                        self.showInputModal(
                            mdsInstance,
                            {
                                headingText: i18n.t('The provided MDS URL was not found.'),
                                url,
                                username,
                                password,
                            }
                        );
                        break;
                    default:
                        App().RootView.modal.hideModal();
                        console.error('Could not login to MDS');
                        App().RootView.showNotification('Could not login to MDS');
                        break;
                }
            }
        );
    },

    updateMdsInstance: function(mdsInstance) {
        mdsInstance.updateInstance(
            mdsInstance,
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
