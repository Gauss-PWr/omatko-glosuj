# OMatKo-licznik

# luzne przemyslenia i komentarze bardziej niz dokumentacja na razie

### Dodawanie użytkownikow
Działa teraz tak (mniej wiecej wedlug dzisiejszych ustalen z samorzadowego), ze stworzymy sobie pliczek exelowy (teraz `super_safe_file.xlsx`) z imionami i nazwiskami uczestnikow i funkcja `add_users_to_database` z `admin.py` je sczyta, stworzy loginy: imie i 3 pierwszze litery nazwiska i randomowe hasla. Zapisze je do tego pliku exelowago i wrzuci loginy i zahashowane hasla do tabeli users. 


### Zeby odpalic kontener dockerowy z baza danych

w terminalu
```bash
docker-compose up -d
# gdyby cos sie dzialo i chcielobiscie widziec logi to 
docker-compose logs -f 
```
i o ile nie macie niczego na porcie 5432 powinno dzialac


### Działanie na bazie w pythonie

w pliku `insert_delete_data.py` jest skrypcik pomocnoczy do dodawania, usuwania i wyswietlania rekordow z tabeli w bazie.

Tak, żeby można było sobie na niej pracowac i ja ogladac z poziomu pythona, bez wchodzenia do bazy z terminala ani bez zadnego programu do graficznego jej ogladania (choicaż `DataGripa` polecam calym sercem). na ten moment endpoint /get_votes tez wyswietla wszystkie rekordy z tabeli.

w `insert_delete_data.py` tez jest sql czysty ktorym uzupelnilam swoja baze, moze sie komus przyda


