import dataclasses


@dataclasses.dataclass
class SingleOperation:
    operation_done: str  # one of models.operations
    number_1: float
    number_2: float

    result: float
    available_number_after_operation: list[float]


@dataclasses.dataclass
class TotalOperation:
    mandatory_operation: list[str]
    start_number: list[int]
    awaited_result: int
    list_operation: list[SingleOperation]
