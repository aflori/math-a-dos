from django import forms


class CreateGameForm(forms.Form):
    number_of_player = forms.IntegerField(max_value=5, min_value=1)
    number_of_case = forms.IntegerField(min_value=10, step_size=10)
