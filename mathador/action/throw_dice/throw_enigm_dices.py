import random

from mathador.DTO.game_element import Board


class EnigmDiceThrowCommand:

    def __init__(self, game_repository):
        self.repository = game_repository
        self.random = random.Random()

    def execute(self, game_id):
        game: Board = self.repository.get_game_by_id(game_id)

        result_dice = game.result_dice
        result_dice.last_number_throw = self._throw_dice(result_dice) - 1  # want to allow 0 as a result

        for dice in game.dices:
            dice.last_number_throw = self._throw_dice(dice)
        self.repository.save_game(game)

    def _throw_dice(self, dice):
        min_value = 1
        max_value = dice.number_of_face
        number_case_moved = self.random.randint(min_value, max_value)
        return number_case_moved
