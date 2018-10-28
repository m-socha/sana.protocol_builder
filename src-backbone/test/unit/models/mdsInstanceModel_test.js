require('setup/hooks');

describe('MDS Model', function() {
    let server;
    let mdsInstance;
    let showSpinnerStub;
    let hideSpinnerStub;
    let successCallback;
    let errorCallback;

    const API_URL = 'https://www.yourMdsUrl.com';
    const USERNAME = 'test_mds_username';
    const PASSWORD = 'test_mds_password';

    beforeEach(function() {
        server = sinon.fakeServer.create();

        showSpinnerStub = sinon.stub();
        hideSpinnerStub = sinon.stub();

        successCallback = sinon.stub();
        errorCallback = sinon.stub();

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

        mdsInstance = new MDSInstance();
    });

    afterEach(function() {
        server.restore();
    });

    describe('test attemptLogin', function() {
        const callAttemptLogin = function(mdsStatusCode) {
            server.respondWith([
                200,
                {"Content-Type": "application/json"},
                JSON.stringify({'mds_status_code': mdsStatusCode}),
            ]);

            mdsInstance.attemptLogin(
                API_URL,
                USERNAME,
                PASSWORD,
                successCallback,
                errorCallback,
            );

            assert.equal(
                server.requests[0].requestBody,
                JSON.stringify({
                    api_url: API_URL,
                    username: USERNAME,
                    password: PASSWORD,
                }),
            );

            assert(showSpinnerStub.calledOnce);
            server.respond();
            assert(hideSpinnerStub.calledOnce);
        };

        const mdsSuccessCodes = [200, 401, 404];
        mdsSuccessCodes.forEach(function(successCode) {
            it('success response', function() {
                callAttemptLogin(successCode);

                assert(successCallback.calledOnce);
                assert(successCallback.calledWith(successCode));
                assert(errorCallback.notCalled);
            });
        });

        it('failure response', function() {
            callAttemptLogin(400);

            assert(successCallback.notCalled);
            assert(errorCallback.calledOnce);
        });
    });
});
