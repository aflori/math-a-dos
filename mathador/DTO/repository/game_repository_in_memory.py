import copy

from mathador.DTO import board
import mathador.models


class GameRepositoryInMemory:
    def __init__(self):
        self._games = dict()

    def get_game_by_id(self, id: int):
        return copy.deepcopy(self._games[id])

    def gat_all_game(self) -> dict[int, board.Board]:
        return copy.deepcopy(self._games)

    def save_game(self, game: board.Board):
        self._games[game.id] = copy.deepcopy(game)
