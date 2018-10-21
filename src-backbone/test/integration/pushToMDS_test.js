require('setup/hooks');

describe('MDS Push', function() {
    let server;
    let showSpinnerStub;
    let hideSpinnerStub;
    let showNotificationStub;
    let hideModalStub;
    let PushToMDSUtils;

    const PROCEDURE_ID = 1;
    const MDS_API_URL = 'https://www.yourMdsUrl.com';
    const MDS_API_KEY = 'test_mds_api_key';

    beforeEach(function() {
        server = sinon.fakeServer.create();

        showSpinnerStub = sinon.stub();
        hideSpinnerStub = sinon.stub();
        showNotificationStub = sinon.stub();
        hideModalStub = sinon.stub();

        const MDSInstance = proxyquire('models/mdsInstance', {
            'utils/sanaAppInstance': function() {
                return {
                    RootView: {
                        showSpinner: showSpinnerStub,
                        hideSpinner: hideSpinnerStub,
                    },
                };
            },
        });
        PushToMDSUtils = proxyquire('utils/pushToMDSUtils', {
            'utils/sanaAppInstance': function() {
                return {
                    RootView: {
                        showSpinner: showSpinnerStub,
                        hideSpinner: hideSpinnerStub,
                        showNotification: showNotificationStub,
                        hideModal: hideModalStub,
                    },
                };
            },
            'views/common/elementModalLayoutView': {
                'templates/common/elementModalLayoutView' : {},
            },
            'views/push/pushToMDSModalView': {
                'templates/common/modalLayoutView' : {},
            },
            'models/mdsInstance': MDSInstance,
        });
    });

    afterEach(function() {
        server.restore();
    });

    describe('test push', function() {
        describe('push with MDS already set', function() {
            const push = function(mdsStatusCode) {
                PushToMDSUtils.pushToMDS(PROCEDURE_ID);

                assert(showSpinnerStub.calledOnce);
                server.respondWith([
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify([{
                        api_url: MDS_API_URL,
                        api_key: MDS_API_KEY,
                    }]),
                ]);
                server.respond();
                assert(hideSpinnerStub.calledOnce);

                assert(showSpinnerStub.calledTwice);
                assert.equal(
                    server.requests[1].requestBody,
                    JSON.stringify({
                        procedure_id: PROCEDURE_ID,
                    })
                );
                server.respondWith([
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify({mds_status_code: mdsStatusCode}),
                ]);
                server.respond();
                assert(hideSpinnerStub.calledTwice);
            }

            it('test 200 mds push response', function() {
                push(200);

                assert(showNotificationStub.calledOnce);
                assert(showNotificationStub.calledWith('Successfully pushed procedure.'));
                assert(hideModalStub.calledOnce);
            });

            it('test 401 mds push response', function() {
                push(401);
            });

            it('test 404 mds push response', function() {
                push(404);
            });
        });
    });
});
