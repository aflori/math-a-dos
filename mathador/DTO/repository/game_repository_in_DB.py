from mathador.DTO.board import Board
from mathador.DTO.case import Case
from mathador.DTO.dice import Dice
from mathador.DTO.player import Player


def _extract_dice_from_model_object(dice):
    return Dice(dice.number_of_face, dice.last_number_throws, dice.id)


class GameRepositoryInDB:
    def __init__(self):
        from mathador import models
        self._board_DB = models.Board.objects
        self._case_DB = models.Case.objects
        self._dice_DB = models.Dice.objects
        self._player_DB = models.Player.objects

    def get_game_by_id(self, id_game: int):
        board = self._board_DB.get(pk=id_game)  # check if game exist

        # dices var
        dices = self._dice_DB.filter(from_board=board)
        number_dice = dices.filter(is_result_dice=False, is_movement_dice=False)
        movement_dice = dices.filter(is_movement_dice=True)[0]
        result_dice = dices.filter(is_result_dice=True)[0]
        dices = [_extract_dice_from_model_object(dice) for dice in number_dice]
        movement_dice = _extract_dice_from_model_object(movement_dice)
        result_dice = _extract_dice_from_model_object(result_dice)

        # case var
        cases = self._case_DB.filter(from_board=board).order_by("case_number")
        cases = [Case(case.case_number, case.mandatory_operation, case.optional_operation, case.id) for case in cases]

        # players var
        players = self._player_DB.filter(board=board)
        players = [Player(name=player.name, on_the_case=player.on_case.case_number, id=player.id) for player in players]

        board = Board(id=board.id, cases=cases, dices=dices, moving_dice=movement_dice, result_dice=result_dice,
                      players=players)
        return board

    def get_all_game(self):
        boards = self._board_DB.all()
        return [self.get_game_by_id(board.id) for board in boards]
    #
    # def save_game(self, game: board.Board):
    #     self._games[game.id] = copy.deepcopy(game)
