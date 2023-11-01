import dataclasses

from .board import Board


@dataclasses.dataclass
class Dice:
    id: int
    number_of_face: int
    last_number_throw: int
    on_board: Board
