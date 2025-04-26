import requests
from requests import HTTPError

def fetch_residents(keyword: str) -> list[dict]:
    """
    Отримує список реєстраційних записів за ключовим словом (ЄДРПОУ або частина назви).

    :param keyword: Значення для параметра 'kw' (наприклад, код ЄДРПОУ)
    :return: Список словників з ключами:
        legalForm, name, edrpou, residenceDate,
        residenceStatus, startupFlag, incomeEligibility, decisionLink
    :raises HTTPError: у разі відповіді з кодом помилки.
    """
    url = "https://city-backend.diia.gov.ua/api/front/registry/resident"
    params = {"kw": keyword}
    
    # Виконуємо GET-запит з параметрами
    response = requests.get(url, params=params)  # Запит з параметрами через requests.get :contentReference[oaicite:0]{index=0}
    response.raise_for_status()  # Піднімає HTTPError, якщо статус != 200 :contentReference[oaicite:1]{index=1}

    # Парсимо JSON-відповідь у Python-структуру (dict/list)
    payload = response.json()  # Використовуємо вбудований JSON-декодер requests :contentReference[oaicite:2]{index=2}

    # Забираємо масив з ключем "data"
    items = payload.get("data", [])
    
    # Формуємо список спрощених записів
    results = []
    for item in items:
        results.append({
            "legalForm": item.get("legalForm"),
            "name": item.get("name"),
            "edrpou": item.get("edrpou"),
            "residenceDate": item.get("residenceDate"),
            "residenceStatus": item.get("residenceStatus"),
            "startupFlag": item.get("startupFlag"),
            "incomeEligibility": item.get("incomeEligibility"),
            "decisionLink": item.get("decisionLink"),
        })
    
    return results