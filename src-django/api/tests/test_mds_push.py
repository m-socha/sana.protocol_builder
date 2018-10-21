from django.test import TestCase, Client
from rest_framework.authtoken.models import Token
from rest_framework import status
from utils.helpers import add_token_to_header
from nose.tools import assert_equals
from utils import factories
from api.startup import grant_permissions
from api.models import MDSInstance
from mock import patch
import json
import requests

class PushToMDSTest(TestCase):

    class MockResponse:
        def __init__(self, status_code, json_data):
            self.status_code = status_code
            self.json_data = json_data

    def setUp(self):
        self.client = Client()
        self.attempt_login_url = '/api/mdsInstance/attempt_login'
        self.push_to_mds_url = '/api/mdsInstance/push_to_mds'
        self.user = factories.UserFactory()
        self.token = Token.objects.get(user=self.user)
        grant_permissions()

    def test_attempt_login_with_incomplete_data(self):
        empty_data = {}
        response = self.client.post(
            path=self.attempt_login_url,
            data=json.dumps(empty_data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

        data_with_no_user = {'api_url': 'https://www.yourMdsUrl.com/'}
        response = self.client.post(
            path=self.attempt_login_url,
            data=json.dumps(data_with_no_user),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

        data_with_no_url = {'username': 'test_user', 'password': 'pass123'}
        response = self.client.post(
            path=self.attempt_login_url,
            data=json.dumps(data_with_no_url),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.requests.post')
    def test_attempt_login_with_mds_success_response(self, mock_post):
        mock_post.return_value = self.MockResponse(
            status.HTTP_200_OK,
            {'api_key': 'test_mds_api_key'},
        )

        data = {
            'api_url': 'https://www.yourMdsUrl.com/',
            'username': 'test_user',
            'password': 'pass123',
        }
        response = self.client.post(
            path=self.attempt_login_url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        mock_post.assert_called_with(
            'https://www.yourMdsUrl.com/login/',
            data={
                'username': 'test_user',
                'password': 'pass123',
            },
        )
        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_equals(response.data, {
            'mds_status_code': status.HTTP_200_OK,
            'mds_instance': {
                'api_url': 'https://www.yourMdsUrl.com/',
                'api_key': 'test_mds_api_key',
            },
        })

        # Confirm MDS instance created
        mds_instance = MDSInstance.objects.get(user=self.user)
        assert_equals(mds_instance.api_url, 'https://www.yourMdsUrl.com/')
        assert_equals(mds_instance.api_key, 'test_mds_api_key')


    def test_attempt_push_to_mds_with_incomplete_data(self):
        empty_data = {}
        response = self.client.post(
            path=self.push_to_mds_url,
            data=json.dumps(empty_data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)
