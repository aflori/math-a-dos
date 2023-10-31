from django.urls import path

from mathador import views

app_name = "math"

urlpatterns = [
    path('', views.index, name="math_index")
]
