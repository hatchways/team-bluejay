import os
import requests


def address_to_data(address):
    request_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={os.environ.get("GOOGLE_API_KEY")}'
    print(address)
    try:
        print("ABOUT TO PRINT REQUEST DATA TO GOOGLE")
        data = requests.get(request_url).json().get("results")[0]
        print(data)
    except Exception as e:
        print(e)
        return
    return data
