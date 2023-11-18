import pytest

from math_a_dos.DTO.repository.game_repository_in_memory import GameRepositoryInMemory
from math_a_dos.action.create_game.create_game_command import CreateGame


@pytest.mark.parametrize("players, cases", [(1, 10), (2, 30)])
def test_create_board(players, cases):
    board_repo = GameRepositoryInMemory()
    command = CreateGame(board_repo)

    command.execute(cases, players)

    game = board_repo.get_game_by_id(0)

    assert (len(game.dices) == 5 and game.result_dice is not None and game.moving_dice is not None and
            len(game.players) == players and len(game.cases) == cases)
