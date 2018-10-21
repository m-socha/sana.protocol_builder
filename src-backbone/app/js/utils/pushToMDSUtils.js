const App = require('utils/sanaAppInstance');
const ElementModalLayoutView = require('views/common/elementModalLayoutView');
const PushToMDSModalView = require('views/push/pushToMDSModalView');
const MDSInstance = require('models/mdsInstance');

module.exports = {

    pushToMDS: function() {
        var self = this;

        // fetch mds instance:
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
                if (!mdsInstance.url || true) {
                    // try to get key from MDS
                    self.showInputModal(
                        mdsInstance,
                        {
                            headingText: i18n.t('This account has no MDS instance. You can add one below.'),
                        }
                    );
                } else {
                   this.pushProcedure(mdsInstance);
                }
            },
            error: function() {
                console.error('Failed to fetch MDS info');
                App().RootView.showNotification('Failed to fetch MDS info');
            },
          }
        );
    },

  showInputModal: function(mdsInstance, options) {
      options.onSubmit = this.attemptLoginToMDS.bind(this, mdsInstance);
      var pushModal = new ElementModalLayoutView({
          title: i18n.t('Push to Mobile'),
          bodyView: new PushToMDSModalView(options),
      });
      App().RootView.showModal(pushModal);
  },

  attemptLoginToMDS: function(mdsInstance, url, username, password) {
      console.log('submit input modal');

      mdsInstance.updateInstance();

      this.showInputModal({
          headingText: i18n.t('The MDS URL was not found.'),
          url,
          username,
          password,
      });

      this.showInputModal({
          headingText: i18n.t('Authentication failed for the provided username and password.'),
          url,
          username,
          password,
      });
  },

  pushProcedure: function(mdsInstance) {
    console.log('push procedure');

    this.showInputModal({
        headingText: i18n.t('Your MDS session has expired. Please login again'),
        url: mdsInstance.url,
    });
  },
};
