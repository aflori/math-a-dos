import dataclasses

from .board import Board


@dataclasses.dataclass
class Case:
    id: int
    board: Board
    case_number_on_board: int
    mandatory_operation: str
    optional_operation: str
