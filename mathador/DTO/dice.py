import dataclasses


# from .board import Board


@dataclasses.dataclass
class Dice:
    number_of_face: int
    last_number_throw: int = 0
    id: int = 0
