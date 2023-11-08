import copy

from mathador.DTO import game_element
import mathador.models


class GameRepositoryInMemory:
    def __init__(self):
        self._games = dict()

    def get_game_by_id(self, id_game: int):
        return copy.deepcopy(self._games[id_game])

    def get_all_game(self) -> list[game_element.Board]:
        board_list = self._games.values()
        return [copy.deepcopy(game) for game in board_list]

    def save_game(self, game: game_element.Board):
        self._games[game.id] = copy.deepcopy(game)

    def is_not_empty(self):
        return len(self._games) != 0

    def delete(self, game: game_element.Board):
        del self._games[game.id]

    def get_player_by_id(self, id_player: int):
        for game in self._games.values():
            for player in game.players:
                if player.id == id_player:
                    return player
        return None
