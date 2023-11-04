from django import http
from django.shortcuts import render, redirect

from mathador.DTO.game_element import Board
from mathador.DTO.repository.game_repository_in_DB import GameRepositoryInDB
from mathador.form import *
from mathador.models import operations as ENUM_OPERATION

# Create your views here.
game_repo = GameRepositoryInDB()


def get_game_from_DB() -> Board:
    return game_repo.get_all_game()[0]  # contain at least 1 game


def get_player_by_id(id_player):
    return game_repo.get_player_by_id(id_player)


def index(request):
    if game_repo.is_not_empty():
        context = {
            "action_url": "math:createG",
            "form": CreateGameForm()}
    else:
        game = get_game_from_DB()
        context = {
            "action_url": "math:play_as",
            "form": ChoosePlayerForm(game)
        }
    return render(request, "mathador/index.html", context)


def create_game(request):
    if request.method == "POST":
        form = CreateGameForm(request.POST)
        if form.is_valid():
            if game_repo.is_not_empty():
                from mathador.action.create_game.create_game_command import CreateGame
                create_command = CreateGame(game_repo)
                create_command.execute(form.cleaned_data["number_of_case"], form.cleaned_data["number_of_player"])
            return redirect("math:index")
    raise http.Http404()


def start_game(request):
    game = get_game_from_DB()
    form = ChoosePlayerForm(game, request.POST)
    if form.is_valid():
        player_id = form.cleaned_data["static_radio"]
        return redirect("math:gameLaunched", player_id=player_id)
    raise http.Http404()


def play(request, player_id):
    game = get_game_from_DB()
    player = get_player_by_id(player_id)
    context = {
        "player_name": player.name,
        "case_at": player.on_the_case,
        "case_in_front": [game.cases[i] for i in range(game.moving_dice.number_of_face)],
        "neutral_operation": ENUM_OPERATION["none"],
        "id": player_id
    }
    return render(request, "mathador/game.html", context)


def get_game_js(request, player_id):
    context = {
        # "game": get_game_from_DB(),
        # "player": get_player_by_id(player_id).asDict()
        "player_id": player_id,
    }
    return render(request, "mathador/game.js", context, content_type="application/x-javascript")


def start_turn(request, player_id):
    from mathador.action.throw_dice.throw_movement_dice import MoveDiceThrowCommand
    return _run_command(MoveDiceThrowCommand)


def throw_enigm_dice(request, player_id):
    from  mathador.action.throw_dice.throw_enigm_dices import EnigmDiceThrowCommand
    return _run_command(EnigmDiceThrowCommand)


def _run_command(command_class):
    game = get_game_from_DB()
    command = command_class(game_repo)
    command.execute(game.id)
    return http.JsonResponse(get_game_from_DB().asDict())
