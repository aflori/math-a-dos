import dataclasses


# from .board import Board


@dataclasses.dataclass
class Player:
    name: str
    on_the_case: int
    id: int = 0
