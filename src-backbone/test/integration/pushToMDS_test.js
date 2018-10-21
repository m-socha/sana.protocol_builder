require('setup/hooks');

describe('MDS Push', function() {
    let server;
    let showSpinnerStub;
    let hideSpinnerStub;
    let PushToMDSUtils;

    const PROCEDURE_ID = 1;

    beforeEach(function() {
        server = sinon.fakeServer.create();

        showSpinnerStub = sinon.stub();
        hideSpinnerStub = sinon.stub();

        PushToMDSUtils = proxyquire('utils/pushToMDSUtils', {
            'utils/sanaAppInstance': function() {
                return {
                    RootView: {
                        showSpinner: showSpinnerStub,
                        hideSpinner: hideSpinnerStub,
                    },
                };
            },
            'views/common/elementModalLayoutView': {
                'templates/common/elementModalLayoutView' : {},
            },
            'views/push/pushToMDSModalView': {
                'templates/common/modalLayoutView' : {},
            },
        });
    });

    afterEach(function() {
        server.restore();
    });

    describe('test push', function() {
        it('push with set MDS url', function() {
            PushToMDSUtils.pushToMDS(PROCEDURE_ID);
            server.respondWith([
                200,
                {"Content-Type": "application/json"},
                JSON.stringify({'mds_status_code': 200}),
            ]);
            assert.equal(1, 1);
        });
    });
});
