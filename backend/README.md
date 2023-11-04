# OMatKo-licznik

# luzne przemyslenia i komentarze bardziej niz dokumentacja na razie

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




