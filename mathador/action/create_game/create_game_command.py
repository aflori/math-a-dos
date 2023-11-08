import random

from mathador.DTO.game_element import Board, Player, Case, Dice
from mathador.models import operations


class CreateGame:
    def __init__(self, repository):
        self.repository = repository

    def execute(self, number_of_case: int, number_of_player: int):
        game = Board(dices=[Dice(20), Dice(12), Dice(8), Dice(6), Dice(4)], players=[], cases=[], result_dice=Dice(100),
                     moving_dice=Dice(6))
        game.players = [Player("joueur " + str(i + 1), 0) for i in range(number_of_player)]
        game.cases = [_create_random_case(i + 1) for i in range(number_of_case)]
        self.repository.save_game(game)


def _create_random_case(number_case: int):
    operation = [operations["plus"], operations["subtraction"], operations["multiplication"], operations["division"]]
    operation_mandatory = random.sample(operation, 2)
    is_second_operation_none = random.randint(1, 5) == 1  # 1 out of 5 chance
    if not is_second_operation_none:
        operation_mandatory[1] = operations["none"]
    return Case(number_case, operation_mandatory[0], operation_mandatory[1])
