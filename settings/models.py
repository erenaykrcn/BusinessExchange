from django.db import models

class Setting(models.Model):
	period = models.CharField(null=True, max_length=1000000000000, default="10")
	commissionPercentage = models.CharField(null=True, max_length=1000000000000, default="2")
	minimumCommission = models.CharField(null=True, max_length=1000000000000, default="2")
	buysellMargin = models.CharField(null=True, max_length=1000000000000, default="2")
	surcharge = models.CharField(null=True, max_length=1000000000000, default="2")
