import random

import pytest

from mathador.DTO.board import Board
from mathador.DTO.dice import Dice
from mathador.DTO.repository.game_repository_in_memory import GameRepositoryInMemory
from .throw_movement_dice import MoveDiceThrowCommand


class MockRandom(random.Random):
    def __init__(self, default_value_randint, *args, **kwargs):
        super(MockRandom, self).__init__(*args, **kwargs)
        self.result_randint = default_value_randint

    def randint(self, a, b):
        return self.result_randint


repository_test = GameRepositoryInMemory()


@pytest.mark.parametrize("number_thrown", [5, 3, 8])
def test_throw_movement_dice(number_thrown):
    id_game = 0
    repository_test.save_game(
        Board(cases=[], dices=[], moving_dice=Dice(8), result_dice=Dice(0), players=[], id=id_game))
    command = MoveDiceThrowCommand(repository_test)
    command.random = MockRandom(number_thrown)
    command.execute(id_game)  # default id for repo in memory

    game: Board = repository_test.get_game_by_id(id_game)
    dice = game.moving_dice
    assert dice.last_number_throw == number_thrown
