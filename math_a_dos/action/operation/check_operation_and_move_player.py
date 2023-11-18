from math_a_dos.DTO.operation import *
from math_a_dos.models import operations
from math_a_dos.DTO.game_element import *
from .check import operation_is_valid


class MoveNotPossibleException(Exception):
    pass


class MovePlayerCommand:

    def __init__(self, game_repository):
        self.game_repo = game_repository

    def execute(self, game_id, list_operation: list[SingleOperation], player_id):
        game: Board = self.game_repo.get_game_by_id(game_id)
        player = None
        for p in game.players:
            if p.id == player_id:
                player = p
                break

        case_number_mandatory_operation = game.moving_dice.last_number_throw + player.on_the_case
        case_mandatory_operation = game.cases[case_number_mandatory_operation - 1]

        mandatory_operation = [case_mandatory_operation.mandatory_operation]

        if case_mandatory_operation.optional_operation not in [operations["none"], operations["random"]]:
            mandatory_operation.append(case_mandatory_operation.optional_operation)

        all_operation = TotalOperation(mandatory_operation=mandatory_operation,
                                       start_number=[dice.last_number_throw for dice in game.dices],
                                       awaited_result=game.result_dice.last_number_throw,
                                       list_operation=list_operation)

        if operation_is_valid(all_operation):
            player.on_the_case = case_number_mandatory_operation
            self.game_repo.save_game(game)
        else:
            raise MoveNotPossibleException
