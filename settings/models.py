from django.db import models

class Setting(models.Model):
	period = models.TextField(null=True)
	commissionPercentage = models.TextField(null=True)
	minimumCommission = models.TextField(null=True)
	buysellMargin = models.TextField(null=True)
	surcharge = models.TextField(null=True)
