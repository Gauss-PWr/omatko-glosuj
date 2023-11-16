from sqlalchemy.orm import Session
import models_db
from passlib.context import CryptContext
from database_connect import SessionLocal
import secrets
import string

db = SessionLocal()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def add_lectures_to_database():
    lectures_list = [
    ("Michał Palczewski", "Analiza konfliktów z literatury z wykorzystaniem narzędzi teorii gier"),
    ("Jakub Szmelter", "Jak zebrać w jedno miejsce wszystkie możliwe kształty?"),
    ("Hubert Woszczek", "Skalowany ruch Browna z losowym wykładnikiem anomalnej dyfuzji"),
    ("Michał Pawlikowski", "Największe uzwarcenie jakie w życiu widziałeś"),
    ("Zuzanna Kowalczyk", "Rozprzestrzenianie się Chorób w Liczbach: Rola Łańcuchów Markowa w Epidemiologii"),
    ("Natalia Olszewska", "Gry karciane a punkty na prostych – cap set na podstawie kolorów i kształtów"),
    ("Michał Biesek", "Jak odgadnąć rozwiązanie, czyli o metodach iteracyjnych i wartościach własnych"),
    ("Patryk Topór", "Teoria Indeksu Punktu Stałego"),
    ("Michał Wiliński", "Teoria informacji - klucz do głębokich sieci neuronowych"),
    ("Alexander Golys", "Przestrzenie moduli trójkątów"),
    ("Maria Książkiewicz", "Związki matematyki i muzyki"),
    ("Agnieszka Widz", "Ile kosztuje Graf Losowy na wolnym rynku?"),
    ("Anna Prucnal", "Co ma sudoku do 36 oficerów? (Czyli coś o kwadratach łacińskich)"),
    ("Mateusz Lichman", "Nierównoważne pojęcia równoważności modeli"),
    ("Jacek Karolczak", "Duże trudności dużych modeli językowych i ich małe rozwiązanie"),
    ("Julia Ścisłowska", "Czarnoksiężnik z płaszczyzny zespolonej i jego topologiczne przygody"),
    ("Jakub Koral", "Rozwiązanie standardowego i ułamkowego równania Fokkera-Plancka przy pomocy metody spektralnej"),
    ("Konrad Ochędzan", "Chaos w układach dynamicznych"),
    ("Olga Leśkiewicz", "Zastosowanie elementów teorii grafów w naukach biologicznych"),
    ("Olaf Kołodziejski", "Wpływ dużych liczb kardynalnych na teorie kategorii"),
    ("Zuzanna Gawrysiak", "Text super-resolution: przegląd metod uczenia głębokiego do poprawy jakości zdjęć tekstu"),
    ("Bartłomiej Bychawski", "O grafach posiadających identyczne zbiory sąsiedztw"),
    ("Karol Warmiński", "Martyngały w ruletce, czyli gdy model zderza się z rzeczywistością"),
    ("Michalina Wytrzyszczak", "Kryptografia postkwantowa na krzywych eliptycznych"),
    ("Bartosz Żbik", "Resetowanie Stochastyczne"),
    ("Piotr Rysiński", "Błyskawiczny kurs 'rysowania' 3-rozmaitości, czyli rozkład Heegaarda i rączkociała"),
    ("Gabriela Smejda", "Twierdzenie Arrowa w wersji rozmytej"),
    ("Jakub Chmiel", "Permanent – krótko o złym bracie-bliźniaku wyznacznika"),
    ("Joanna Michalska", "Model support vector machine w zwalczaniu propagandy"),
    ("Wojciech Jaworek", "Twierdzenie Grobmana-Hartmana - topologiczne sprzężenie pól wektorowych i analiza jakościowa układów dynamicznych"),
    ("Igor Hołowacz", "Jak matematyką sterować pojazd - czyli o kontrolerach PID"),
    ("Patryk Rutkowski", "Niezmienniki wielkiej skali"),
    ("Krzysztof Caban", "Hipoteza Toeplitza – tajemnica krzywych Jordana"),
    ("Łukasz Wodnicki", "Obroty na okręgu i zastosowania"),
    ("Wiktor Wichrowski", "Zjawisko Lavrentieva i aproksymacja funkcji"),
    ("Bartosz Furmanek", "O szukaniu kota w worku, czyli kombinatoryczny indeks Conleya")
]
    for speaker_name, lecture_name in lectures_list:
        lecture_code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4))
        new_lecture = models_db.Lectures(
            lecture_name=lecture_name,
            speaker_name=speaker_name,
            lecture_code=lecture_code,
        )
        db.add(new_lecture)

    db.commit()
    db.close()



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def add_users_to_database(num_users=10):
    for i in range(1, num_users + 1):
        user_login = f"user{i}"
        password = str(i)

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
        merytoryka_points, forma_points, merytoryka_count, forma_count = 0, 0, 0, 0

        for vote in votes:
            if vote.category == 'merytoryka' and vote.points is not None:
                merytoryka_points += vote.points
                merytoryka_count += 1
            elif vote.category == 'forma prezentacji' and vote.points is not None:
                forma_points += vote.points
                forma_count += 1

        if merytoryka_count == 0 or forma_count == 0:
            continue

        merytoryka_average = merytoryka_points / merytoryka_count if merytoryka_count else 0
        forma_average = forma_points / forma_count if forma_count else 0
        weighted_average = 0.6 * merytoryka_average + 0.4 * forma_average
        print(type(merytoryka_points), type(merytoryka_count))
        print(type(merytoryka_average), type(forma_average))
        print(type(weighted_average))
        lecture.sum_points = weighted_average

    db.commit()
    db.close()
    print("Lecture points updated successfully for all lectures")
