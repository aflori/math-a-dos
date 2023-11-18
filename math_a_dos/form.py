from django import forms


class CreateGameForm(forms.Form):
    number_of_player = forms.IntegerField(max_value=5, min_value=1)
    number_of_case = forms.IntegerField(min_value=10, step_size=10)


class ChoosePlayerForm(forms.Form):
    CHOICES = []
    static_radio = forms.ChoiceField()

    def __init__(self, board, *args, **kwargs):
        super(ChoosePlayerForm, self).__init__(*args, **kwargs)

        self.fields["static_radio"] = forms.ChoiceField(
            widget=forms.RadioSelect,
            choices=[ (player.id, player.name) for player in board.players],
            label="Choisissez votre joueur"
        )
