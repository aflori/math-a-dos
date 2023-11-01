import dataclasses


# from .board import Board


@dataclasses.dataclass
class Case:
    case_number_on_board: int
    mandatory_operation: str
    optional_operation: str
    id: int = 0
