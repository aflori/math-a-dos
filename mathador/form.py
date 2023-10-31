from django import forms


class CreateGameForm(forms.Form):
    number_of_player = forms.IntegerField(max_value=5, min_value=1)

