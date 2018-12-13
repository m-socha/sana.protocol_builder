from django.test import TestCase, Client
from rest_framework import status
from utils.helpers import add_token_to_header
from nose.tools import assert_equals
from utils import factories

class PushToMDSTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.token = Token.objects.get(user=factories.UserFactory())

    def test_unauthenticated_user_cannot_push_to_mds(self):
        assert_equals(1, 1)
        response = self.client.post('/api/mdsInstance/push_to_mds')
        assert_equals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_attempt_login_with_incomplete_data(self):
        self.token = Token.objects.get(user=self.user)
        response = self.client.post(
            '/api/mdsInstance/push_to_mds',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)
