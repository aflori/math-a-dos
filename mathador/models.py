from django.db import models


class Board(models.Model):
    pass


class Case(models.Model):
    from_board = models.ForeignKey(Board, on_delete=models.CASCADE)
    case_number = models.IntegerField()

    # enum type
    class Operation(models.TextChoices):
        ADDITION = '+', 'add'
        SUBTRACTION = '-', 'sub'
        MULTIPLICATION = '*', 'mul'
        DIVISION = '÷', 'div'
        NONE = '.', 'none'

    mandatory_operation = models.CharField(
        max_length=2,
        choices=Operation.choices
    )
    optional_operation = models.CharField(
        max_length=2,
        choices=Operation.choices,
        default=Operation.NONE
    )


class Dice(models.Model):
    number_of_face = models.IntegerField()
    last_number_throws = models.IntegerField(default=0)
    from_board = models.ForeignKey(Board, on_delete=models.CASCADE)
    is_result_dice = models.BooleanField()
    is_movement_dice = models.BooleanField()


class Player(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    on_case = models.ForeignKey(Case, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
