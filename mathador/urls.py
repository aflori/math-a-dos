from django.urls import path

from mathador import views

urlpatterns = [
    path('', views.index, name="math_index")
]