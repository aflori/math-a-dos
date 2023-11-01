from mathador.DTO.repository.gamerepositoryinmemory import GameRepositoryInMemory
from mathador.action.create_game.create_game_command import CreateGame


def test_create_board():
    board_repo = GameRepositoryInMemory()
    command = CreateGame(board_repo)

    command.execute(1, 1)

    game = board_repo.get_game_by_id(0)

    assert len(game.dices) == 5
