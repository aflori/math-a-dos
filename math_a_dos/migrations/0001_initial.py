# Generated by Django 4.2.6 on 2023-11-20 17:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Case',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('case_number', models.IntegerField()),
                ('mandatory_operation', models.CharField(choices=[('+', '+'), ('-', '-'), ('*', '*'), ('/', '/'), ('.', '.')], max_length=2)),
                ('optional_operation', models.CharField(choices=[('+', '+'), ('-', '-'), ('*', '*'), ('/', '/'), ('.', '.')], default='.', max_length=2)),
                ('from_board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='math_a_dos.board')),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='math_a_dos.board')),
                ('on_case', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='math_a_dos.case')),
            ],
        ),
        migrations.CreateModel(
            name='Dice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number_of_face', models.IntegerField()),
                ('last_number_throws', models.IntegerField(default=0)),
                ('is_result_dice', models.BooleanField()),
                ('is_movement_dice', models.BooleanField()),
                ('from_board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='math_a_dos.board')),
            ],
        ),
    ]