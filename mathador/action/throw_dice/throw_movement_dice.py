import random

from mathador.DTO.board import Board


class MoveDiceThrowCommand:

    def __init__(self, game_repository):
        self.repository = game_repository
        self.random = random.Random

    def execute(self, game_id):
        game: Board = self.repository.get_game_by_id(game_id)

        movement_dice = game.moving_dice
        min_value = 1
        max_value = movement_dice.number_of_face
        number_case_moved = self.random.randint(min_value, max_value)

        movement_dice.last_number_throw = number_case_moved
        game.moving_dice = movement_dice
        self.repository.save_game(game)
