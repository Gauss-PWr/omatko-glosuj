# Omatko!!! - licznik głosów

## Kilka zasad dotyczących prowadzenia tego repo:
1. Main jest święty, nigdy na nim nie commitujcie. Nawet na najmniejszą zmaine róbcie brancha.
2. W sumie nie ma drugiej zasady.

## Jak odpalić to cudo?

### Development:
1. docker compose up -d
2. python backend/main.py
3. cd front && npm run dev

Do pracy z backendem najlepiej sobie załatwić virtual environment e.g. venv, pipenv.

### Production:
1. docker compose -f docker-compose.yml build
2. docker compose up -d
