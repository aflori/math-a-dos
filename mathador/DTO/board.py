import dataclasses

from .case import Case
from .dice import Dice
from .player import Player


@dataclasses.dataclass
class Board:
    cases: list[Case]
    dices: list[Dice]
    moving_dice: Dice
    result_dice: Dice
    players: list[Player]
    id: int = 0
