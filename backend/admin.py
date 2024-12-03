from sqlalchemy.orm import Session
import models_db
from passlib.context import CryptContext
from database_connect import SessionLocal
import secrets
import string
import openpyxl
import os

db = SessionLocal()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def add_lectures_to_database():
    lectures_list = [
        ("Michał Palczewski", "Analiza konfliktów z literatury z wykorzystaniem narzędzi teorii gier", "stosowana"),
        ("Jakub Szmelter", "Jak zebrać w jedno miejsce wszystkie możliwe kształty?", "teoretyczna"),
        ("Hubert Woszczek", "Skalowany ruch Browna z losowym wykładnikiem anomalnej dyfuzji", "stosowana"),
        ("Michał Pawlikowski", "Największe uzwarcenie jakie w życiu widziałeś", "teoretyczna"),
        ("Zuzanna Kowalczyk", "Rozprzestrzenianie się Chorób w Liczbach: Rola Łańcuchów Markowa w Epidemiologii",
         "stosowana"),
        ("Natalia Olszewska", "Gry karciane a punkty na prostych – cap set na podstawie kolorów i kształtów",
         "teoretyczna"),
        ("Michał Biesek", "Jak odgadnąć rozwiązanie, czyli o metodach iteracyjnych i wartościach własnych",
        "stosowana"),
        ("Patryk Topór", "Teoria Indeksu Punktu Stałego", "teoretyczna"),
        ("Michał Wiliński", "Teoria informacji - klucz do głębokich sieci neuronowych", "stosowana"),
        ("Alexander Golys", "Przestrzenie moduli trójkątów", "teoretyczna"),
        ("Maria Książkiewicz", "Związki matematyki i muzyki", "stosowana"),
        ("Agnieszka Widz", "Ile kosztuje Graf Losowy na wolnym rynku?", "teoretyczna"),
        ("Anna Prucnal", "Co ma sudoku do 36 oficerów? (Czyli coś o kwadratach łacińskich)", "stosowana"),
        ("Mateusz Lichman", "Nierównoważne pojęcia równoważności modeli", "teoretyczna"),
        ("Jacek Karolczak", "Duże trudności dużych modeli językowych i ich małe rozwiązanie", "stosowana"),
        ("Julia Ścisłowska", "Czarnoksiężnik z płaszczyzny zespolonej i jego topologiczne przygody", "teoretyczna"),
        (
            "Jakub Koral",
            "Rozwiązanie standardowego i ułamkowego równania Fokkera-Plancka przy pomocy metody spektralnej",
            "stosowana"),
        ("Konrad Ochędzan", "Chaos w układach dynamicznych", "teoretyczna"),
        ("Olga Leśkiewicz", "Zastosowanie elementów teorii grafów w naukach biologicznych", "stosowana"),
        ("Olaf Kołodziejski", "Wpływ dużych liczb kardynalnych na teorie kategorii", "teoretyczna"),
        (
            "Zuzanna Gawrysiak",
            "Text super-resolution: przegląd metod uczenia głębokiego do poprawy jakości zdjęć tekstu",
            "stosowana"),
        ("Bartłomiej Bychawski", "O grafach posiadających identyczne zbiory sąsiedztw", "teoretyczna"),
        ("Karol Warmiński", "Martyngały w ruletce, czyli gdy model zderza się z rzeczywistością", "stosowana"),
        ("Michalina Wytrzyszczak", "Kryptografia postkwantowa na krzywych eliptycznych", "teoretyczna"),
        ("Bartosz Żbik", "Resetowanie Stochastyczne", "stosowana"),
        ("Piotr Rysiński", "Błyskawiczny kurs 'rysowania' 3-rozmaitości, czyli rozkład Heegaarda i rączkociała",
         "teoretyczna"),
        ("Gabriela Smejda", "Twierdzenie Arrowa w wersji rozmytej", "stosowana"),
        ("Jakub Chmiel", "Permanent – krótko o złym bracie-bliźniaku wyznacznika", "teoretyczna"),
        ("Joanna Michalska", "Model support vector machine w zwalczaniu propagandy", "stosowana"),
        ("Wojciech Jaworek",
         "Twierdzenie Grobmana-Hartmana - topologiczne sprzężenie pól wektorowych i analiza jakościowa układów dynamicznych",
         "teoretyczna"),
        ("Igor Hołowacz", "Jak matematyką sterować pojazd - czyli o kontrolerach PID", "stosowana"),
        ("Patryk Rutkowski", "Niezmienniki wielkiej skali", "teoretyczna"),
        ("Krzysztof Caban", "Hipoteza Toeplitza – tajemnica krzywych Jordana", "stosowana"),
        ("Łukasz Wodnicki", "Obroty na okręgu i zastosowania", "teoretyczna"),
        ("Wiktor Wichrowski", "Zjawisko Lavrentieva i aproksymacja funkcji", "stosowana"),
        ("Bartosz Furmanek", "O szukaniu kota w worku, czyli kombinatoryczny indeks Conleya", "teoretyczna")
    ]
    for speaker_name, lecture_name, lecture_category in lectures_list:
        lecture_code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4))
        new_lecture = models_db.Lectures(
            lecture_name=lecture_name,
            speaker_name=speaker_name,
            lecture_category=lecture_category,
            lecture_code=lecture_code,
        )
        print(lecture_code)
        db.add(new_lecture)

    db.commit()
    db.close()



