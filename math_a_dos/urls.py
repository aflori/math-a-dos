from django.urls import path

from math_a_dos import views

app_name = "math"

urlpatterns = [
    path('', views.index, name="index"),
    path('parametres/', views.create_game, name="createG"),
    path('jouer/<int:player_id>', views.play, name="gameLaunched"),
    path('choix_joueur/', views.start_game, name="play_as"),
    path('partie.js/<int:player_id>', views.get_game_js, name="game_js"),
    path('start_turn/<int:player_id>', views.start_turn, name="start_turn"),
    path('throw_enigm_dices/<int:player_id>', views.throw_enigm_dice, name="throw_enigm_dices"),
    path('confirm_full_operation/<int:player_id>', views.confirm_operation, name="confirm_full_operation"),
]
