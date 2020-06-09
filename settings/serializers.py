from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone

from rest_framework import serializers
from .models import Setting


User = get_user_model()



class UserPublicSerializer(serializers.ModelSerializer):

    username = serializers.CharField(required=False, allow_blank=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            ]

    



class DestinationSerializer(serializers.ModelSerializer):

    user = UserPublicSerializer(read_only=True)


    class Meta:

        model = Setting

        fields = [
            "user",
            "period",
            "commissionPercentage",
            "minimumCommission",
            "buysellMargin",
            "surcharge"            

        ]

    def get_owner(self, obj):

        request = self.context['request']

        if request.user.is_authenticated:

            if obj.user == request.user:

                return True

        return False