def add_posters_to_database():
    posters_list = [
        ("Mateusz Zdunek",
         "Implementacja matematyki w fizyce molekularnej: Metoda pasm Gaussa i równań różniczkowych drugiego rzędu w elektroabsorpcji."),
        ("Zuzanna Zuzanna", "Głosowanie bez sensu? Badanie paradoksów i anomalii Teorii Wyboru Społecznego"),
        ("Mateusz Maczka, Karol Maciejczyk", "Diagramów Younga w kontekście reprezentacji grup permutacji"),
        ("Paulina Pasierb, Oliwia Jarosz", "Analiza matematyczna w badaniach ekonomicznych: Rola funkcji jednej zmiennej w ekonometrii i ekonomii matematycznej"),
        ("Kinga Słysz, Weronika Tokarz",
         "Wzór z którym mamy do czynienia na co dzień, czyli złoty podział w otaczającym nas świecie"),
        ("Justyna Piecuch",
         "Matematyka i sztuka, czyli ukryte piękno matematyki zawarte w wielu dziedzinach naszego życia."),
        ("Joanna Michalska", "Model support vector machine w zwalczaniu propagandy"),
        ("Agnieszka Widz", "Jeśli coś kochasz, puść to wolno. Wróci do Ciebie, jeśli było ergodyczne"),
        ("Magda Wójtowicz", "Grafy przecięciowe i krawędziowe pokrycia klikowe."),
        ("Dorota Chańko", "Dwuwymiarowe twierdzenie o podrozmaitości centralnej")]

    for poster_author, poster_name in posters_list:
        new_poster = models_db.Posters(
            poster_name=poster_name,
            poster_author=poster_author,
        )
        db.add(new_poster)

    db.commit()
    db.close()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def add_users_to_database():
    file_path = os.path.join(os.getcwd(), 'super_safe_file.xlsx')
    exel_users_file = openpyxl.load_workbook(file_path)
    worksheet = exel_users_file.active
    for row in range(2, worksheet.max_row + 1):
        name_cell = worksheet.cell(row=row, column=1)
        full_name = name_cell.value
        print(full_name)
        # parts = full_name.split()
        user_login = full_name.replace(" ", "").lower()
        print(user_login)
        worksheet.cell(row=row, column=2, value=user_login)
        password_length = 5
        password = secrets.token_urlsafe(password_length)
        print(password)
        worksheet.cell(row=row, column=3, value=password)
        # exel_users_file.save(file_path)
        hashed_password = pwd_context.hash(password)

        new_user = models_db.Users(
            user_login=user_login,
            user_password=hashed_password
        )
        db.add(new_user)

    db.commit()
    db.close()




def update_all_lecture_points():
    lectures = db.query(models_db.Lectures).all()

    if not lectures:
        print("No lectures found")
        return

    for lecture in lectures:
        votes = db.query(models_db.Votes).filter(models_db.Votes.lecture_id == lecture.lecture_id).all()
        merytoryka_total, forma_total, merytoryka_count, forma_count = 0.0, 0.0, 0, 0

        for vote in votes:
            if vote.merytoryka_points is not None:
                merytoryka_total += vote.merytoryka_points
                merytoryka_count += 1
            if vote.forma_points is not None:
                forma_total += vote.forma_points
                forma_count += 1

        merytoryka_average = merytoryka_total / merytoryka_count if merytoryka_count else 0
        forma_average = forma_total / forma_count if forma_count else 0
        weighted_average = 0.6 * merytoryka_average + 0.4 * forma_average

        lecture.sum_points = weighted_average

    db.commit()
    print("Lecture points updated successfully for all lectures")


def update_posters_points():
    posters = db.query(models_db.Posters).all()

    if not posters:
        print("No posters found")
        return

    for poster in posters:
        votes = db.query(models_db.Votes_posters).filter(models_db.Votes_posters.poster_id == poster.poster_id).all()
        merytoryka_total, estetyka_total, merytoryka_count, estetyka_count = 0.0, 0.0, 0, 0

        for vote in votes:
            if vote.merytoryka_points is not None:
                merytoryka_total += vote.merytoryka_points
                merytoryka_count += 1
            if vote.estetyka_points is not None:
                estetyka_total += vote.estetyka_points
                estetyka_count += 1

        merytoryka_average = merytoryka_total / merytoryka_count if merytoryka_count else 0
        estetyka_average = estetyka_total / estetyka_count if estetyka_count else 0
        weighted_average = 0.8 * merytoryka_average + 0.2 * estetyka_average

        poster.sum_points = weighted_average

    db.commit()
    print("Posters points updated successfully for all posters")


# add_users_to_database()
add_lectures_to_database()
add_posters_to_database()

# update_all_lecture_points()
# update_posters_points()