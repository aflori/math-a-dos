from django.http import HttpResponse
from django.shortcuts import render

from mathador.models import Board
from mathador.form import CreateGameForm


# Create your views here.


def index(request):
    if Board.objects.count() == 0:
        context = {"createForm": True,
                   "form": CreateGameForm()}
        return render(request, "mathador/index.html", context)
    return HttpResponse("Ceci est ma page d'accueil!")
