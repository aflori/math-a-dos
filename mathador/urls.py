from django.urls import path

from mathador import views

app_name = "math"

urlpatterns = [
    path('', views.index, name="index"),
    path('parametres/', views.create_game, name="createG"),
    path('jouer/<int:player_id>', views.play, name="gameLaunched"),
    path('choix_joueur/', views.start_game, name="play_as"),
]
