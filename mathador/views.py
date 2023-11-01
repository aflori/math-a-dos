from django import http
from django.shortcuts import render, redirect

from mathador.DTO.repository.game_repository_in_DB import GameRepositoryInDB
from mathador.models import Board
from mathador.form import CreateGameForm


# Create your views here.


def index(request):
    if Board.objects.count() == 0:
        context = {"createForm": True,
                   "form": CreateGameForm()}
        return render(request, "mathador/index.html", context)
    else:
        game_repo = GameRepositoryInDB()
        return http.HttpResponse(game_repo.get_all_game())


def create_game(request):
    if request.method == "POST":
        form = CreateGameForm(request.POST)
        if form.is_valid():
            return redirect("math:math_index")
    raise http.Http404()
