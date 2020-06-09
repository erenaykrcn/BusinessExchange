from django.contrib import admin
from .models import Setting

class SettingAdmin(admin.ModelAdmin):
    list_display = ("period", "commissionPercentage", "minimumCommission", "buysellMargin")



admin.site.register(Setting, SettingAdmin)
