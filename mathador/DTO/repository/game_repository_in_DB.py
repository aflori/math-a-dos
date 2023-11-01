from mathador.DTO.board import Board as DTO_Board
from mathador.DTO.case import Case as DTO_Case
from mathador.DTO.dice import Dice as DTO_Dice
from mathador.DTO.player import Player as DTO_Player

from mathador.models import Board as DB_Board
from mathador.models import Case as DB_Case
from mathador.models import Dice as DB_Dice
from mathador.models import Player as DB_Player


def _extract_dice_from_model_object(dice):
    return DTO_Dice(dice.number_of_face, dice.last_number_throws, dice.id)


def _save_dice(db_board, dto_dice, result_dice=False, movement_dice=False):
    db_dice = DB_Dice(from_board=db_board, last_number_throws=dto_dice.last_number_throw,
                      number_of_face=dto_dice.number_of_face, is_result_dice=result_dice,
                      is_movement_dice=movement_dice)
    if dto_dice.id != 0:
        db_dice.id = dto_dice.id
    db_dice.save()


def _save_case(db_board, dto_case):
    db_case = DB_Case(from_board=db_board, case_number=dto_case.case_number_on_board,
                      mandatory_operation=dto_case.mandatory_operation,
                      optional_operation=dto_case.optional_operation)
    if dto_case.id != 0:
        db_case.id = dto_case.id
    db_case.save()


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
        cases = [DTO_Case(case.case_number, case.mandatory_operation, case.optional_operation, case.id) for case in
                 cases]

        # players var
        players = self._player_DB.filter(board=board)
        players = [
            DTO_Player(name=player.name, on_the_case=player.on_case.case_number if player.on_case is not None else 0,
                       id=player.id) for player in
            players]

        board = DTO_Board(id=board.id, cases=cases, dices=dices, moving_dice=movement_dice, result_dice=result_dice,
                          players=players)
        return board

    def get_all_game(self):
        boards = self._board_DB.all()
        return [self.get_game_by_id(board.id) for board in boards]

    def save_game(self, dto_board: DTO_Board):
        db_board = DB_Board()
        if dto_board.id != 0:
            db_board.id = dto_board.id
        db_board.save()

        for dto_case in dto_board.cases:
            _save_case(db_board, dto_case)

        for dto_dice in dto_board.dices:
            _save_dice(db_board, dto_dice)

        _save_dice(db_board, dto_board.moving_dice, False, True)
        _save_dice(db_board, dto_board.result_dice, True, False)

        for dto_player in dto_board.players:
            if dto_player.on_the_case == 0:
                db_player = DB_Player(board=db_board, name=dto_player.name)
            else:
                player_in_case = self._case_DB.get(from_board=db_board, case_number=dto_player.on_the_case)
                db_player = DB_Player(board=db_board, name=dto_player.name, on_case=player_in_case)

            if dto_player.id != 0:
                db_player.id = dto_player.id
            db_player.save()

    def is_not_empty(self):
        return DB_Board.objects.count() == 0

    def delete(self, board):
        self._board_DB.get(pk=board.id).delete()
