# Omatko!!! - Głosuj

## Wersja 3.1.0

TODO:

- [x] replace logins and passwords with code
- [x] remove lecture codes and replace them with simple list of lectures
- [x] add abstracts to the lectures
- [x] categorize by days, it will be easier to search for lecture
- [x] total frontend rework
- [x] render math
- [x] close card by clicking on description
- [x] ~~swiping breaks when swaping right (why?)~~ use better swiper


## Development

### Wymagania

- python, uv
- node/deno/bun
- docker

### Kroki

1. `sudo docker -f docker-compose.dev.yml up -d`
2. `cd backend && uv sync && uv run main.py`
3. `cd frontend && npm run dev`

### Dodaj/usuń dane z backendu

`uv run -m scripts.insert_delete_data`


## Deployment

### Serwer omatko

Do łączenia się z serwerem potrzebujesz [studenckiego vpna z PWr-u](https://di.pwr.edu.pl/uslugi/siec/vpn/globalprotect-vpn-dla-studentow).

Następnie: `ssh omatko@omatko.pwr.edu.pl`.

Aby pullować z repo potrzebujesz dodać klucz ssh: `ssh-keygen -t ed25519 -C "your_email@example.com" -f filename`, następnie skopiuj zawartość klucza: `cat ~/.ssh/filename.pub` i dodaj go do swojego profilu.

Następnie odpal skrypt: `ssh-as filename` by otworzyć terminal z agentem zawierającym twój klucz.

Wejdź do folderu `apps/omatko-glosuj`, `git pull` i odpal `./scripts/app-rebuild.sh`.


## Dodawanie danych do bazy

W sumie potrzebujesz tylko dwa pliki - _users.csv_ i _conf_data.csv_.

### Użytkownicy
Schemat:
```py
  login: str
  is_admin: boolean
```
Najważniejsze żebyś uważać z adminem bo inaczej wszyscy będą widzieć wyniki.

### Wykłady i plakaty

Dane pobierasz z indico dokładnie z takimi kolumnami.

Schemat:
```py
  Id: int
  Title: str
  Submitter: str (tu może trzeba będzie kombinować jak będzie więcej niż jeden speaker)
  Accepted track: "P" | "T" | "S"
  Content: str
  Timestamp: str (albo int idk)
```

wsadzasz do to _scripts_ i tyle - docker zajmie się resztą.

## Final remarks

W sumie nie ma tu za dużo do roboty, jak ci sie nudzi to możesz napisać testy czy coś. 

