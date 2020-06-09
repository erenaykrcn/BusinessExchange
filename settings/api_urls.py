from django.urls import path, re_path

from .views import (
        DestDetailAPIView,
        DestListCreateAPIView,

    )





app_name = 'destination-api'

urlpatterns = [

    path('', DestListCreateAPIView.as_view(), name='list-create'),

    re_path(r'^(?P<slug>[\w-]+)/$', DestDetailAPIView.as_view(), name='detail'),



]