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

def convert_single_operation_json_to_single_list(json_operations):
    dataclass_list = []
    for operation in json_operations:
        dataclass_list.append(
            SingleOperation(
                operation_done=operation["operation_done"], number_1=operation["number_1"],
                number_2=operation["number_2"], result=operation["result"], available_number_after_operation=operation["available_number_after_operation"])
        )
    return dataclass_list