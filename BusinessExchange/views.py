from django.http import HttpResponse
from django.shortcuts import render
from settings.models import Setting


def gView(request):
	return render(request,"index.html",context={}) 



def update(request):
	try:
		print(request.POST)

		period = request.POST["period"]


		cP = request.POST["commissionPercentage"]
		minC = request.POST["minimumCommission"]
		bsMargin = request.POST["buysellMargin"]
		surcharge = request.POST["surcharge"]
		print(period)

		objs = Setting.objects.all()

		if len(objs) != 0:
			obj = objs[0]
			obj.commissionPercentage = cP
			obj.period = period
			obj.minimumCommission = minC
			obj.buysellMargin = bsMargin
			obj.surcharge = surcharge
		else:
			obj = Settings.objects.create()
			obj.commissionPercentage = cP
			obj.period = period
			obj.minimumCommission = minC
			obj.buysellMargin = bsMargin
			obj.surcharge = surcharge

		obj.save()

		return HttpResponse("SUCCESS")
	except BaseException:
		return HttpResponse("ERROR")