import copy

from mathador.DTO import board
import mathador.models


class GameRepositoryInMemory:
    def __init__(self):
        self._games = dict()

    def get_game_by_id(self, id_game: int):
        return copy.deepcopy(self._games[id_game])

    def get_all_game(self) -> list[board.Board]:
        board_list = self._games.values()
        return [copy.deepcopy(game) for game in board_list]

    def save_game(self, game: board.Board):
        self._games[game.id] = copy.deepcopy(game)

    def is_not_empty(self):
        return len(self._games) != 0

    def delete(self, game: board.Board):
        del self._games[game.id]
