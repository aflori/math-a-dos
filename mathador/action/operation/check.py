from mathador.DTO.operation import *
import copy


class _WrongResultException(Exception):
    pass


def operation_is_valid(operations: TotalOperation) -> bool:
    try:
        operations = _convert_integer_to_float(operations)
        _awaited_result_is_present(operations.list_operation, operations.awaited_result, operations.start_number)
        _operation_result_check(operations.list_operation)
        _update_available_number_check(operations.list_operation, operations.start_number)
        _mandatory_operation_used_to_make_final_number(operations.mandatory_operation, operations.list_operation)
        return True
    except _WrongResultException:
        return False


"""
Those 4 check function raise an exception if calcul is wrongly done
"""


def _awaited_result_is_present(operation_list: list[SingleOperation], awaited_result: int,
                               original_number: list[float]):
    if (len(operation_list) == 0) and (awaited_result not in original_number):
        raise _WrongResultException

    if (len(operation_list) != 0) and (awaited_result != operation_list[-1].result):
        raise _WrongResultException()


def _operation_result_check(operations_list: list[SingleOperation]):
    for operation in operations_list:
        result = __do_local_operation(operation)

        if operation.result != result:
            raise _WrongResultException


def _update_available_number_check(operations: list[SingleOperation], original_number: list[int]):
    for operation in operations:
        __check_if_numbers_are_in_original_number_list(operation.number_1, operation.number_2, original_number)
        __check_if_reult_original_number_is_updated(original_number, operation.available_number_after_operation,
                                                    operation.number_1, operation.number_2, operation.result)

        original_number = operation.available_number_after_operation


def _mandatory_operation_used_to_make_final_number(mandatory_operations: list[str],
                                                   operation_list: list[SingleOperation]):
    mandatory_operations = copy.deepcopy(mandatory_operations)
    operation_list = copy.deepcopy(operation_list)
    __clean_unused_numbers(operation_list)
    __check_if_mandatories_operation_is_present(mandatory_operations, operation_list)


def _convert_integer_to_float(operations: TotalOperation):
    operations = copy.deepcopy(operations)
    operations.awaited_result = float(operations.awaited_result)
    for i in range(len(operations.start_number)):
        operations.start_number[i] = float(operations.start_number[i])
    for single_op in operations.list_operation:
        single_op.number_1 = float(single_op.number_1)
        single_op.number_2 = float(single_op.number_2)
        single_op.result = float(single_op.result)
        for i in range(len(single_op.available_number_after_operation)):
            single_op.available_number_after_operation[i] = float(single_op.available_number_after_operation[i])

    return operations


def __clean_unused_numbers(operation_list):
    size = len(operation_list)
    if size == 0:
        return
    last_operation = operation_list[-1]
    unused_number = copy.deepcopy(last_operation.available_number_after_operation)
    unused_number.remove(last_operation.result)

    i = size - 1
    while i >= 0:
        operation_checked = operation_list[i]
        if operation_checked.result in unused_number:
            unused_number.remove(operation_checked.result)
            operation_list.pop(i)
        i -= 1


def __check_if_mandatories_operation_is_present(mandatory_operations, operation_list):
    for operation in operation_list:
        if operation.operation_done in mandatory_operations:
            mandatory_operations.remove(operation.operation_done)
    if len(mandatory_operations) != 0:
        raise _WrongResultException


def __check_if_reult_original_number_is_updated(available_number_start: list[float], available_number_end: list[float],
                                                n1: float, n2: float, result: float):
    available_number_start = copy.deepcopy(available_number_start)
    ___remove_from_list(available_number_start, n1)
    ___remove_from_list(available_number_start, n2)
    available_number_start.append(result)
    available_number_start.sort()

    available_number_end = copy.deepcopy(available_number_end)
    available_number_end.sort()

    if available_number_start != available_number_end:
        raise _WrongResultException


def __do_local_operation(operation):
    match operation.operation_done:
        case '+':
            result = operation.number_1 + operation.number_2
        case '-':
            result = operation.number_1 - operation.number_2
        case '*':
            result = operation.number_1 * operation.number_2
        case '/':
            result = operation.number_1 / operation.number_2
        case _:
            raise _WrongResultException()
    return result


def __check_if_numbers_are_in_original_number_list(number_1, number_2, number_list):
    if number_2 == number_1:
        ___check_if_number_appear_2_time_in__list(number_1, number_list)
    elif number_1 not in number_list or number_2 not in number_list:
        raise _WrongResultException


def ___remove_from_list(original_list, element_to_remove):
    original_list.remove(element_to_remove)


def ___check_if_number_appear_2_time_in__list(number_1, original_number):
    number_apparition_number = 0
    for number in original_number:
        if number == number_1:
            number_apparition_number += 1
    if number_apparition_number < 2:
        raise _WrongResultException
