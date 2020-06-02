from flask import request
import os
import requests


def address_to_coordinates(address):
    request_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={os.environ.get("GOOGLE_API_KEY")}'
    return requests.get(request_url)