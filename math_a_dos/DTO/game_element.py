import copy
import dataclasses



@dataclasses.dataclass
class Player:
    name: str
    on_the_case: int
    id: int = 0

    def asDict(self):
        return copy.deepcopy(self.__dict__)


@dataclasses.dataclass
class Case:
    case_number_on_board: int
    mandatory_operation: str
    optional_operation: str
    id: int = 0

    def asDict(self):
        return copy.deepcopy(self.__dict__)


@dataclasses.dataclass
class Dice:
    number_of_face: int
    last_number_throw: int = 0
    id: int = 0

    def asDict(self):
        return copy.deepcopy(self.__dict__)


@dataclasses.dataclass
class Board:
    cases: list[Case]
    dices: list[Dice]
    moving_dice: Dice
    result_dice: Dice
    players: list[Player]
    id: int = 0

    def asDict(self):
        dictionary = copy.deepcopy(self.__dict__)
        dictionary["players"] = [player.asDict() for player in dictionary["players"]]
        dictionary["cases"] = [case.asDict() for case in dictionary["cases"]]
        dictionary["moving_dice"] = dictionary["moving_dice"].asDict()
        dictionary["result_dice"] = dictionary["result_dice"].asDict()
        dictionary["dices"] = [dice.asDict() for dice in dictionary["dices"]]
        return dictionary
