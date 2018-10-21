const App = require('utils/sanaAppInstance');
const ElementModalLayoutView = require('views/common/elementModalLayoutView');
const PushToMDSModalView = require('views/push/pushToMDSModalView');

module.exports = {

    pushToMDS: function() {
        // fetch mds instance:
        var mdsInstance = {};
        if (!mdsInstance.url) {
            // try to get key from MDS
            this.showInputModal({
                headingText: i18n.t('This account has no MDS instance. You can add one below.'),
            });
        } else {
           this.pushProcedure();
        }
    },

  showInputModal: function(options) {
      options.onSubmit = this.attemptLoginToMDS;
      var pushModal = new ElementModalLayoutView({
          title: i18n.t('Push to Mobile'),
          bodyView: new PushToMDSModalView(options),
      });
      App().RootView.showModal(pushModal);
  },

  attemptLoginToMDS: function(url, username, password) {
      console.log('submit input modal');

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
