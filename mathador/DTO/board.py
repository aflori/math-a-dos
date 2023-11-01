import dataclasses

from .case import Case
from .dice import Dice
from .player import Player


@dataclasses.dataclass
class Board:
    id: int
    cases: list[Case]
    dices: list[Dice]
    players: list[Player]
