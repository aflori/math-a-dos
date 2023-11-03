import dataclasses
import json


# from .board import Board


@dataclasses.dataclass
class Player:
    name: str
    on_the_case: int
    id: int = 0

    def asDict(self):
        return json.dumps(self.__dict__)