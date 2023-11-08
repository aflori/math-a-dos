import pytest

from mathador.DTO.operation import *
from mathador.action.operation.check import operation_is_valid
from mathador.models import operations


def test_result_is_in_starting_number():
    operation_tested = TotalOperation(mandatory_operation=[], start_number=[1, 2, 3, 12], awaited_result=12,
                                      list_operation=[])

    assert operation_is_valid(operation_tested)


def test_simple_check():
    operation_tested = TotalOperation(mandatory_operation=[operations["plus"]], start_number=[1, 2, 1, 5, 1],
                                      awaited_result=4, list_operation=[
            SingleOperation(operation_done=operations["plus"], number_1=1, number_2=1, result=2,
                            available_number_after_operation=[2, 2, 5, 1]),
            SingleOperation(operation_done=operations["multiplication"], number_1=2, number_2=2, result=4,
                            available_number_after_operation=[4, 5, 1])])
    assert operation_is_valid(operation_tested)


def test_complexe_operation():
    operation = TotalOperation(mandatory_operation=[operations["division"]], start_number=[2, 5, 6, 15, 12],
                               awaited_result=3, list_operation=[
            SingleOperation(operation_done=operations["multiplication"], number_1=2, number_2=15, result=30,
                            available_number_after_operation=[30, 5, 6, 12]),
            SingleOperation(operation_done=operations["plus"], number_1=30, number_2=6, result=36,
                            available_number_after_operation=[36, 5, 12]),
            SingleOperation(operation_done=operations["division"], number_1=36, number_2=12, result=3,
                            available_number_after_operation=[3, 5])
        ])

    assert operation_is_valid(operation)


def test_simple_awaited_result_not_obtained():
    operation_tested = TotalOperation(mandatory_operation=[operations["plus"]], start_number=[1, 2, 1, 5, 1],
                                      awaited_result=4, list_operation=[
            SingleOperation(operation_done=operations["plus"], number_1=1, number_2=1, result=2,
                            available_number_after_operation=[2, 2, 5, 1]),
            SingleOperation(operation_done=operations["plus"], number_1=2, number_2=1, result=3,
                            available_number_after_operation=[3, 2, 5])])
    assert not operation_is_valid(operation_tested)


def test_wrong_operation_result():
    operation_tested = TotalOperation(mandatory_operation=[], start_number=[2, 3, 4, 5], awaited_result=11,
                                      list_operation=[
                                          SingleOperation(operation_done=operations["multiplication"], number_1=2,
                                                          number_2=5, result=11,
                                                          available_number_after_operation=[11, 3, 4])
                                      ])
    assert not operation_is_valid(operation_tested)


def test_wrong_number_in_operation():
    operation = TotalOperation(mandatory_operation=[], start_number=[1, 1, 1, 2], awaited_result=5, list_operation=[
        SingleOperation(operation_done=operations["plus"], number_1=1, number_2=1, result=2,
                        available_number_after_operation=[3, 1, 2]),
        SingleOperation(operation_done=operations["plus"], number_1=3, number_2=2, result=5,
                        available_number_after_operation=[5, 1])
    ])

    assert not operation_is_valid(operation)


def test_number_in_operation_not_available():
    operation = TotalOperation(mandatory_operation=[], start_number=[1, 1, 1, 2], awaited_result=5, list_operation=[
        SingleOperation(operation_done=operations["plus"], number_1=2, number_2=2, result=4,
                        available_number_after_operation=[4, 1, 1]),
        SingleOperation(operation_done=operations["plus"], number_1=4, number_2=1, result=5,
                        available_number_after_operation=[5, 1])
    ])

    assert not operation_is_valid(operation)


def test_number_in_operation_not_available2():
    operation = TotalOperation(mandatory_operation=[], start_number=[1, 1, 1, 2], awaited_result=2, list_operation=[
        SingleOperation(operation_done=operations["plus"], number_1=1, number_2=1, result=2,
                        available_number_after_operation=[2, 2, 1]),
        SingleOperation(operation_done=operations["plus"], number_1=1, number_2=1, result=2,
                        available_number_after_operation=[2, 2, 2])
    ])

    assert not operation_is_valid(operation)


def test_mandatory_operation_missing():
    operation_tested = TotalOperation(mandatory_operation=[operations["plus"]], start_number=[1, 2, 1, 5, 1],
                                      awaited_result=4, list_operation=[
            SingleOperation(operation_done=operations["subtraction"], number_1=5, number_2=1, result=4,
                            available_number_after_operation=[4, 1, 2, 1])])
    assert not operation_is_valid(operation_tested)


def test_mandatory_operation_not_correctly_used():
    operation = TotalOperation(mandatory_operation=[operations["plus"]], start_number=[1, 2, 3, 4], awaited_result=6,
                               list_operation=[
                                   SingleOperation(operation_done=operations["plus"], number_1=1, number_2=4, result=5,
                                                   available_number_after_operation=[5, 2, 3]),
                                   SingleOperation(operation_done=operations["multiplication"], number_1=2, number_2=3,
                                                   result=6, available_number_after_operation=[6, 5]),
                               ])
    assert not operation_is_valid(operation)


def test_division_by_0():
    operation = TotalOperation(mandatory_operation=[], start_number=[1, 1, 8], awaited_result=4, list_operation=[
        SingleOperation(operation_done=operations["subtraction"], number_1=1, number_2=1, result=0,
                        available_number_after_operation=[0, 3]),  # user used - instead of +
        SingleOperation(operation_done=operations["multiplication"], number_1=8, number_2=0, result=4,
                        available_number_after_operation=[4])
    ])

    assert not operation_is_valid(operation)


def test_float_operation():
    operation = TotalOperation(mandatory_operation=[], start_number=[2, 3, 4], awaited_result=6, list_operation=[
        SingleOperation(operation_done=operations["division"], number_1=3, number_2=2, result=1.5,
                        available_number_after_operation=[1.5, 4]),
        SingleOperation(operation_done=operations["multiplication"], number_1=1.5, number_2=4, result=6,
                        available_number_after_operation=[6])
    ])

    assert operation_is_valid(operation)
