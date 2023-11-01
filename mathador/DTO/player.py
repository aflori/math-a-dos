import dataclasses

from .board import Board


@dataclasses.dataclass
class Player:
    id: int
    name: str
    play_on_board: Board
    on_the_case: int
