import os
import requests


def address_to_data(address):
    request_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={os.environ.get("GOOGLE_API_KEY")}'
    try:
        data = requests.get(request_url).json().get("results")[0]
    except Exception:
        return
    return data
