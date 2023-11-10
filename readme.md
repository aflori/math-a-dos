# math-a-dos

Petit projet inspiré du jeu de plateau mathador.

Le principe est simple, le premier à arriver sur la case final gagne.
Pour cela à chaque tour, on avance d'un nombre de cases correspondant à un dès puis on doit faire avec 5 nombre de
départ les opérations pour obtenir un nombre entre 0 et 99 en utilisant une ou deux opérations obligatoires (addition,
multiplication, soustraction ou division).

Le jeu en est qu'à une phase de développement et n'a pour le moment qu'une interface web des fonctionnalités déjà
implémentés.



Pour pouvoir lancer le projet, il faut avoir installé python 3.10 (ou plus) et django 4.2 (ou plus)

pour l'utilisation, il ne faut pas oublier de créer la base de donnée (``` python manage.py makemigrations``` and ```python manage.py migrate ```)
puis on peut lancer le serveur en local via la commande ``` python manage.py runserver ```