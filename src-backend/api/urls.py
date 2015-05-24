from django.conf.urls import url, include
from views import ProcedureViewSet
from rest_framework import routers

router = routers.SimpleRouter(trailing_slash=False)

router.register(r'procedures', ProcedureViewSet, base_name='procedure')

urlpatterns = [
    url(r'^', include(router.urls))
]